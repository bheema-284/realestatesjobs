import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/components/lib/db";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);

        const user = await db.collection("rej_users").findOne({
            email: email.trim().toLowerCase(),
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Compare hashed password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Login successful", user },
            { status: 200 }
        );

    } catch (error) {
        console.error("Login API Error:", error);
        return NextResponse.json(
            { success: false, message: "Server Error" },
            { status: 500 }
        );
    }
}
