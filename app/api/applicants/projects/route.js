import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from '@/components/lib/db';

// POST - Add project to applicant's projects array
export async function POST(request) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const usersCollection = db.collection("rej_users");

        const body = await request.json();
        const { applicantId, project } = body;

        // Validate required fields
        if (!applicantId || !project) {
            return NextResponse.json(
                { error: "Applicant ID and project data are required" },
                { status: 400 }
            );
        }

        // Validate project structure
        if (!project.title || !project.location) {
            return NextResponse.json(
                { error: "Project title and location are required" },
                { status: 400 }
            );
        }

        // Find the applicant
        const applicant = await usersCollection.findOne({
            _id: new ObjectId(applicantId),
            role: "applicant"
        });

        if (!applicant) {
            return NextResponse.json(
                { error: "Applicant not found" },
                { status: 404 }
            );
        }

        // Generate project ID if not provided
        const projectId = project.id || `project-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        // Create project object with metadata
        const projectWithMetadata = {
            id: projectId,
            title: project.title,
            description: project.description || "",
            propertyType: project.propertyType || "",
            location: project.location,
            projectSize: project.projectSize || "",
            budget: project.budget || "",
            timeline: project.timeline || "",
            client: project.client || "",
            status: project.status || "Completed",
            teamSize: project.teamSize || "",
            role: project.role || "",
            responsibilities: project.responsibilities || "",
            achievements: project.achievements || "",
            technologies: Array.isArray(project.technologies) ? project.technologies : [],
            link: project.link || "",
            images: project.images || [],
            startDate: project.startDate || "",
            endDate: project.endDate || "",
            skillsUsed: project.skillsUsed || [],
            testimonials: project.testimonials || "",
            challenges: project.challenges || "",
            solutions: project.solutions || "",
            results: project.results || "",
            addedDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            isActive: true,
            // Add applicant reference
            applicantId: applicantId,
            applicantName: applicant.name,
            applicantEmail: applicant.email
        };

        // Start a session for transaction
        const session = client.startSession();

        try {
            session.startTransaction();

            // 1. Update applicant's projects array
            const applicantUpdateResult = await usersCollection.updateOne(
                { _id: new ObjectId(applicantId), role: "applicant" },
                {
                    $push: { projects: projectWithMetadata },
                    $set: { updatedAt: new Date() }
                },
                { session }
            );

            if (applicantUpdateResult.modifiedCount === 0) {
                throw new Error("Failed to add project to applicant profile");
            }

            // 2. If project has a company link, update company's applicants or projects
            if (project.companyId) {
                // Find the company
                const company = await usersCollection.findOne({
                    _id: new ObjectId(project.companyId),
                    role: "company"
                }, { session });

                if (company) {
                    // Create applicant reference for company
                    const applicantReference = {
                        applicantId: applicantId,
                        applicantName: applicant.name,
                        applicantEmail: applicant.email,
                        projectId: projectId,
                        projectTitle: project.title,
                        projectLocation: project.location,
                        addedDate: new Date().toISOString(),
                        status: "active"
                    };

                    // Update company's applicants array
                    const companyUpdateResult = await usersCollection.updateOne(
                        { _id: new ObjectId(project.companyId), role: "company" },
                        {
                            $push: {
                                applicants: {
                                    $each: [applicantReference],
                                    $position: 0
                                }
                            },
                            $set: { updatedAt: new Date() }
                        },
                        { session }
                    );

                    if (companyUpdateResult.modifiedCount === 0) {
                        console.warn("Company found but could not update applicants array");
                    }
                }
            }

            // 3. If project is associated with a specific company (from link), handle that too
            if (project.link && project.link.includes('/companies/')) {
                // Extract company ID from the project link
                const companyIdMatch = project.link.match(/\/companies\/([^\/]+)/);
                if (companyIdMatch && companyIdMatch[1]) {
                    const companyId = companyIdMatch[1];

                    const company = await usersCollection.findOne({
                        _id: new ObjectId(companyId),
                        role: "company"
                    }, { session });

                    if (company) {
                        const companyProjectReference = {
                            projectId: projectId,
                            projectTitle: project.title,
                            applicantId: applicantId,
                            applicantName: applicant.name,
                            addedDate: new Date().toISOString(),
                            status: "active"
                        };

                        // Add to company's projects or applicants array
                        await usersCollection.updateOne(
                            { _id: new ObjectId(companyId), role: "company" },
                            {
                                $push: {
                                    projectsOfApplicants: {
                                        $each: [companyProjectReference],
                                        $position: 0
                                    }
                                },
                                $set: { updatedAt: new Date() }
                            },
                            { session }
                        );
                    }
                }
            }

            // Commit the transaction
            await session.commitTransaction();

            return NextResponse.json({
                success: true,
                message: "Project added successfully",
                project: projectWithMetadata,
                totalProjects: (applicant.projects?.length || 0) + 1
            }, { status: 200 });

        } catch (transactionError) {
            // Abort transaction on error
            await session.abortTransaction();
            throw transactionError;
        } finally {
            await session.endSession();
        }

    } catch (error) {
        console.error("POST /api/applicants/projects error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Remove specific project from applicant's projects array and company references
export async function DELETE(request) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const usersCollection = db.collection("rej_users");

        const { searchParams } = new URL(request.url);
        const applicantId = searchParams.get("applicantId");
        const projectId = searchParams.get("projectId");

        // Validate required fields
        if (!applicantId || !projectId) {
            return NextResponse.json(
                { error: "Applicant ID and Project ID are required" },
                { status: 400 }
            );
        }

        // Find the applicant and the specific project
        const applicant = await usersCollection.findOne({
            _id: new ObjectId(applicantId),
            role: "applicant"
        });

        if (!applicant) {
            return NextResponse.json(
                { error: "Applicant not found" },
                { status: 404 }
            );
        }

        // Check if project exists
        const project = applicant.projects?.find(p => p.id === projectId);
        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        // Start a session for transaction
        const session = client.startSession();

        try {
            session.startTransaction();

            // 1. Remove the project from the applicant's projects array
            const applicantResult = await usersCollection.updateOne(
                { _id: new ObjectId(applicantId) },
                {
                    $pull: { projects: { id: projectId } },
                    $set: { updatedAt: new Date() }
                },
                { session }
            );

            if (applicantResult.modifiedCount === 0) {
                throw new Error("Failed to delete project from applicant profile");
            }

            // 2. Remove project reference from any companies
            // If project has companyId in metadata
            if (project.companyId) {
                await usersCollection.updateOne(
                    {
                        _id: new ObjectId(project.companyId),
                        role: "company"
                    },
                    {
                        $pull: {
                            applicants: { projectId: projectId },
                            projects: { projectId: projectId }
                        },
                        $set: { updatedAt: new Date() }
                    },
                    { session }
                );
            }

            // 3. If project has a link to a company, try to remove from that company too
            if (project.link && project.link.includes('/companies/')) {
                const companyIdMatch = project.link.match(/\/companies\/([^\/]+)/);
                if (companyIdMatch && companyIdMatch[1]) {
                    const companyId = companyIdMatch[1];

                    await usersCollection.updateOne(
                        {
                            _id: new ObjectId(companyId),
                            role: "company"
                        },
                        {
                            $pull: {
                                applicants: { projectId: projectId },
                                projects: { projectId: projectId }
                            },
                            $set: { updatedAt: new Date() }
                        },
                        { session }
                    );
                }
            }

            // Commit the transaction
            await session.commitTransaction();

            return NextResponse.json({
                success: true,
                message: "Project deleted successfully",
                deletedProjectId: projectId,
                totalProjects: (applicant.projects?.length || 1) - 1
            }, { status: 200 });

        } catch (transactionError) {
            // Abort transaction on error
            await session.abortTransaction();
            throw transactionError;
        } finally {
            await session.endSession();
        }

    } catch (error) {
        console.error("DELETE /api/applicants/projects error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// GET - Get applicant's projects
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const applicantId = searchParams.get("applicantId");

        if (!applicantId) {
            return NextResponse.json(
                { error: "Applicant ID is required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const usersCollection = db.collection("rej_users");

        const applicant = await usersCollection.findOne(
            {
                _id: new ObjectId(applicantId),
                role: "applicant"
            },
            {
                projection: {
                    projects: 1,
                    name: 1,
                    email: 1
                }
            }
        );

        if (!applicant) {
            return NextResponse.json(
                { error: "Applicant not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            projects: applicant.projects || [],
            totalProjects: applicant.projects?.length || 0,
            applicant: {
                name: applicant.name,
                email: applicant.email
            }
        }, { status: 200 });

    } catch (error) {
        console.error("GET /api/applicants/projects error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}