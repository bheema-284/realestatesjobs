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

        // First, find the user and their chats
        const user = await users.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        // If user has no chats, return success (nothing to mark as read)
        if (!user.chats || user.chats.length === 0) {
            console.log('📝 No chats found for user, returning success');
            return NextResponse.json({
                success: true,
                message: "No chats to mark as read",
                modifiedCount: 0,
                userType: userType
            });
        }

        let targetChats = [];

        if (chatId) {
            // Find all chats with this chatId (there might be duplicates)
            targetChats = user.chats.filter(chat =>
                chat.chatId && chat.chatId.toString() === chatId
            );
        } else if (applicantId && companyId && jobId) {
            // Find chats by participant IDs - with better error handling
            targetChats = user.chats.filter(chat => {
                const chatApplicantId = chat.applicantId?.toString();
                const chatCompanyId = chat.companyId?.toString();
                const chatJobId = chat.jobId?.toString();

                return chatApplicantId === applicantId &&
                    chatCompanyId === companyId &&
                    chatJobId === jobId;
            });
        } else {
            return NextResponse.json(
                { success: false, error: "Missing required parameters" },
                { status: 400 }
            );
        }

        if (targetChats.length === 0) {
            console.log('📝 No matching chats found for user:', {
                userId,
                userType,
                chatId,
                applicantId,
                companyId,
                jobId,
                availableChats: user.chats.map(chat => ({
                    chatId: chat.chatId?.toString(),
                    applicantId: chat.applicantId?.toString(),
                    companyId: chat.companyId?.toString(),
                    jobId: chat.jobId
                }))
            });

            // Instead of returning error, return success with modifiedCount: 0
            return NextResponse.json({
                success: true,
                message: "No matching chats found to mark as read",
                modifiedCount: 0,
                userType: userType,
                warning: "Chat not found in user's chat list"
            });
        }

        console.log(`📝 Found ${targetChats.length} chat(s) to update for user:`, userId);

        // Update all matching chats
        const updateOperations = [];
        const senderTypeToMark = userType === 'company' ? 'applicant' : 'company';

        for (const chat of targetChats) {
            // Build the update operation for each chat
            const updateField = {};

            // Update unreadCount to 0
            updateField[`chats.$.unreadCount`] = 0;

            // Update messages read status
            if (chat.messages && chat.messages.length > 0) {
                let hasUnreadMessages = false;

                chat.messages.forEach((message, index) => {
                    if (message.senderType === senderTypeToMark && !message.read) {
                        updateField[`chats.$.messages.${index}.read`] = true;
                        updateField[`chats.$.messages.${index}.status`] = "read";
                        hasUnreadMessages = true;
                    }
                });

                // If no unread messages found, skip this chat update
                if (!hasUnreadMessages) {
                    console.log('📝 No unread messages found in chat, skipping update');
                    continue;
                }
            }

            // Update last message if applicable
            if (chat.lastMessage &&
                chat.lastMessage.senderType === senderTypeToMark &&
                !chat.lastMessage.read) {
                updateField[`chats.$.lastMessage.read`] = true;
                updateField[`chats.$.lastMessage.status`] = "read";
            }

            // Only add update if there are fields to update
            if (Object.keys(updateField).length > 0) {
                let query = {
                    _id: new ObjectId(userId),
                    "chats.chatId": new ObjectId(chat.chatId)
                };

                // For non-chatId queries, add additional filters to ensure we update the correct chat
                if (!chatId && chat.applicantId && chat.companyId) {
                    query["chats.applicantId"] = new ObjectId(chat.applicantId);
                    query["chats.companyId"] = new ObjectId(chat.companyId);
                    query["chats.jobId"] = chat.jobId;
                }

                updateOperations.push({
                    updateOne: {
                        filter: query,
                        update: { $set: updateField }
                    }
                });
            }
        }

        let totalModified = 0;

        if (updateOperations.length > 0) {
            try {
                const bulkWriteResult = await users.bulkWrite(updateOperations);
                totalModified = bulkWriteResult.modifiedCount;
                console.log('📝 Bulk write result:', {
                    matchedCount: bulkWriteResult.matchedCount,
                    modifiedCount: bulkWriteResult.modifiedCount,
                    operations: updateOperations.length
                });
            } catch (bulkError) {
                console.error('❌ Bulk write error:', bulkError);
                // Don't throw error, just return with modifiedCount: 0
                console.log('📝 Continuing despite bulk write error');
            }
        }

        return NextResponse.json({
            success: true,
            message: "Messages marked as read successfully",
            modifiedCount: totalModified,
            userType: userType,
            markedMessagesFrom: userType === 'company' ? 'applicant' : 'company',
            chatsUpdated: targetChats.length,
            operationsAttempted: updateOperations.length
        });

    } catch (err) {
        console.error("❌ Mark as read Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}

// GET - Check if specific chat has unread messages (optimized version)
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
            _id: new ObjectId(userId)
        });

        if (!user || !user.chats) {
            return NextResponse.json({
                success: true,
                hasUnreadMessages: false,
                unreadCount: 0
            });
        }

        // Find all chats with this chatId (handle duplicates)
        const chats = user.chats.filter(chat =>
            chat.chatId && chat.chatId.toString() === chatId
        );

        if (chats.length === 0) {
            return NextResponse.json({
                success: true,
                hasUnreadMessages: false,
                unreadCount: 0
            });
        }

        let totalUnreadCount = 0;
        const senderTypeToCheck = userType === 'company' ? 'applicant' : 'company';

        // Calculate total unread count across all duplicate chats
        chats.forEach(chat => {
            if (chat.messages) {
                const unreadMessages = chat.messages.filter(msg =>
                    msg.senderType === senderTypeToCheck && !msg.read
                );
                totalUnreadCount += unreadMessages.length;
            }
        });

        return NextResponse.json({
            success: true,
            hasUnreadMessages: totalUnreadCount > 0,
            unreadCount: totalUnreadCount,
            chatId: chatId,
            duplicateChatsFound: chats.length
        });

    } catch (err) {
        console.error("❌ Check unread messages Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}