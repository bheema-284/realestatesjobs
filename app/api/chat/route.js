// app/api/chat/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/components/lib/db";
import { ObjectId } from "mongodb";

// GET - Fetch chat history between company and applicant
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const applicantId = searchParams.get("applicantId");
        const companyId = searchParams.get("companyId");
        const jobId = searchParams.get("jobId");
        const userId = searchParams.get("userId");
        const userType = searchParams.get("userType");

        // If userId and userType are provided, return user chats (for sidebar)
        if (userId && userType) {
            return await getUserChats(userId, userType);
        }

        // Otherwise, get specific chat
        if (!applicantId || !companyId || !jobId) {
            return NextResponse.json(
                { success: false, error: "Missing required parameters" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const users = db.collection("rej_users");

        // Find chat in either company or applicant's chats array
        const company = await users.findOne({
            _id: new ObjectId(companyId),
            "chats.applicantId": new ObjectId(applicantId),
            "chats.jobId": jobId
        });

        const applicant = await users.findOne({
            _id: new ObjectId(applicantId),
            "chats.companyId": new ObjectId(companyId),
            "chats.jobId": jobId
        });

        let chat = null;

        // Try to get chat from company data first, then applicant
        if (company && company.chats) {
            chat = company.chats.find(c =>
                c.applicantId.toString() === applicantId &&
                c.jobId === jobId
            );
        } else if (applicant && applicant.chats) {
            chat = applicant.chats.find(c =>
                c.companyId.toString() === companyId &&
                c.jobId === jobId
            );
        }

        // If no existing chat, create a new one in both users
        if (!chat) {
            const newChat = {
                chatId: new ObjectId(),
                applicantId: new ObjectId(applicantId),
                companyId: new ObjectId(companyId),
                jobId: jobId,
                jobTitle: "",
                messages: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                lastMessage: null,
                unreadCount: 0,
                deletedBy: [] // Track who deleted the chat
            };

            // Add to both company and applicant
            await Promise.all([
                users.updateOne(
                    { _id: new ObjectId(companyId) },
                    {
                        $push: { chats: newChat },
                        $set: { updatedAt: new Date() }
                    }
                ),
                users.updateOne(
                    { _id: new ObjectId(applicantId) },
                    {
                        $push: { chats: newChat },
                        $set: { updatedAt: new Date() }
                    }
                )
            ]);

            chat = newChat;
        }

        // Transform messages with proper status
        const transformedMessages = (chat.messages || []).map(msg => {
            const isFromApplicant = msg.senderType === 'applicant';

            // Determine status based on read status and sender
            let status = 'sent';
            if (msg.read) {
                status = 'read';
            } else if (isFromApplicant) {
                status = 'delivered';
            }

            return {
                ...msg,
                status: status
            };
        });

        return NextResponse.json({
            success: true,
            chat: {
                id: chat.chatId || chat._id,
                messages: transformedMessages,
                applicantId: chat.applicantId,
                companyId: chat.companyId,
                jobId: chat.jobId,
                deletedBy: chat.deletedBy || []
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
        const users = db.collection("rej_users");

        // Create message object with proper read status
        const messageObj = {
            _id: new ObjectId(),
            content: message,
            senderType: senderType,
            senderId: new ObjectId(senderId),
            senderName: senderName || (senderType === 'company' ? 'Company' : 'Applicant'),
            timestamp: new Date(),
            read: false, // Always false when sending - only recipient can mark as read
            status: 'sent' // Initial status
        };

        // Find existing chat to get chatId
        const companyUser = await users.findOne({
            _id: new ObjectId(companyId),
            "chats.applicantId": new ObjectId(applicantId),
            "chats.jobId": jobId
        });

        let chatId;
        if (companyUser && companyUser.chats) {
            const existingChat = companyUser.chats.find(c =>
                c.applicantId.toString() === applicantId && c.jobId === jobId
            );
            chatId = existingChat?.chatId || new ObjectId();
        } else {
            chatId = new ObjectId();
        }

        // Update both company and applicant users
        const updatePromises = [];

        // For COMPANY user
        updatePromises.push(
            users.updateOne(
                {
                    _id: new ObjectId(companyId),
                    "chats.applicantId": new ObjectId(applicantId),
                    "chats.jobId": jobId,
                    "chats.deletedBy": { $ne: 'company' }
                },
                {
                    $push: { "chats.$.messages": messageObj },
                    $set: {
                        "chats.$.lastMessage": messageObj,
                        "chats.$.updatedAt": new Date(),
                        "chats.$.jobTitle": jobTitle,
                        // Only increment unread count if message is from applicant
                        "chats.$.unreadCount": senderType === 'applicant' ? 1 : 0
                    },
                    $pull: { "chats.$.deletedBy": 'company' }
                }
            )
        );

        // For APPLICANT user
        updatePromises.push(
            users.updateOne(
                {
                    _id: new ObjectId(applicantId),
                    "chats.companyId": new ObjectId(companyId),
                    "chats.jobId": jobId,
                    "chats.deletedBy": { $ne: 'applicant' }
                },
                {
                    $push: { "chats.$.messages": messageObj },
                    $set: {
                        "chats.$.lastMessage": messageObj,
                        "chats.$.updatedAt": new Date(),
                        "chats.$.jobTitle": jobTitle,
                        // Only increment unread count if message is from company
                        "chats.$.unreadCount": senderType === 'company' ? 1 : 0
                    },
                    $pull: { "chats.$.deletedBy": 'applicant' }
                }
            )
        );

        // Execute updates
        const results = await Promise.all(updatePromises);

        // Check if any updates failed
        const needsNewChat = results.some(result => result.modifiedCount === 0);

        if (needsNewChat) {
            // Create new chat in both users with proper unread counts
            const newChat = {
                chatId: chatId,
                applicantId: new ObjectId(applicantId),
                companyId: new ObjectId(companyId),
                jobId: jobId,
                jobTitle: jobTitle,
                messages: [messageObj],
                lastMessage: messageObj,
                createdAt: new Date(),
                updatedAt: new Date(),
                // Set unread count based on who sent the message
                unreadCount: senderType === 'company' ? 1 : 0, // For applicant
                deletedBy: []
            };

            await Promise.all([
                // Company chat - unread if message from applicant
                users.updateOne(
                    { _id: new ObjectId(companyId) },
                    {
                        $push: {
                            chats: {
                                ...newChat,
                                unreadCount: senderType === 'applicant' ? 1 : 0
                            }
                        },
                        $set: { updatedAt: new Date() }
                    }
                ),
                // Applicant chat - unread if message from company
                users.updateOne(
                    { _id: new ObjectId(applicantId) },
                    {
                        $push: {
                            chats: {
                                ...newChat,
                                unreadCount: senderType === 'company' ? 1 : 0
                            }
                        },
                        $set: { updatedAt: new Date() }
                    }
                )
            ]);
        }

        return NextResponse.json({
            success: true,
            message: "Message sent successfully",
            messageId: messageObj._id,
            timestamp: messageObj.timestamp,
            chatId: chatId,
            status: 'sent'
        });

    } catch (err) {
        console.error("❌ Chat POST Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}

// PUT - Mark messages as read
export async function PUT(req) {
    try {
        const body = await req.json();
        const { chatId, readerType, applicantId, companyId, jobId } = body;

        if (!chatId || !readerType) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const users = db.collection("rej_users");

        // Determine which user to update based on readerType
        const userId = readerType === 'company' ? companyId : applicantId;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Missing user ID" },
                { status: 400 }
            );
        }

        // Mark all messages as read and reset unread count for the specific user
        const updateResult = await users.updateOne(
            {
                _id: new ObjectId(userId),
                "chats.chatId": new ObjectId(chatId)
            },
            {
                $set: {
                    "chats.$.unreadCount": 0,
                    "chats.$.lastMessage.read": true,
                    "chats.$.messages.$[].read": true,
                    "chats.$.messages.$[].status": "read"
                }
            }
        );

        return NextResponse.json({
            success: true,
            message: "Messages marked as read",
            modifiedCount: updateResult.modifiedCount
        });

    } catch (err) {
        console.error("❌ Mark as read Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}

// DELETE - Delete chat or specific messages (WhatsApp-style: only for the deleting user)

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const chatId = searchParams.get("chatId");
        const applicantId = searchParams.get("applicantId");
        const companyId = searchParams.get("companyId");
        const jobId = searchParams.get("jobId");
        const messageIds = searchParams.get("messageIds");
        const messageId = searchParams.get("messageId");
        const deleteType = searchParams.get("type");
        const deletedBy = searchParams.get("deletedBy");

        console.log('🗑️ Delete request:', {
            chatId, applicantId, companyId, jobId, messageIds, messageId, deleteType, deletedBy
        });

        if (!deletedBy || !['company', 'applicant'].includes(deletedBy)) {
            return NextResponse.json(
                { success: false, error: "Missing or invalid deletedBy parameter" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const users = db.collection("rej_users");

        // Helper function to find user by chatId
        async function findUserByChatId(chatId, deletedBy) {
            try {
                console.log('🔍 Looking for user with chatId:', chatId, 'deletedBy:', deletedBy);

                // Find any user who has this chatId in their chats
                const user = await users.findOne({
                    "chats.chatId": new ObjectId(chatId)
                });

                console.log('🔍 Found user:', user?._id ? user._id.toString() : 'No user found');

                if (user) {
                    // Find the specific chat to get the actual user IDs
                    const chat = user.chats.find(c => c.chatId.toString() === chatId);
                    if (chat) {
                        console.log('🔍 Chat found:', {
                            applicantId: chat.applicantId?.toString(),
                            companyId: chat.companyId?.toString(),
                            jobId: chat.jobId
                        });

                        // Return the appropriate user ID based on who is deleting
                        if (deletedBy === 'company' && chat.companyId) {
                            return chat.companyId.toString();
                        } else if (deletedBy === 'applicant' && chat.applicantId) {
                            return chat.applicantId.toString();
                        }
                    }
                }

                return null;
            } catch (error) {
                console.error('Error finding user by chatId:', error);
                return null;
            }
        }

        // Helper function to update last message
        async function updateLastMessage(userId, chatId) {
            try {
                const user = await users.findOne(
                    { _id: new ObjectId(userId), "chats.chatId": new ObjectId(chatId) },
                    { projection: { "chats.$": 1 } }
                );

                if (user && user.chats && user.chats[0] && user.chats[0].messages) {
                    const messages = user.chats[0].messages;
                    if (messages.length > 0) {
                        const lastMessage = messages[messages.length - 1];
                        await users.updateOne(
                            { _id: new ObjectId(userId), "chats.chatId": new ObjectId(chatId) },
                            { 
                                $set: { 
                                    "chats.$.lastMessage": lastMessage,
                                    "chats.$.updatedAt": new Date()
                                }
                            }
                        );
                    } else {
                        // If no messages left, set empty last message
                        await users.updateOne(
                            { _id: new ObjectId(userId), "chats.chatId": new ObjectId(chatId) },
                            { 
                                $set: { 
                                    "chats.$.lastMessage": null,
                                    "chats.$.updatedAt": new Date()
                                }
                            }
                        );
                    }
                }
            } catch (error) {
                console.error('Error updating last message:', error);
            }
        }

        // Handle multiple message deletion (WhatsApp-style: only for deleting user)
        if (deleteType === 'message' && messageIds && chatId && deletedBy) {
            console.log('🗑️ Deleting multiple messages for user only with chatId:', chatId);

            // Find user by chatId and deletedBy
            const userId = await findUserByChatId(chatId, deletedBy);

            if (!userId) {
                return NextResponse.json(
                    { success: false, error: "User not found for this chat" },
                    { status: 404 }
                );
            }

            const messageIdArray = messageIds.split(',').map(id => new ObjectId(id.trim()));

            console.log('🗑️ Deleting multiple messages only for user:', userId, 'messages:', messageIdArray);

            // Delete messages only for this specific user
            const updateResult = await users.updateOne(
                {
                    _id: new ObjectId(userId),
                    "chats.chatId": new ObjectId(chatId)
                },
                {
                    $pull: {
                        "chats.$.messages": {
                            _id: { $in: messageIdArray }
                        }
                    },
                    $set: { "chats.$.updatedAt": new Date() }
                }
            );

            if (updateResult.modifiedCount === 0) {
                return NextResponse.json(
                    { success: false, error: "No messages found to delete or chat not found" },
                    { status: 404 }
                );
            }

            // Update last message for this user only
            await updateLastMessage(userId, chatId);

            return NextResponse.json({
                success: true,
                message: `${messageIdArray.length} messages deleted successfully for your view only`,
                deletedCount: messageIdArray.length,
                deletedFor: deletedBy
            });

        }
        // Handle single message deletion (WhatsApp-style: only for deleting user)
        else if (deleteType === 'message' && messageId && chatId && deletedBy) {
            console.log('🗑️ Deleting single message for user only with chatId:', chatId);

            // Find user by chatId and deletedBy
            const userId = await findUserByChatId(chatId, deletedBy);

            if (!userId) {
                return NextResponse.json(
                    { success: false, error: "User not found for this chat" },
                    { status: 404 }
                );
            }

            console.log('🗑️ Deleting single message only for user:', userId, 'message:', messageId);

            // Delete message only for this specific user
            const updateResult = await users.updateOne(
                {
                    _id: new ObjectId(userId),
                    "chats.chatId": new ObjectId(chatId)
                },
                {
                    $pull: { 
                        "chats.$.messages": { _id: new ObjectId(messageId) } 
                    },
                    $set: { "chats.$.updatedAt": new Date() }
                }
            );

            if (updateResult.modifiedCount === 0) {
                return NextResponse.json(
                    { success: false, error: "Message not found or chat not found" },
                    { status: 404 }
                );
            }

            // Update last message for this user only
            await updateLastMessage(userId, chatId);

            return NextResponse.json({
                success: true,
                message: "Message deleted successfully for your view only",
                deletedFor: deletedBy
            });

        }
        // Handle chat deletion by chatId (WhatsApp-style: only for deleting user)
        else if (deleteType === 'chat' && chatId && deletedBy) {
            console.log('🗑️ Deleting chat by chatId for user only:', chatId);

            // Find user by chatId and deletedBy
            const userId = await findUserByChatId(chatId, deletedBy);

            if (!userId) {
                return NextResponse.json(
                    { success: false, error: "User not found for this chat" },
                    { status: 404 }
                );
            }

            console.log('🗑️ Removing chat completely for user only:', userId);

            // Remove the chat only for this specific user
            const updateResult = await users.updateOne(
                {
                    _id: new ObjectId(userId)
                },
                {
                    $pull: {
                        chats: { chatId: new ObjectId(chatId) }
                    },
                    $set: { updatedAt: new Date() }
                }
            );

            if (updateResult.modifiedCount === 0) {
                return NextResponse.json(
                    { success: false, error: "Chat not found or already deleted" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: "Chat deleted successfully for your account only",
                deletedFor: deletedBy,
                modifiedCount: updateResult.modifiedCount
            });

        }
        // Handle chat deletion by applicantId, companyId, and jobId (WhatsApp-style: only for deleting user)
        else if (applicantId && companyId && jobId && deletedBy) {
            const userId = deletedBy === 'company' ? companyId : applicantId;

            console.log('🗑️ Deleting chat by IDs for user only:', { applicantId, companyId, jobId, userId });

            // Remove the chat only for this specific user
            const updateResult = await users.updateOne(
                {
                    _id: new ObjectId(userId)
                },
                {
                    $pull: {
                        chats: {
                            applicantId: new ObjectId(applicantId),
                            companyId: new ObjectId(companyId),
                            jobId: jobId
                        }
                    },
                    $set: { updatedAt: new Date() }
                }
            );

            if (updateResult.modifiedCount === 0) {
                return NextResponse.json(
                    { success: false, error: "Chat not found or already deleted" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: "Chat deleted successfully for your account only",
                deletedFor: deletedBy,
                modifiedCount: updateResult.modifiedCount
            });

        } else {
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing required parameters for deletion. Required: type, deletedBy, and either chatId or (applicantId, companyId, jobId)"
                },
                { status: 400 }
            );
        }

    } catch (err) {
        console.error("❌ Chat DELETE Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}