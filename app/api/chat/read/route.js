// app/api/chat/read/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/components/lib/db";
import { ObjectId } from "mongodb";

// POST - Mark messages as read when user opens chat
export async function POST(req) {
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

        // Mark all messages as read for the specific user type
        const user = await users.findOne({ _id: new ObjectId(userId) });

        if (!user || !user.chats) {
            return NextResponse.json({
                success: true,
                message: "No chats found",
                modifiedCount: 0
            });
        }

        // Find the specific chat
        const chatIndex = user.chats.findIndex(chat => chat.chatId.toString() === chatId);

        if (chatIndex === -1) {
            return NextResponse.json({
                success: true,
                message: "Chat not found",
                modifiedCount: 0
            });
        }

        const chat = user.chats[chatIndex];

        // Count unread messages before marking as read (for logging)
        let unreadCountBefore = 0;
        if (readerType === 'company') {
            unreadCountBefore = chat.messages.filter(msg =>
                msg.senderType === 'applicant' && !msg.read
            ).length;
        } else {
            unreadCountBefore = chat.messages.filter(msg =>
                msg.senderType === 'company' && !msg.read
            ).length;
        }

        // Update messages to mark as read
        const updatedMessages = chat.messages.map(msg => {
            if (readerType === 'company' && msg.senderType === 'applicant') {
                return { ...msg, read: true };
            } else if (readerType === 'applicant' && msg.senderType === 'company') {
                return { ...msg, read: true };
            }
            return msg;
        });

        // Calculate new unread count
        let newUnreadCount = 0;
        if (readerType === 'company') {
            newUnreadCount = updatedMessages.filter(msg =>
                msg.senderType === 'applicant' && !msg.read
            ).length;
        } else {
            newUnreadCount = updatedMessages.filter(msg =>
                msg.senderType === 'company' && !msg.read
            ).length;
        }

        // Update lastMessage read status if needed
        const lastMessage = chat.lastMessage;
        let updatedLastMessage = lastMessage;
        if (lastMessage) {
            if (readerType === 'company' && lastMessage.senderType === 'applicant') {
                updatedLastMessage = { ...lastMessage, read: true };
            } else if (readerType === 'applicant' && lastMessage.senderType === 'company') {
                updatedLastMessage = { ...lastMessage, read: true };
            }
        }

        // Update the chat in database
        const updateResult = await users.updateOne(
            {
                _id: new ObjectId(userId),
                "chats.chatId": new ObjectId(chatId)
            },
            {
                $set: {
                    "chats.$.messages": updatedMessages,
                    "chats.$.unreadCount": newUnreadCount,
                    "chats.$.lastMessage": updatedLastMessage
                }
            }
        );

        return NextResponse.json({
            success: true,
            message: "Messages marked as read",
            modifiedCount: updateResult.modifiedCount,
            unreadCountBefore,
            unreadCountAfter: newUnreadCount
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}

// GET - Check for unread messages
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const userType = searchParams.get("userType");

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

        if (!user || !user.chats) {
            return NextResponse.json({
                success: true,
                unreadCount: 0,
                unreadChats: []
            });
        }

        let totalUnreadCount = 0;
        const unreadChats = [];

        // Process each chat to count unread messages
        user.chats.forEach(chat => {
            if (!chat.messages || !Array.isArray(chat.messages)) {
                return;
            }

            // Count unread messages based on user type
            let chatUnreadCount = 0;
            const unreadMessages = [];

            if (userType === 'company') {
                // For companies, count unread messages from applicants
                chatUnreadCount = chat.messages.filter(msg =>
                    msg.senderType === 'applicant' && !msg.read
                ).length;

                // Get unread messages for this chat
                unreadMessages.push(...chat.messages.filter(msg =>
                    msg.senderType === 'applicant' && !msg.read
                ));
            } else {
                // For applicants, count unread messages from companies
                chatUnreadCount = chat.messages.filter(msg =>
                    msg.senderType === 'company' && !msg.read
                ).length;

                // Get unread messages for this chat
                unreadMessages.push(...chat.messages.filter(msg =>
                    msg.senderType === 'company' && !msg.read
                ));
            }

            if (chatUnreadCount > 0) {
                totalUnreadCount += chatUnreadCount;

                unreadChats.push({
                    chatId: chat.chatId,
                    applicantId: chat.applicantId,
                    companyId: chat.companyId,
                    jobId: chat.jobId,
                    jobTitle: chat.jobTitle,
                    lastMessage: chat.lastMessage,
                    unreadCount: chatUnreadCount,
                    messages: unreadMessages // Include unread messages for notification creation
                });
            }
        });

        return NextResponse.json({
            success: true,
            unreadCount: totalUnreadCount,
            unreadChats
        });

    } catch (err) {
        console.error("❌ Get unread messages Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}