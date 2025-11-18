// app/api/jobs/status/route.js
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/components/lib/db";

export async function PUT(req) {
    try {
        const body = await req.json();
        const { applicantId, jobId, status, companyId } = body;

        // Validation
        if (!applicantId || !jobId || !status || !companyId) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        const validStatuses = ['Applied', 'Interested', 'Shortlisted', 'Selected', 'Not Interested'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, error: "Invalid status" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const users = db.collection("rej_users");

        // Update status in multiple places

        // 1. Update in applicant's applications array
        const applicantUpdate = await users.updateOne(
            { 
                _id: new ObjectId(applicantId),
                "applications.jobId": jobId 
            },
            { 
                $set: { 
                    "applications.$.status": status,
                    "applications.$.updatedAt": new Date()
                } 
            }
        );

        // 2. Update in company's job applications array
        const companyJobUpdate = await users.updateOne(
            { 
                _id: new ObjectId(companyId),
                "jobs.id": jobId,
                "jobs.applications.applicantId": applicantId
            },
            { 
                $set: { 
                    "jobs.$.applications.$[app].status": status,
                    "jobs.$.applications.$[app].updatedAt": new Date()
                } 
            },
            {
                arrayFilters: [{ "app.applicantId": applicantId }]
            }
        );

        // 3. Update in company's appliedJobs array
        const appliedJobsUpdate = await users.updateOne(
            { 
                _id: new ObjectId(companyId),
                "appliedJobs.applicantId": applicantId,
                "appliedJobs.jobId": jobId
            },
            { 
                $set: { 
                    "appliedJobs.$.status": status,
                    "appliedJobs.$.updatedAt": new Date()
                } 
            }
        );

        return NextResponse.json({
            success: true,
            message: "Application status updated successfully",
            updates: {
                applicant: applicantUpdate.modifiedCount > 0,
                companyJob: companyJobUpdate.modifiedCount > 0,
                appliedJobs: appliedJobsUpdate.modifiedCount > 0
            }
        });

    } catch (err) {
        console.error("❌ Status Update Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}