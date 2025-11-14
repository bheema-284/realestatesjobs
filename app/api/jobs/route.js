// app/api/jobs/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/components/lib/db";
import { ObjectId } from "mongodb";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const users = db.collection("rej_users");

        // Query params
        const jobId = searchParams.get("jobId");
        const companyId = searchParams.get("companyId");
        const category = searchParams.get("category");
        const location = searchParams.get("location");
        const employmentType = searchParams.get("employmentType");
        const experience = searchParams.get("experience");
        const jobRoleType = searchParams.get("jobRoleType");
        const propertyType = searchParams.get("propertyType");
        const language = searchParams.get("language");
        const salaryRange = searchParams.get("salaryRange");
        const search = searchParams.get("search");
        const status = searchParams.get("status") || "active";

        // Pagination (optional)
        const limit = searchParams.get("limit")
            ? parseInt(searchParams.get("limit"))
            : null;
        const page = searchParams.get("page")
            ? parseInt(searchParams.get("page"))
            : 1;

        /* ----------------------------------------------------
           CASE 1: SINGLE JOB BY jobId
        ---------------------------------------------------- */
        if (jobId) {
            const company = await users.findOne({ "jobs.id": jobId });
            if (!company)
                return NextResponse.json({
                    success: false,
                    jobs: [],
                });

            const job = company.jobs.find((j) => j.id === jobId);

            // Increase views
            await users.updateOne(
                { _id: company._id, "jobs.id": jobId },
                { $inc: { "jobs.$.views": 1 } }
            );

            // Return only specific company fields instead of entire companyDetails
            return NextResponse.json({
                success: true,
                jobs: [{
                    ...job,
                    companyName: company.name,
                    companyProfileImage: company.profileImage,
                    companyLocation: company.location
                }],
            });
        }

        /* ----------------------------------------------------
           CASE 2: ALL JOBS
        ---------------------------------------------------- */

        const companies = await users
            .find({ role: "company", jobs: { $exists: true, $ne: [] } })
            .toArray();

        let jobs = companies.flatMap((company) =>
            (company.jobs || []).map((job) => ({
                ...job,
                // Include only specific company fields instead of entire companyDetails
                companyName: company.name,
                companyProfileImage: company.profileImage,
                companyLocation: company.location
            }))
        );

        /* ----------------------------------------------------
           FILTERS
        ---------------------------------------------------- */
        if (companyId)
            jobs = jobs.filter(
                (job) => job.companyId === companyId
            );

        if (category)
            jobs = jobs.filter((job) => job.categorySlug === category);

        if (location)
            jobs = jobs.filter(
                (job) =>
                    job.location?.toLowerCase().includes(location.toLowerCase()) ||
                    job.companyLocation
                        ?.toLowerCase()
                        .includes(location.toLowerCase())
            );

        if (employmentType)
            jobs = jobs.filter((job) =>
                job.employmentTypes?.includes(employmentType)
            );

        if (experience)
            jobs = jobs.filter((job) => job.experience === experience);

        if (status)
            jobs = jobs.filter((job) => job.status === status);

        if (jobRoleType)
            jobs = jobs.filter((job) => job.jobRoleType === jobRoleType);

        if (propertyType)
            jobs = jobs.filter((job) =>
                job.propertyTypes?.includes(propertyType)
            );

        if (language)
            jobs = jobs.filter((job) =>
                job.languageRequirements?.includes(language)
            );

        if (salaryRange)
            jobs = jobs.filter((job) =>
                (job.salary || job.salaryAmount || "")
                    .toLowerCase()
                    .includes(salaryRange.toLowerCase())
            );

        if (search) {
            const q = search.toLowerCase();
            jobs = jobs.filter(
                (job) =>
                    job.jobTitle?.toLowerCase().includes(q) ||
                    job.jobDescription?.toLowerCase().includes(q) ||
                    job.location?.toLowerCase().includes(q) ||
                    job.companyName?.toLowerCase().includes(q) ||
                    job.skillsRequired?.some((s) => s.toLowerCase().includes(q))
            );
        }

        /* ----------------------------------------------------
           PAGINATION (optional)
        ---------------------------------------------------- */
        if (limit) {
            jobs = jobs.slice((page - 1) * limit, page * limit);
        }

        /* ----------------------------------------------------
           RETURN ONLY JOBS ARRAY
        ---------------------------------------------------- */
        return NextResponse.json({
            success: true,
            jobs,
        });
    } catch (err) {
        console.error("Jobs API Error:", err);
        return NextResponse.json(
            { success: false, jobs: [], error: err.message },
            { status: 500 }
        );
    }
}


export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);

        const userId = searchParams.get("userId");
        const jobId = searchParams.get("jobId");

        if (!userId || !jobId) {
            return NextResponse.json(
                { success: false, error: "Both userId and jobId are required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const users = db.collection("rej_users");

        const userObjectId = new ObjectId(userId);

        // ---------------------------------------------------------
        // 1️⃣ REMOVE APPLICATION FROM APPLICANT
        // ---------------------------------------------------------
        const user = await users.findOne({ _id: userObjectId });
        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        const appToDelete = user.applications?.find(a => a.jobId === jobId);

        if (!appToDelete) {
            return NextResponse.json(
                { success: false, error: "Application not found for this job" },
                { status: 404 }
            );
        }

        await users.updateOne(
            { _id: userObjectId },
            { $pull: { applications: { jobId } } }
        );

        // ---------------------------------------------------------
        // 2️⃣ REMOVE APPLICANT ENTRY FROM COMPANY JOB
        // ---------------------------------------------------------
        const company = await users.findOne({ "jobs.id": jobId });

        if (company) {
            await users.updateOne(
                { _id: company._id, "jobs.id": jobId },
                {
                    $pull: {
                        "jobs.$.applications": { applicantId: userId }
                    }
                }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Application removed from applicant and company job",
            removedApplicant: appToDelete
        });

    } catch (err) {
        console.error("❌ DELETE Application Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}