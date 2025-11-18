// app/api/chat/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/components/lib/db";
import { ObjectId } from "mongodb";

// GET - Fetch chat history
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const applicantId = searchParams.get("applicantId");
        const companyId = searchParams.get("companyId");
        const jobId = searchParams.get("jobId");

        if (!applicantId || !companyId || !jobId) {
            return NextResponse.json(
                { success: false, error: "Missing required parameters" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const chats = db.collection("chats");

        // Find or create chat session
        let chat = await chats.findOne({
            applicantId: new ObjectId(applicantId),
            companyId: new ObjectId(companyId),
            jobId: jobId
        });

        if (!chat) {
            // Create new chat session
            const newChat = {
                _id: new ObjectId(),
                applicantId: new ObjectId(applicantId),
                companyId: new ObjectId(companyId),
                jobId: jobId,
                messages: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true
            };

            const result = await chats.insertOne(newChat);
            chat = { ...newChat, _id: result.insertedId };
        }

        return NextResponse.json({
            success: true,
            chat: {
                id: chat._id,
                messages: chat.messages || [],
                applicantId: chat.applicantId,
                companyId: chat.companyId,
                jobId: chat.jobId
            }
        });

    } catch (err) {
        console.error("❌ Chat GET Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}

// POST - Send message
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            applicantId,
            companyId,
            jobId,
            jobTitle,
            message,
            senderType, // 'company' or 'applicant'
            senderId,
            senderName
        } = body;

        // Validation
        if (!applicantId || !companyId || !jobId || !message || !senderType || !senderId) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (!['company', 'applicant'].includes(senderType)) {
            return NextResponse.json(
                { success: false, error: "Invalid sender type" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const chats = db.collection("chats");
        const users = db.collection("rej_users");

        // Create message object
        const messageObj = {
            _id: new ObjectId(),
            content: message,
            senderType: senderType,
            senderId: new ObjectId(senderId),
            senderName: senderName || (senderType === 'company' ? 'Company' : 'Applicant'),
            timestamp: new Date(),
            read: false
        };

        // Find or create chat session
        const chatFilter = {
            applicantId: new ObjectId(applicantId),
            companyId: new ObjectId(companyId),
            jobId: jobId
        };

        let chat = await chats.findOne(chatFilter);

        if (!chat) {
            // Create new chat session
            const newChat = {
                _id: new ObjectId(),
                applicantId: new ObjectId(applicantId),
                companyId: new ObjectId(companyId),
                jobId: jobId,
                jobTitle: jobTitle,
                messages: [messageObj],
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true,
                lastMessage: messageObj
            };

            await chats.insertOne(newChat);
        } else {
            // Update existing chat
            await chats.updateOne(
                chatFilter,
                {
                    $push: { messages: messageObj },
                    $set: {
                        updatedAt: new Date(),
                        lastMessage: messageObj
                    }
                }
            );
        }

        // Update both user documents with chat reference
        if (senderType === 'company') {
            // Add to company's chats array
            await users.updateOne(
                { _id: new ObjectId(companyId) },
                {
                    $addToSet: {
                        chats: {
                            chatId: chat?._id || new ObjectId(),
                            applicantId: new ObjectId(applicantId),
                            jobId: jobId,
                            jobTitle: jobTitle,
                            lastMessage: messageObj,
                            updatedAt: new Date()
                        }
                    }
                }
            );

            // Add to applicant's chats array
            await users.updateOne(
                { _id: new ObjectId(applicantId) },
                {
                    $addToSet: {
                        chats: {
                            chatId: chat?._id || new ObjectId(),
                            companyId: new ObjectId(companyId),
                            jobId: jobId,
                            jobTitle: jobTitle,
                            lastMessage: messageObj,
                            updatedAt: new Date()
                        }
                    }
                }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Message sent successfully",
            messageId: messageObj._id,
            timestamp: messageObj.timestamp
        });

    } catch (err) {
        console.error("❌ Chat POST Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}

// GET - Get user chats (for sidebar/list view)
export async function GET_USER_CHATS(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const userType = searchParams.get("userType"); // 'company' or 'applicant'

        if (!userId || !userType) {
            return NextResponse.json(
                { success: false, error: "Missing required parameters" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const users = db.collection("rej_users");

        const user = await users.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        const chats = user.chats || [];

        // Populate with additional user info
        const populatedChats = await Promise.all(
            chats.map(async (chat) => {
                let otherUser;
                if (userType === 'company') {
                    otherUser = await users.findOne(
                        { _id: chat.applicantId },
                        { projection: { name: 1, profileImage: 1, position: 1 } }
                    );
                } else {
                    otherUser = await users.findOne(
                        { _id: chat.companyId },
                        { projection: { name: 1, profileImage: 1, company: 1 } }
                    );
                }

                return {
                    ...chat,
                    otherUser: otherUser || { name: 'Unknown User' }
                };
            })
        );

        // Sort by updatedAt descending
        populatedChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        return NextResponse.json({
            success: true,
            chats: populatedChats
        });

    } catch (err) {
        console.error("❌ Get User Chats Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}