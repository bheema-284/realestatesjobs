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
        const includeReviews = searchParams.get("includeReviews") === "true";

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

            // Get reviews for this job if requested
            let jobReviews = [];
            if (includeReviews) {
                jobReviews = await getJobReviews(jobId, users);
            }

            // Return job with company details and reviews
            return NextResponse.json({
                success: true,
                jobs: [{
                    ...job,
                    companyName: company.name,
                    companyProfileImage: company.profileImage,
                    companyLocation: company.location,
                    reviews: jobReviews,
                    reviewStats: calculateReviewStats(jobReviews)
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
        // 1️⃣ FIND AND VALIDATE APPLICATION
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

        // Get company ID from the application
        const companyId = appToDelete.companyId;

        // ---------------------------------------------------------
        // 2️⃣ REMOVE FROM APPLICANT'S APPLICATIONS
        // ---------------------------------------------------------
        const applicantUpdate = await users.updateOne(
            { _id: userObjectId },
            { $pull: { applications: { jobId } } }
        );

        if (applicantUpdate.modifiedCount === 0) {
            return NextResponse.json(
                { success: false, error: "Failed to remove application from user" },
                { status: 500 }
            );
        }

        // ---------------------------------------------------------
        // 3️⃣ REMOVE FROM COMPANY'S JOB APPLICATIONS
        // ---------------------------------------------------------
        let companyJobUpdate = { modifiedCount: 0 };
        if (companyId) {
            companyJobUpdate = await users.updateOne(
                { _id: new ObjectId(companyId), "jobs.id": jobId },
                {
                    $pull: {
                        "jobs.$.applications": { applicantId: userId }
                    }
                }
            );
        }

        // ---------------------------------------------------------
        // 4️⃣ REMOVE FROM COMPANY'S appliedJobs ARRAY
        // ---------------------------------------------------------
        let appliedJobsUpdate = { modifiedCount: 0 };
        if (companyId) {
            appliedJobsUpdate = await users.updateOne(
                { _id: new ObjectId(companyId) },
                {
                    $pull: {
                        appliedJobs: {
                            $and: [
                                { applicantId: userId },
                                { jobId: jobId }
                            ]
                        }
                    }
                }
            );
        }

        // ---------------------------------------------------------
        // 5️⃣ RETURN SUCCESS RESPONSE
        // ---------------------------------------------------------
        return NextResponse.json({
            success: true,
            message: "Application withdrawn successfully",
            details: {
                removedFromApplicant: applicantUpdate.modifiedCount > 0,
                removedFromCompanyJob: companyJobUpdate.modifiedCount > 0,
                removedFromAppliedJobs: appliedJobsUpdate.modifiedCount > 0,
                application: {
                    jobTitle: appToDelete.jobTitle,
                    companyName: appToDelete.companyName,
                    appliedAt: appToDelete.appliedAt
                }
            }
        });

    } catch (err) {
        console.error("❌ DELETE Application Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}

/* ----------------------------------------------------
   REVIEW FUNCTIONALITY - POST REVIEW
---------------------------------------------------- */
export async function POST(req) {
    try {
        const { searchParams } = new URL(req.url);
        const action = searchParams.get("action");

        // Handle different POST actions
        if (action === "review") {
            return await handlePostReview(req);
        }

        // Default action (you can add more actions here)
        return NextResponse.json(
            { success: false, error: "Invalid action" },
            { status: 400 }
        );
    } catch (err) {
        console.error("❌ POST Jobs API Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}

/* ----------------------------------------------------
   REVIEW FUNCTIONALITY - PUT/UPDATE REVIEW
---------------------------------------------------- */
export async function PUT(req) {
    try {
        const { searchParams } = new URL(req.url);
        const action = searchParams.get("action");

        if (action === "review") {
            return await handleUpdateReview(req);
        }

        return NextResponse.json(
            { success: false, error: "Invalid action" },
            { status: 400 }
        );
    } catch (err) {
        console.error("❌ PUT Jobs API Error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}

/* ----------------------------------------------------
   REVIEW HELPER FUNCTIONS
---------------------------------------------------- */

// Get reviews for a specific job
async function getJobReviews(jobId, usersCollection) {
    try {
        const reviews = await usersCollection
            .aggregate([
                { $match: { "reviews.jobId": jobId } },
                { $unwind: "$reviews" },
                { $match: { "reviews.jobId": jobId, "reviews.status": "approved" } },
                {
                    $project: {
                        _id: "$reviews._id",
                        rating: "$reviews.rating",
                        comment: "$reviews.comment",
                        applicantId: "$reviews.applicantId",
                        applicantName: "$reviews.applicantName",
                        jobId: "$reviews.jobId",
                        jobTitle: "$reviews.jobTitle",
                        createdAt: "$reviews.createdAt",
                        updatedAt: "$reviews.updatedAt",
                        status: "$reviews.status"
                    }
                },
                { $sort: { createdAt: -1 } }
            ])
            .toArray();

        return reviews;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
}

// Calculate review statistics
function calculateReviewStats(reviews) {
    if (!reviews || reviews.length === 0) {
        return {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        };
    }

    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / totalReviews;

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
        ratingDistribution[review.rating]++;
    });

    return {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        ratingDistribution
    };
}

// Handle posting a new review
async function handlePostReview(req) {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DBNAME);
    const users = db.collection("rej_users");

    const body = await req.json();
    const {
        applicantId,
        jobId,
        companyId,
        rating,
        comment,
        applicantName,
        jobTitle
    } = body;

    // Validation
    if (!applicantId || !jobId || !companyId || !rating) {
        return NextResponse.json(
            { success: false, error: "Missing required fields" },
            { status: 400 }
        );
    }

    if (rating < 1 || rating > 5) {
        return NextResponse.json(
            { success: false, error: "Rating must be between 1 and 5" },
            { status: 400 }
        );
    }

    // Check if applicant has applied for this job
    const applicant = await users.findOne({
        _id: new ObjectId(applicantId),
        "applications.jobId": jobId
    });

    if (!applicant) {
        return NextResponse.json(
            { success: false, error: "You can only review jobs you've applied to" },
            { status: 403 }
        );
    }

    // Check if review already exists
    const existingReview = await users.findOne({
        _id: new ObjectId(applicantId),
        "reviews.jobId": jobId
    });

    if (existingReview) {
        return NextResponse.json(
            { success: false, error: "You have already reviewed this job" },
            { status: 400 }
        );
    }

    // Create review object
    const reviewId = new ObjectId();
    const review = {
        _id: reviewId,
        id: reviewId.toString(),
        applicantId,
        applicantName: applicantName || applicant.name,
        jobId,
        jobTitle: jobTitle || "Unknown Job",
        companyId,
        rating: parseInt(rating),
        comment: comment || "",
        status: "pending", // Can be pending, approved, rejected
        createdAt: new Date(),
        updatedAt: new Date()
    };

    // Add review to applicant's reviews array
    const result = await users.updateOne(
        { _id: new ObjectId(applicantId) },
        {
            $push: { reviews: review },
            $set: { updatedAt: new Date() }
        }
    );

    if (result.modifiedCount === 0) {
        return NextResponse.json(
            { success: false, error: "Failed to add review" },
            { status: 500 }
        );
    }

    return NextResponse.json({
        success: true,
        message: "Review submitted successfully and is pending approval",
        review
    });
}

// Handle updating a review
async function handleUpdateReview(req) {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DBNAME);
    const users = db.collection("rej_users");

    const body = await req.json();
    const {
        applicantId,
        reviewId,
        rating,
        comment
    } = body;

    // Validation
    if (!applicantId || !reviewId) {
        return NextResponse.json(
            { success: false, error: "Missing required fields" },
            { status: 400 }
        );
    }

    if (rating && (rating < 1 || rating > 5)) {
        return NextResponse.json(
            { success: false, error: "Rating must be between 1 and 5" },
            { status: 400 }
        );
    }

    // Update review
    const updateFields = {
        "reviews.$.updatedAt": new Date()
    };

    if (rating) updateFields["reviews.$.rating"] = parseInt(rating);
    if (comment !== undefined) updateFields["reviews.$.comment"] = comment;

    const result = await users.updateOne(
        {
            _id: new ObjectId(applicantId),
            "reviews._id": new ObjectId(reviewId)
        },
        { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
        return NextResponse.json(
            { success: false, error: "Review not found or no changes made" },
            { status: 404 }
        );
    }

    return NextResponse.json({
        success: true,
        message: "Review updated successfully"
    });
}

/* ----------------------------------------------------
   ADDITIONAL REVIEW ENDPOINTS (Optional)
---------------------------------------------------- */

// You can add these as separate API routes or integrate here

// Get user's reviews
export async function getUsersReviews(userId) {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DBNAME);
    const users = db.collection("rej_users");

    const user = await users.findOne({ _id: new ObjectId(userId) });
    return user?.reviews || [];
}

// Get company reviews (for company dashboard)
export async function getCompanyReviews(companyId) {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DBNAME);
    const users = db.collection("rej_users");

    const reviews = await users
        .aggregate([
            { $match: { "reviews.companyId": companyId } },
            { $unwind: "$reviews" },
            { $match: { "reviews.companyId": companyId } },
            {
                $project: {
                    _id: "$reviews._id",
                    rating: "$reviews.rating",
                    comment: "$reviews.comment",
                    applicantId: "$reviews.applicantId",
                    applicantName: "$reviews.applicantName",
                    jobId: "$reviews.jobId",
                    jobTitle: "$reviews.jobTitle",
                    status: "$reviews.status",
                    createdAt: "$reviews.createdAt"
                }
            },
            { $sort: { createdAt: -1 } }
        ])
        .toArray();

    return reviews;
}