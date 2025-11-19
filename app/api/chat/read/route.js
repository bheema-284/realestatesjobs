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

        // Call the mark-read service instead of handling it here
        const markReadResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/chat/mark-read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chatId,
                applicantId,
                companyId,
                jobId,
                userId,
                userType: readerType
            })
        });

        const markReadResult = await markReadResponse.json();

        if (markReadResult.success) {
            return NextResponse.json({
                success: true,
                message: "Messages marked as read via mark-read service",
                modifiedCount: markReadResult.modifiedCount,
                data: markReadResult
            });
        } else {
            return NextResponse.json(
                { success: false, error: markReadResult.error || "Failed to mark messages as read" },
                { status: 500 }
            );
        }

    } catch (err) {
        console.error("❌ Chat Read POST Error:", err);
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
        const excludeChatId = searchParams.get("excludeChatId");

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

            // Skip excluded chat (currently open chat)
            if (excludeChatId && chat.chatId?.toString() === excludeChatId) {
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
                    chatId: chat.chatId?.toString(),
                    applicantId: chat.applicantId?.toString(),
                    companyId: chat.companyId?.toString(),
                    jobId: chat.jobId,
                    jobTitle: chat.jobTitle,
                    lastMessage: chat.lastMessage,
                    unreadCount: chatUnreadCount,
                    messages: unreadMessages.slice(-3) // Last 3 unread messages for notifications
                });
            }
        });

        return NextResponse.json({
            success: true,
            unreadCount: totalUnreadCount,
            unreadChats,
            totalChats: user.chats.length
        });

    } catch (err) {
        console.error("❌ Get unread messages Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}