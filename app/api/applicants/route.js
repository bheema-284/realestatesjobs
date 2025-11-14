import clientPromise from "@/components/lib/db";
import { ObjectId } from "mongodb";

// --------------------------------------------------------------------
// ✅ GET – Fetch all applicant data with complete fields
// --------------------------------------------------------------------
export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const usersCollection = db.collection("rej_users");

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const email = searchParams.get("email");
        const userId = searchParams.get("userId");
        const getUserData = searchParams.get("getUserData");

        // 🔹 CASE 1: Get specific applicant by ID (logged in user or direct ID)
        if (userId || getUserData === "true" || id) {
            const targetId = userId || id;

            if (targetId) {
                try {
                    const user = await usersCollection.findOne({
                        _id: new ObjectId(targetId),
                        role: "applicant"
                    });

                    if (!user) {
                        return Response.json({ error: "Applicant not found" }, { status: 404 });
                    }

                    // Return complete applicant data with all fields
                    return Response.json(user);
                } catch (err) {
                    return Response.json({ error: "Invalid ID format" }, { status: 400 });
                }
            }
        }

        // 🔹 CASE 2: Get specific applicant by email
        if (email) {
            const applicant = await usersCollection.findOne({
                email: email,
                role: "applicant"
            });

            if (!applicant) {
                return Response.json({ error: "Applicant not found with this email" }, { status: 404 });
            }

            // Return complete applicant data with all fields
            return Response.json(applicant);
        }

        // 🔹 CASE 3: Default - return ALL applicants with complete data
        const allApplicants = await usersCollection.find({
            role: "applicant"
        }).toArray();

        // Return all applicants with all fields
        return Response.json(allApplicants);

    } catch (error) {
        console.error("GET /api/applicants error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}