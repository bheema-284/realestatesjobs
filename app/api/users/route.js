import Joi from "joi";
import bcrypt from "bcryptjs";
import clientPromise from "@/components/lib/db";
import { ObjectId } from "mongodb";

// -------------------- Validation Schemas --------------------
const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid("applicant", "recruiter").required(),
    password: Joi.string().required()
});

const resetPasswordSchema = Joi.object({
    email: Joi.string().email(),
    mobile: Joi.string(),
    newPassword: Joi.string().min(6).required(),
}).xor("email", "mobile"); // only one allowed

// --------------------------------------------------------------------
// ✅ POST – Create New User (hash password)
// --------------------------------------------------------------------
export async function POST(request) {
    try {
        const body = await request.json();
        const { error, value } = userSchema.validate(body);

        if (error)
            return new Response(JSON.stringify({ error: error.details[0].message }), { status: 400 });

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const users = db.collection("rej_users");

        // Check duplicate email
        const exist = await users.findOne({ email: value.email });
        if (exist) {
            return new Response(JSON.stringify({ error: "Email already exists" }), {
                status: 400,
            });
        }

        // Hash Password
        const hashedPw = await bcrypt.hash(value.password, 10);

        const newUser = {
            ...value,
            password: hashedPw,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await users.insertOne(newUser);

        return new Response(
            JSON.stringify({
                success: true,
                message: "User registered successfully",
                insertedId: result.insertedId,
            }),
            { status: 200 }
        );
    } catch (err) {
        console.error("❌ POST Error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

// --------------------------------------------------------------------
// ✅ GET – Fetch user(s)
// --------------------------------------------------------------------
export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const users = db.collection("rej_users");

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const name = searchParams.get("name");

        // 🔹 Get by _id
        if (id) {
            try {
                const employee = await users.findOne({ _id: new ObjectId(id) });
                if (!employee)
                    return Response.json({ error: "User not found" }, { status: 404 });

                return Response.json(employee);
            } catch (err) {
                return Response.json({ error: "Invalid ID format" }, { status: 400 });
            }
        }

        // 🔹 Search by name (case-insensitive)
        if (name) {
            const data = await users
                .find({ name: { $regex: name, $options: "i" } })
                .toArray();
            return Response.json(data);
        }

        // 🔹 Return all users
        const data = await users.find().toArray();
        return Response.json(data);

    } catch (error) {
        console.error("GET /api/users error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

// --------------------------------------------------------------------
// ✅ PUT – Reset / Forget Password
// Body: { email OR mobile, newPassword }
// --------------------------------------------------------------------
export async function PUT(request) {
    try {
        const body = await request.json();
        const { error, value } = resetPasswordSchema.validate(body);

        if (error)
            return new Response(JSON.stringify({ error: error.details[0].message }), {
                status: 400,
            });

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const users = db.collection("rej_users");

        // Build query based on which field user sent
        let query = {};
        if (value.email) query.email = value.email;
        if (value.mobile) query.mobile = value.mobile;

        // Check if user exists
        const user = await users.findOne(query);

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(value.newPassword, 10);

        await users.updateOne(query, {
            $set: {
                password: hashedPassword,
                updatedAt: new Date(),
            },
        });

        return new Response(
            JSON.stringify({
                success: true,
                message: "Password updated successfully",
            }),
            { status: 200 }
        );
    } catch (err) {
        console.error("❌ PUT Error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
