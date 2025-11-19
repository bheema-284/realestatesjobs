import { NextResponse } from "next/server";
import clientPromise from "@/components/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req) {
    try {
        const body = await req.json();
        const { chatId, applicantId, companyId, jobId, userId, userType } = body;

        console.log('📝 Mark as read request:', { chatId, applicantId, companyId, jobId, userId, userType });

        if (!userId || !userType) {
            return NextResponse.json(
                { success: false, error: "Missing user ID or type" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const users = db.collection("rej_users");

        let query = {};
        let updateField = {};
        let arrayFilters = [];

        if (chatId) {
            // Mark specific chat as read
            query = {
                _id: new ObjectId(userId),
                "chats.chatId": new ObjectId(chatId)
            };

            if (userType === 'company') {
                // Company marks applicant's messages as read
                updateField = {
                    $set: {
                        "chats.$.unreadCount": 0,
                        "chats.$.messages.$[msg].read": true,
                        "chats.$.messages.$[msg].status": "read"
                    }
                };
                arrayFilters = [{ "msg.senderType": "applicant" }];
            } else {
                // Applicant marks company's messages as read
                updateField = {
                    $set: {
                        "chats.$.unreadCount": 0,
                        "chats.$.messages.$[msg].read": true,
                        "chats.$.messages.$[msg].status": "read"
                    }
                };
                arrayFilters = [{ "msg.senderType": "company" }];
            }
        } else if (applicantId && companyId && jobId) {
            // Mark chat by participant IDs
            if (userType === 'company') {
                query = {
                    _id: new ObjectId(userId),
                    "chats.applicantId": new ObjectId(applicantId),
                    "chats.companyId": new ObjectId(companyId),
                    "chats.jobId": jobId
                };
                // Company marks applicant's messages as read
                updateField = {
                    $set: {
                        "chats.$.unreadCount": 0,
                        "chats.$.messages.$[msg].read": true,
                        "chats.$.messages.$[msg].status": "read"
                    }
                };
                arrayFilters = [{ "msg.senderType": "applicant" }];
            } else {
                query = {
                    _id: new ObjectId(userId),
                    "chats.applicantId": new ObjectId(applicantId),
                    "chats.companyId": new ObjectId(companyId),
                    "chats.jobId": jobId
                };
                // Applicant marks company's messages as read
                updateField = {
                    $set: {
                        "chats.$.unreadCount": 0,
                        "chats.$.messages.$[msg].read": true,
                        "chats.$.messages.$[msg].status": "read"
                    }
                };
                arrayFilters = [{ "msg.senderType": "company" }];
            }
        } else {
            return NextResponse.json(
                { success: false, error: "Missing required parameters" },
                { status: 400 }
            );
        }

        // Update last message read status if needed
        const user = await users.findOne(query);
        if (user && user.chats) {
            const chat = user.chats.find(c =>
                (chatId && c.chatId?.toString() === chatId) ||
                (applicantId && companyId && jobId &&
                    c.applicantId?.toString() === applicantId &&
                    c.companyId?.toString() === companyId &&
                    c.jobId === jobId)
            );

            if (chat && chat.lastMessage) {
                const shouldUpdateLastMessage =
                    (userType === 'company' && chat.lastMessage.senderType === 'applicant') ||
                    (userType === 'applicant' && chat.lastMessage.senderType === 'company');

                if (shouldUpdateLastMessage) {
                    updateField.$set["chats.$.lastMessage.read"] = true;
                }
            }
        }

        const updateResult = await users.updateOne(
            query,
            updateField,
            { arrayFilters: arrayFilters }
        );

        console.log('📝 Mark as read result:', {
            matchedCount: updateResult.matchedCount,
            modifiedCount: updateResult.modifiedCount
        });

        if (updateResult.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: "Chat not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Messages marked as read successfully",
            modifiedCount: updateResult.modifiedCount,
            userType: userType,
            markedMessagesFrom: userType === 'company' ? 'applicant' : 'company'
        });

    } catch (err) {
        console.error("❌ Mark as read Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}

// GET - Check if specific chat has unread messages
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const chatId = searchParams.get("chatId");
        const userId = searchParams.get("userId");
        const userType = searchParams.get("userType");

        if (!chatId || !userId || !userType) {
            return NextResponse.json(
                { success: false, error: "Missing required parameters" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const users = db.collection("rej_users");

        const user = await users.findOne({
            _id: new ObjectId(userId),
            "chats.chatId": new ObjectId(chatId)
        });

        if (!user || !user.chats) {
            return NextResponse.json({
                success: true,
                hasUnreadMessages: false,
                unreadCount: 0
            });
        }

        const chat = user.chats.find(c => c.chatId.toString() === chatId);

        if (!chat || !chat.messages) {
            return NextResponse.json({
                success: true,
                hasUnreadMessages: false,
                unreadCount: 0
            });
        }

        let unreadCount = 0;

        if (userType === 'company') {
            unreadCount = chat.messages.filter(msg =>
                msg.senderType === 'applicant' && !msg.read
            ).length;
        } else {
            unreadCount = chat.messages.filter(msg =>
                msg.senderType === 'company' && !msg.read
            ).length;
        }

        return NextResponse.json({
            success: true,
            hasUnreadMessages: unreadCount > 0,
            unreadCount: unreadCount,
            chatId: chatId
        });

    } catch (err) {
        console.error("❌ Check unread messages Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}