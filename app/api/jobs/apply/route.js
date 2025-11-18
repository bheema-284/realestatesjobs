import clientPromise from "@/components/lib/db";
import Joi from "joi";
import { ObjectId } from "mongodb";

// ✅ JOI Schema
const applySchema = Joi.object({
    companyId: Joi.string().required(),
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

        const { companyId, userId, jobId, jobTitle, category } = value;

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

        // 🔍 Check if company exists
        const company = await users.findOne({ _id: new ObjectId(companyId) });
        if (!company) {
            return new Response(
                JSON.stringify({ error: "Company not found" }),
                { status: 404 }
            );
        }

        // 🔍 Find the specific job object from company's jobs array
        const job = company.jobs?.find(job => job.id === jobId);
        if (!job) {
            return new Response(
                JSON.stringify({ error: "Job not found in company" }),
                { status: 404 }
            );
        }

        // 📌 Application object with MongoDB ObjectId and complete job details
        const applicationId = new ObjectId();
        const application = {
            _id: applicationId,
            id: applicationId.toString(), // Keep both _id and id for compatibility
            jobId,
            jobTitle,
            category,
            appliedAt: new Date(),
            status: "Applied",
            companyId: companyId,
            companyName: company.name || company.company || "",
            companyDetails: {
                name: company.name || company.company || "",
                email: company.email || "",
                mobile: company.mobile || "",
                location: company.location || "",
                profileImage: company.profileImage || "",
                website: company.website || ""
            },
            applicantId: userId,
            applicantName: user.name || "",
            applicantEmail: user.email || "",
            applicantMobile: user.mobile || "",
            // ✅ COMPLETE JOB OBJECT INCLUDED
            jobDetails: {
                // Basic job info
                jobTitle: job.jobTitle,
                jobDescription: job.jobDescription,
                employmentTypes: job.employmentTypes || [],
                workingSchedule: job.workingSchedule || {},
                salaryType: job.salaryType,
                salaryAmount: job.salaryAmount,
                salaryFrequency: job.salaryFrequency,
                salaryNegotiable: job.salaryNegotiable,
                hiringMultiple: job.hiringMultiple,
                location: job.location,
                experience: job.experience,
                salary: job.salary,
                categorySlug: job.categorySlug,
                status: job.status,
                postedBy: job.postedBy,
                postedByRole: job.postedByRole,
                companyId: job.companyId,
                companyName: job.companyName,

                // Real estate specific fields
                jobRoleType: job.jobRoleType,
                commissionStructure: job.commissionStructure,
                incentives: job.incentives,
                propertyTypes: job.propertyTypes || [],
                targetAreas: job.targetAreas,
                languageRequirements: job.languageRequirements || [],
                vehicleRequirement: job.vehicleRequirement,
                targetAudience: job.targetAudience,
                salesTargets: job.salesTargets,
                leadProvided: job.leadProvided,
                trainingProvided: job.trainingProvided,
                certificationRequired: job.certificationRequired,

                // Additional job metadata
                views: job.views || 0,
                id: job.id,
                postedOn: job.postedOn,
                createdAt: job.createdAt,
                updatedAt: job.updatedAt
            }
        };

        // 📝 Add application to applicant's applications array
        await users.updateOne(
            { _id: new ObjectId(userId) },
            { $push: { applications: application } }
        );

        // ---------------------------------------------------------
        // 🏢 UPDATE THE COMPANY'S JOB ENTRY WITH APPLICANT DETAILS
        // ---------------------------------------------------------

        // Applicant reference for company job
        const applicantEntry = {
            applicantId: userId,
            name: user.name || "",
            email: user.email || "",
            mobile: user.mobile || "",
            appliedAt: new Date(),
            status: "Applied",
            // Include some applicant details for company reference
            applicantProfile: {
                position: user.position || "",
                location: user.location || "",
                experience: user.experience || [],
                education: user.education || [],
                skills: user.skills || [],
                profileImage: user.profileImage || ""
            }
        };

        // 🛠 Push applicant into company.jobs[index].applications
        await users.updateOne(
            { _id: new ObjectId(companyId), "jobs.id": jobId },
            {
                $push: {
                    "jobs.$.applications": applicantEntry
                },
                $inc: {
                    "jobs.$.views": 1 // Increment views when someone applies
                }
            }
        );

        // ---------------------------------------------------------
        // 🆕 ADD COMPLETE APPLICATION TO COMPANY'S appliedJobs ARRAY
        // ---------------------------------------------------------

        // Create the applied job object for company's appliedJobs array
        const appliedJob = {
            _id: applicationId,
            id: applicationId.toString(),
            jobId,
            jobTitle,
            category,
            appliedAt: new Date(),
            status: "Applied",
            applicantId: userId,
            applicantName: user.name || "",
            applicantEmail: user.email || "",
            applicantMobile: user.mobile || "",
            companyId: companyId,
            companyName: company.name || company.company || "",
            comapnyLogo: company.profileImage || company.logo || "https://placehold.co/80x80/F0F0F0/000000?text=Logo",
            // Include complete job details for company reference
            jobDetails: {
                jobTitle: job.jobTitle,
                jobDescription: job.jobDescription,
                location: job.location,
                experience: job.experience,
                salary: job.salary,
                employmentTypes: job.employmentTypes || [],
                categorySlug: job.categorySlug
            },
            // Include applicant profile for quick reference
            applicantProfile: {
                position: user.position || "",
                location: user.location || "",
                summary: user.summary || "",
                experience: user.experience?.length || 0,
                education: user.education?.length || 0,
                skills: user.skills || [],
                profileImage: user.profileImage || "",
                name: user.name || ""
            }
        };

        // 🛠 Push complete application object to company's appliedJobs array
        await users.updateOne(
            { _id: new ObjectId(companyId) },
            {
                $push: {
                    appliedJobs: appliedJob
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