import clientPromise from "@/components/lib/db";
import Joi from "joi";
import { ObjectId } from "mongodb";

// ✅ JOI Schema
const applySchema = Joi.object({
    userId: Joi.string().required(),
    jobId: Joi.string().required(),
    jobTitle: Joi.string().required(),
    category: Joi.string().required(),
});

export async function POST(request) {
    try {
        const body = await request.json();

        // 🔍 Validate with JOI
        const { error, value } = applySchema.validate(body);
        if (error) {
            return new Response(
                JSON.stringify({ error: error.details[0].message }),
                { status: 400 }
            );
        }

        const { userId, jobId, jobTitle, category } = value;

        // 🔗 Connect DB
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const users = db.collection("rej_users");

        // 🔍 Check if applicant exists
        const user = await users.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return new Response(
                JSON.stringify({ error: "Applicant not found" }),
                { status: 404 }
            );
        }

        // 🔐 Only applicant role can apply
        if (user.role !== "applicant") {
            return new Response(
                JSON.stringify({ error: "Only applicants can apply to jobs" }),
                { status: 403 }
            );
        }

        // ❗ Prevent duplicate application
        const alreadyApplied = user.applications?.some(
            (a) => a.jobId === jobId
        );

        if (alreadyApplied) {
            return new Response(
                JSON.stringify({ error: "You already applied for this job" }),
                { status: 400 }
            );
        }

        // 📌 Application object
        const application = {
            id: Date.now(),
            jobId,
            jobTitle,
            category,
            appliedAt: new Date(),
            status: "Applied",
        };

        // 📝 Add inside applicant
        await users.updateOne(
            { _id: new ObjectId(userId) },
            { $push: { applications: application } }
        );

        // ---------------------------------------------------------
        // 🏢 UPDATE THE COMPANY'S JOB ENTRY WITH APPLICANT DETAILS
        // ---------------------------------------------------------

        // Find which company posted this job
        const company = await users.findOne(
            { "jobs.id": jobId },
            { projection: { jobs: 1 } }
        );

        if (!company) {
            return new Response(
                JSON.stringify({ error: "Job owner not found" }),
                { status: 404 }
            );
        }

        // Applicant reference for company job
        const applicantEntry = {
            applicantId: userId,
            name: user.name || "",
            email: user.email || "",
            mobile: user.mobile || "",
            appliedAt: new Date(),
            status: "Applied",
        };

        // 🛠 Push applicant into company.jobs[index].applications
        await users.updateOne(
            { _id: company._id, "jobs.id": jobId },
            {
                $push: {
                    "jobs.$.applications": applicantEntry
                }
            }
        );

        // ---------------------------------------------------------

        return new Response(
            JSON.stringify({
                success: true,
                message: "Job applied successfully",
                application,
            }),
            { status: 200 }
        );

    } catch (err) {
        console.error("❌ APPLY API Error:", err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
        });
    }
}
