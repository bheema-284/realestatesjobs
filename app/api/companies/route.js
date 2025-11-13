import clientPromise from "@/components/lib/db";
import { ObjectId } from "mongodb";

// --------------------------------------------------------------------
// ✅ GET – Fetch user data with role-based access control
// --------------------------------------------------------------------
export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const usersCollection = db.collection("rej_users");

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const email = searchParams.get("email");
        const role = searchParams.get("role");
        const userId = searchParams.get("userId"); // Logged in user ID
        const getUserData = searchParams.get("getUserData"); // Flag to get specific user data

        // Define company roles
        const companyRoles = ["company", "superadmin", "recruiter"];

        // 🔹 CASE 1: User is logged in - get their specific data (any role)
        if (userId || getUserData === "true") {
            const targetId = userId || id;

            if (targetId) {
                try {
                    const user = await usersCollection.findOne({
                        _id: new ObjectId(targetId)
                    });

                    if (!user) {
                        return Response.json({ error: "User not found" }, { status: 404 });
                    }

                    // Return user data without sensitive information
                    const userData = {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role || "unknown",
                        profileImage: user.profileImage || "",
                        summary: user.summary || "",
                        mobile: user.mobile || "",
                        company: user.company || "",
                        position: user.position || "",
                        projects: user.projects || [],
                        recruiters: user.recruiters || [],
                        experience: user.experience || [],
                        education: user.education || [],
                        skills: user.skills || [],
                        resume: user.resume || "",
                        dateOfBirth: user.dateOfBirth || "",
                        gender: user.gender || "",
                        location: user.location || "",
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt
                    };

                    return Response.json(userData);
                } catch (err) {
                    return Response.json({ error: "Invalid ID format" }, { status: 400 });
                }
            }
        }

        // 🔹 CASE 2: Get specific company by ID (for non-logged in users)
        if (id) {
            try {
                const company = await usersCollection.findOne({
                    _id: new ObjectId(id),
                    role: { $in: companyRoles }
                });

                if (!company) {
                    return Response.json({ error: "Company not found" }, { status: 404 });
                }

                // Return company data without sensitive information
                const companyData = {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    role: company.role,
                    profileImage: company.profileImage || "",
                    summary: company.summary || "",
                    mobile: company.mobile || "",
                    company: company.company || "",
                    position: company.position || "",
                    projects: company.projects || [],
                    recruiters: company.recruiters || [],
                    experience: company.experience || [],
                    skills: company.skills || [],
                    createdAt: company.createdAt,
                    updatedAt: company.updatedAt
                };

                return Response.json(companyData);
            } catch (err) {
                return Response.json({ error: "Invalid ID format" }, { status: 400 });
            }
        }

        // 🔹 CASE 3: Get specific company by email (for non-logged in users)
        if (email) {
            const company = await usersCollection.findOne({
                email: email,
                role: { $in: companyRoles }
            });

            if (!company) {
                return Response.json({ error: "Company not found with this email" }, { status: 404 });
            }

            // Return company data without sensitive information
            const companyData = {
                _id: company._id,
                name: company.name,
                email: company.email,
                role: company.role,
                profileImage: company.profileImage || "",
                summary: company.summary || "",
                mobile: company.mobile || "",
                company: company.company || "",
                position: company.position || "",
                projects: company.projects || [],
                recruiters: company.recruiters || [],
                experience: company.experience || [],
                skills: company.skills || [],
                createdAt: company.createdAt,
                updatedAt: company.updatedAt
            };

            return Response.json(companyData);
        }

        // 🔹 CASE 4: Get companies by specific role (for non-logged in users)
        if (role && companyRoles.includes(role)) {
            const companies = await usersCollection.find({ role: role }).toArray();

            // Return company data without sensitive information
            const companiesData = companies.map(company => ({
                _id: company._id,
                name: company.name,
                email: company.email,
                role: company.role,
                profileImage: company.profileImage || "",
                summary: company.summary || "",
                mobile: company.mobile || "",
                company: company.company || "",
                position: company.position || "",
                projects: company.projects || [],
                recruiters: company.recruiters || [],
                experience: company.experience || [],
                skills: company.skills || [],
                createdAt: company.createdAt,
                updatedAt: company.updatedAt
            }));

            return Response.json(companiesData);
        }

        // 🔹 CASE 5: Default - return ALL company-related users (for non-logged in users)
        const allCompanies = await usersCollection.find({
            role: { $in: companyRoles }
        }).toArray();

        const companiesData = allCompanies.map(company => ({
            _id: company._id,
            name: company.name,
            email: company.email,
            role: company.role,
            profileImage: company.profileImage || "",
            summary: company.summary || "",
            mobile: company.mobile || "",
            company: company.company || "",
            position: company.position || "",
            projects: company.projects || [],
            recruiters: company.recruiters || [],
            experience: company.experience || [],
            skills: company.skills || [],
            createdAt: company.createdAt,
            updatedAt: company.updatedAt
        }));

        return Response.json(companiesData);

    } catch (error) {
        console.error("GET /api/companies error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}