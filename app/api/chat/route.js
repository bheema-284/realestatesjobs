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
                lastMessage: null
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

        return NextResponse.json({
            success: true,
            chat: {
                id: chat.chatId || chat._id,
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

        // Create chat reference update object
        const chatUpdate = {
            jobTitle: jobTitle,
            lastMessage: messageObj,
            updatedAt: new Date(),
            // Increment unread count for the recipient
            $inc: {
                "chats.$[chat].unreadCount": 1
            }
        };

        // Remove unread count increment if not needed
        delete chatUpdate.$inc;

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
                    "chats.jobId": jobId
                },
                {
                    $push: { "chats.$.messages": messageObj },
                    $set: {
                        "chats.$.lastMessage": messageObj,
                        "chats.$.updatedAt": new Date(),
                        "chats.$.jobTitle": jobTitle,
                        "chats.$.unreadCount": senderType === 'applicant' ? 1 : 0
                    }
                }
            )
        );

        // For APPLICANT user
        updatePromises.push(
            users.updateOne(
                { 
                    _id: new ObjectId(applicantId),
                    "chats.companyId": new ObjectId(companyId),
                    "chats.jobId": jobId
                },
                {
                    $push: { "chats.$.messages": messageObj },
                    $set: {
                        "chats.$.lastMessage": messageObj,
                        "chats.$.updatedAt": new Date(),
                        "chats.$.jobTitle": jobTitle,
                        "chats.$.unreadCount": senderType === 'company' ? 1 : 0
                    }
                }
            )
        );

        // Execute updates
        const results = await Promise.all(updatePromises);

        // Check if any updates failed (no existing chat found)
        const needsNewChat = results.some(result => result.modifiedCount === 0);

        if (needsNewChat) {
            // Create new chat in both users
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
                unreadCount: senderType === 'company' ? 0 : 1 // Recipient gets unread count
            };

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
                        $push: { chats: { ...newChat, unreadCount: senderType === 'applicant' ? 0 : 1 } },
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
            chatId: chatId
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
        const { chatId, messageId, readerType, applicantId, companyId, jobId } = body;

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

        // Mark specific message as read and reset unread count
        const updateResult = await users.updateOne(
            { 
                _id: new ObjectId(userId),
                "chats.chatId": new ObjectId(chatId)
            },
            {
                $set: {
                    "chats.$.unreadCount": 0,
                    "chats.$.lastMessage.read": true,
                    "chats.$.messages.$[msg].read": true
                }
            },
            {
                arrayFilters: [
                    {
                        "msg._id": messageId ? new ObjectId(messageId) : { $exists: true }
                    }
                ]
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

// DELETE - Delete chat or specific messages
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const chatId = searchParams.get("chatId");
        const applicantId = searchParams.get("applicantId");
        const companyId = searchParams.get("companyId");
        const jobId = searchParams.get("jobId");
        const messageId = searchParams.get("messageId");
        const deleteType = searchParams.get("type"); // 'chat' or 'message'

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const users = db.collection("rej_users");

        if (deleteType === 'message' && messageId && chatId) {
            // Delete specific message from chat
            const updateResult = await users.updateMany(
                {
                    $or: [
                        { _id: new ObjectId(companyId) },
                        { _id: new ObjectId(applicantId) }
                    ],
                    "chats.chatId": new ObjectId(chatId)
                },
                {
                    $pull: { "chats.$.messages": { _id: new ObjectId(messageId) } }
                }
            );

            // Update last message if needed
            if (updateResult.modifiedCount > 0) {
                // Get updated chat to find new last message
                const userWithChat = await users.findOne({
                    "chats.chatId": new ObjectId(chatId)
                });

                if (userWithChat && userWithChat.chats) {
                    const chat = userWithChat.chats.find(c => c.chatId.toString() === chatId);
                    if (chat && chat.messages.length > 0) {
                        const lastMessage = chat.messages[chat.messages.length - 1];
                        
                        await users.updateMany(
                            {
                                $or: [
                                    { _id: new ObjectId(companyId) },
                                    { _id: new ObjectId(applicantId) }
                                ],
                                "chats.chatId": new ObjectId(chatId)
                            },
                            {
                                $set: { "chats.$.lastMessage": lastMessage }
                            }
                        );
                    } else {
                        // No messages left, clear lastMessage
                        await users.updateMany(
                            {
                                $or: [
                                    { _id: new ObjectId(companyId) },
                                    { _id: new ObjectId(applicantId) }
                                ],
                                "chats.chatId": new ObjectId(chatId)
                            },
                            {
                                $unset: { "chats.$.lastMessage": "" }
                            }
                        );
                    }
                }
            }

            return NextResponse.json({
                success: true,
                message: "Message deleted successfully"
            });

        } else if (deleteType === 'chat' && chatId) {
            // Delete entire chat from both users
            await users.updateMany(
                {
                    $or: [
                        { _id: new ObjectId(companyId) },
                        { _id: new ObjectId(applicantId) }
                    ]
                },
                {
                    $pull: { 
                        chats: { 
                            chatId: new ObjectId(chatId) 
                        } 
                    }
                }
            );

            return NextResponse.json({
                success: true,
                message: "Chat deleted successfully"
            });

        } else if (applicantId && companyId && jobId) {
            // Delete chat by applicantId, companyId, and jobId
            await users.updateMany(
                {
                    $or: [
                        { _id: new ObjectId(companyId) },
                        { _id: new ObjectId(applicantId) }
                    ]
                },
                {
                    $pull: { 
                        chats: { 
                            applicantId: new ObjectId(applicantId),
                            companyId: new ObjectId(companyId),
                            jobId: jobId
                        } 
                    }
                }
            );

            return NextResponse.json({
                success: true,
                message: "Chat deleted successfully"
            });

        } else {
            return NextResponse.json(
                { success: false, error: "Missing required parameters for deletion" },
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
                        { projection: { name: 1, applicantName: 1, profileImage: 1, position: 1 } }
                    );
                } else {
                    otherUser = await users.findOne(
                        { _id: chat.companyId },
                        { projection: { name: 1, profileImage: 1, companyName: 1 } }
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