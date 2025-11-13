import Joi from "joi";
import bcrypt from "bcryptjs";
import clientPromise from "@/components/lib/db";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Dummy logos array
const dummyLogos = [
    'https://placehold.co/48x48/F0F0F0/000000?text=Google',
    'https://placehold.co/48x48/F0F0F0/000000?text=Facebook',
    'https://placehold.co/48x48/F0F0F0/000000?text=LinkedIn',
    'https://placehold.co/48x48/F0F0F0/000000?text=Microsoft',
    'https://placehold.co/48x48/F0F0F0/000000?text=YouTube',
];

// -------------------- Validation Schemas --------------------
const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid("applicant", "recruiter", "company", "superadmin").required(),
    password: Joi.string().min(6).required()
});

const resetPasswordSchema = Joi.object({
    email: Joi.string().email(),
    mobile: Joi.string(),
    newPassword: Joi.string().min(6).required(),
}).xor("email", "mobile"); // only one allowed

async function processProjectsWithImages(formData, newProjects, existingProjects, userId) {
    const processedProjects = [];

    for (let i = 0; i < newProjects.length; i++) {
        const project = newProjects[i];
        const existingProject = existingProjects.find(p => p.id === project.id) || {};

        let projectImages = existingProject.images || [];

        // Check if there are new images for this project
        const imageFiles = [];
        let imageIndex = 0;
        while (true) {
            const imageFile = formData.get(`projectImage_${i}_${imageIndex}`);
            if (imageFile && imageFile.size > 0) {
                imageFiles.push(imageFile);
                imageIndex++;
            } else {
                break;
            }
        }

        // Upload new images to Cloudinary
        for (const imageFile of imageFiles) {
            try {
                const buffer = Buffer.from(await imageFile.arrayBuffer());
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: `users/${userId}/projects`,
                            public_id: `project_${i}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                        },
                        (err, res) => (err ? reject(err) : resolve(res))
                    );
                    uploadStream.end(buffer);
                });
                projectImages.push(result.secure_url);
            } catch (error) {
                console.error("Error uploading project image:", error);
            }
        }

        // Merge project data
        processedProjects.push({
            ...existingProject,
            ...project,
            id: project.id || existingProject.id || `project-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            images: projectImages.length > 0 ? projectImages : (project.images || existingProject.images || []),
            createdAt: project.createdAt || existingProject.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
    }

    return processedProjects;
}

/**
 * Process recruiters data for company/superadmin roles
 */
function processRecruitersData(newRecruiters, existingRecruiters) {
    return newRecruiters.map(recruiter => {
        const existingRecruiter = existingRecruiters.find(r => r.id === recruiter.id) || {};

        return {
            ...existingRecruiter,
            ...recruiter,
            id: recruiter.id || existingRecruiter.id || `recruiter-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            joinDate: recruiter.joinDate || existingRecruiter.joinDate || new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString()
        };
    });
}

// Helper function to process experience documents
async function processExperienceDocuments(formData, experienceData, userId, existingExperience) {
    const experienceWithDocs = [];

    for (let i = 0; i < Math.max(experienceData.length, existingExperience.length); i++) {
        const newExp = experienceData[i] || {};
        const existingExp = existingExperience[i] || {};

        let documentUrl = existingExp.documentUrl;

        // Check if there's a new document file for this experience entry
        const docFile = formData.get(`experienceDoc_${i}`);
        if (docFile && docFile.size > 0) {
            console.log(`Uploading experience document for index ${i}`);

            const buffer = Buffer.from(await docFile.arrayBuffer());
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: `users/${userId}/experience`,
                        resource_type: 'raw',
                        public_id: `exp_${i}_${Date.now()}`,
                    },
                    (err, res) => (err ? reject(err) : resolve(res))
                );
                uploadStream.end(buffer);
            });
            documentUrl = result.secure_url;
            console.log(`Experience document uploaded: ${documentUrl}`);
        }

        // Merge existing data with new data, preserving important fields
        const mergedExperience = {
            ...existingExp, // Start with existing data
            ...newExp, // Override with new data
            documentUrl: documentUrl, // Use new URL if uploaded, otherwise keep existing
            logo: newExp.logo || existingExp.logo || dummyLogos[i % dummyLogos.length],
            showDescription: newExp.showDescription !== undefined ? newExp.showDescription : (existingExp.showDescription || false)
        };

        experienceWithDocs.push(mergedExperience);
    }

    return experienceWithDocs;
}

// Helper function to process education documents
async function processEducationDocuments(formData, educationData, userId, existingEducation) {
    const educationWithDocs = [];

    for (let i = 0; i < Math.max(educationData.length, existingEducation.length); i++) {
        const newEdu = educationData[i] || {};
        const existingEdu = existingEducation[i] || {};

        let documentUrl = existingEdu.documentUrl;

        // Check if there's a new document file for this education entry
        const docFile = formData.get(`educationDoc_${i}`);
        if (docFile && docFile.size > 0) {
            console.log(`Uploading education document for index ${i}`);

            const buffer = Buffer.from(await docFile.arrayBuffer());
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: `users/${userId}/education`,
                        resource_type: 'raw',
                        public_id: `edu_${i}_${Date.now()}`,
                    },
                    (err, res) => (err ? reject(err) : resolve(res))
                );
                uploadStream.end(buffer);
            });
            documentUrl = result.secure_url;
            console.log(`Education document uploaded: ${documentUrl}`);
        }

        // Merge existing data with new data, preserving important fields
        const mergedEducation = {
            ...existingEdu, // Start with existing data
            ...newEdu, // Override with new data
            documentUrl: documentUrl, // Use new URL if uploaded, otherwise keep existing
            years: newEdu.years || `${newEdu.startYear || ''} - ${newEdu.endYear || ''}` || existingEdu.years
        };

        educationWithDocs.push(mergedEducation);
    }

    return educationWithDocs;
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { error, value } = userSchema.validate(body);

        if (error)
            return new Response(
                JSON.stringify({ error: error.details[0].message }),
                { status: 400 }
            );

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const users = db.collection("rej_users");

        // ✅ Check duplicate email only in rej_users
        const existingUser = await users.findOne({ email: value.email });
        if (existingUser) {
            return new Response(
                JSON.stringify({ error: "Email already exists" }),
                { status: 400 }
            );
        }

        // ✅ Hash password
        const hashedPw = await bcrypt.hash(value.password, 10);

        // ✅ Common user data
        const userBaseData = {
            name: value.name,
            email: value.email,
            password: hashedPw,
            profileImage: "",
            summary: "",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // ✅ Role-based user details
        let newUser;

        if (value.role === "applicant") {
            newUser = {
                ...userBaseData,
                role: "applicant",
                mobile: "",
                experience: [],
                education: [],
                skills: [],
                resume: "",
                applications: [],
                projects: [],
                dateOfBirth: "",
                gender: "",
                location: "",
            };
        } else if (["company", "superadmin", "recruiter"].includes(value.role)) {
            newUser = {
                ...userBaseData,
                role: value.role,
                companyId: new ObjectId(), // Just for internal linking if needed later
                company: value.name,
                mobile: "",
                experience: [],
                education: [],
                skills: [],
                resume: "",
                applications: [],
                projects: [],
                position:
                    value.role === "company"
                        ? "Founder/CEO"
                        : value.role === "superadmin"
                            ? "Administrator"
                            : "Recruiter",
                dateOfBirth: "",
                gender: "",
                location: "",
            };
        } else {
            return new Response(
                JSON.stringify({ error: "Invalid role specified" }),
                { status: 400 }
            );
        }

        // ✅ Insert only into rej_users
        const userResult = await users.insertOne(newUser);

        return new Response(
            JSON.stringify({
                success: true,
                message: "User registered successfully",
                insertedId: userResult.insertedId,
                role: value.role,
            }),
            { status: 200 }
        );
    } catch (err) {
        console.error("❌ POST Error:", err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
        });
    }
}


export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const users = db.collection("rej_users");

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const name = searchParams.get("name");
        const email = searchParams.get("email");

        // 🔹 Get by _id
        if (id) {
            try {
                const user = await users.findOne({ _id: new ObjectId(id) });
                if (!user)
                    return Response.json({ error: "User not found" }, { status: 404 });

                return Response.json(user);
            } catch (err) {
                return Response.json({ error: "Invalid ID format" }, { status: 400 });
            }
        }

        // 🔹 Search by email
        if (email) {
            const user = await users.findOne({ email: email });
            if (!user)
                return Response.json({ error: "User not found" }, { status: 404 });
            return Response.json(user);
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

export async function PUT(request) {
    try {
        const contentType = request.headers.get("content-type") || "";

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const usersCollection = db.collection("rej_users");

        let userId;
        let updateFields = {};

        // ✅ Handle Reset Password Request (JSON)
        if (contentType.includes("application/json")) {
            const body = await request.json();

            // Check if this is a reset password request
            if (body.resetPassword && (body.email || body.mobile)) {
                const { error, value } = resetPasswordSchema.validate({
                    email: body.email,
                    mobile: body.mobile,
                    newPassword: body.newPassword
                });

                if (error) {
                    return new Response(JSON.stringify({ error: error.details[0].message }), { status: 400 });
                }

                // Find user by email or mobile
                const query = {};
                if (value.email) query.email = value.email;
                if (value.mobile) query.mobile = value.mobile;

                const user = await usersCollection.findOne(query);
                if (!user) {
                    return new Response(JSON.stringify({
                        error: "User not found with provided email or mobile"
                    }), { status: 404 });
                }

                // Hash new password
                const hashedPassword = await bcrypt.hash(value.newPassword, 10);

                // Update password
                const result = await usersCollection.updateOne(
                    { _id: user._id },
                    {
                        $set: {
                            password: hashedPassword,
                            updatedAt: new Date()
                        }
                    }
                );

                if (result.modifiedCount === 0) {
                    return new Response(JSON.stringify({
                        error: "Failed to reset password"
                    }), { status: 500 });
                }

                return new Response(JSON.stringify({
                    success: true,
                    message: "Password reset successfully"
                }), { status: 200 });
            }
        }

        // ✅ Handle Multipart (FormData) - Profile updates + documents
        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            userId = formData.get("id") || formData.get("userId");

            // Check if this is a password reset via form data
            const resetPassword = formData.get("resetPassword");
            const email = formData.get("email");
            const mobile = formData.get("mobile");
            const newPassword = formData.get("newPassword");

            if (resetPassword === "true" && (email || mobile) && newPassword) {
                // Validate reset password data using Joi schema
                const { error, value } = resetPasswordSchema.validate({
                    email: email || undefined,
                    mobile: mobile || undefined,
                    newPassword: newPassword
                });

                if (error) {
                    return new Response(JSON.stringify({ error: error.details[0].message }), { status: 400 });
                }

                // Find user by email or mobile
                const query = {};
                if (value.email) query.email = value.email;
                if (value.mobile) query.mobile = value.mobile;

                const user = await usersCollection.findOne(query);
                if (!user) {
                    return new Response(JSON.stringify({
                        error: "User not found with provided email or mobile"
                    }), { status: 404 });
                }

                // Hash new password
                const hashedPassword = await bcrypt.hash(value.newPassword, 10);

                // Update password
                const result = await usersCollection.updateOne(
                    { _id: user._id },
                    {
                        $set: {
                            password: hashedPassword,
                            updatedAt: new Date()
                        }
                    }
                );

                if (result.modifiedCount === 0) {
                    return new Response(JSON.stringify({
                        error: "Failed to reset password"
                    }), { status: 500 });
                }

                return new Response(JSON.stringify({
                    success: true,
                    message: "Password reset successfully"
                }), { status: 200 });
            }

            // Regular profile update (not reset password)
            if (!userId)
                return new Response(JSON.stringify({ error: "User ID required" }), { status: 400 });

            const existingUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
            if (!existingUser)
                return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

            // 🔹 CRITICAL FIX: Only update fields that are provided, keep existing data
            updateFields.updatedAt = new Date();

            // 🔹 Handle ALL text fields - including company specific fields
            const allTextFields = [
                // Basic user fields
                "name", "email", "mobile", "gender", "summary",
                "dateOfBirth", "company", "position", "role",
                // Company specific fields
                "industry", "location", "established", "website",
                "contactPerson", "phone", "tagline", "description",
                "about", "vision", "mission"
            ];

            // Process all text fields
            for (const field of allTextFields) {
                const value = formData.get(field);
                if (value !== null && value !== undefined && value !== "") {
                    updateFields[field] = value;
                }
            }

            // 🔹 Handle password change
            const currentPassword = formData.get("currentPassword");
            const newPasswordChange = formData.get("newPassword");

            if (currentPassword && newPasswordChange) {
                const isCurrentPasswordValid = await bcrypt.compare(currentPassword, existingUser.password);
                if (!isCurrentPasswordValid) {
                    return new Response(JSON.stringify({
                        error: "Current password is incorrect"
                    }), { status: 400 });
                }

                if (newPasswordChange.length < 6) {
                    return new Response(JSON.stringify({
                        error: "New password must be at least 6 characters long"
                    }), { status: 400 });
                }

                updateFields.password = await bcrypt.hash(newPasswordChange, 10);
            }

            // 🔹 Handle JSON fields - parse if they contain JSON, otherwise treat as text
            const potentialJsonFields = [
                "experience", "education", "services", "applications", "marketing",
                // Company specific JSON fields
                "values", "leadership", "achievements", "certifications",
                "whyChooseUs", "statistics", "socialMedia"
            ];

            for (const field of potentialJsonFields) {
                const rawValue = formData.get(field);
                if (rawValue !== null && rawValue !== undefined && rawValue !== "") {
                    try {
                        // Try to parse as JSON first
                        const parsedValue = JSON.parse(rawValue);
                        updateFields[field] = parsedValue;
                    } catch (error) {
                        // If not valid JSON, treat as regular text/array
                        if (rawValue.includes(',') && !rawValue.includes('{') && !rawValue.includes('[')) {
                            // If it's a comma-separated string, convert to array
                            updateFields[field] = rawValue.split(',').map(item => item.trim());
                        } else {
                            // Otherwise, store as string
                            updateFields[field] = rawValue;
                        }
                    }
                }
            }

            // 🔹 Handle array fields that might come as multiple form entries
            const arrayFields = ["skills", "services", "values"];
            for (const field of arrayFields) {
                const values = formData.getAll(field);
                if (values.length > 0) {
                    // Flatten arrays and remove empty values
                    const flattenedValues = values.flatMap(value => {
                        if (typeof value === 'string' && value.includes(',')) {
                            return value.split(',').map(item => item.trim()).filter(item => item);
                        }
                        return value;
                    }).filter(value => value && value !== "");

                    if (flattenedValues.length > 0) {
                        updateFields[field] = flattenedValues;
                    }
                }
            }

            // 🔹 Handle Projects - ONLY for company, superadmin, recruiter roles
            const projectsData = formData.get("projects");
            if (projectsData) {
                try {
                    const parsedProjects = JSON.parse(projectsData);
                    if (Array.isArray(parsedProjects)) {
                        // Check if user has permission to manage projects
                        if (["company", "superadmin", "recruiter"].includes(existingUser.role)) {
                            // Process projects with image uploads
                            updateFields.projects = await processProjectsWithImages(
                                formData,
                                parsedProjects,
                                existingUser.projects || [],
                                userId
                            );
                        } else {
                            // For non-company roles, don't allow project updates
                            return new Response(JSON.stringify({
                                error: "Only company, superadmin, and recruiter roles can manage projects"
                            }), { status: 403 });
                        }
                    }
                } catch (error) {
                    // If projects is not JSON, handle as regular field
                    console.warn("Projects field is not valid JSON, treating as text");
                    updateFields.projects = projectsData;
                }
            }

            // 🔹 Handle Recruiters - ONLY for company, superadmin roles
            const recruitersData = formData.get("recruiters");
            if (recruitersData) {
                try {
                    const parsedRecruiters = JSON.parse(recruitersData);
                    if (Array.isArray(parsedRecruiters)) {
                        // Check if user has permission to manage recruiters
                        if (["company", "superadmin"].includes(existingUser.role)) {
                            updateFields.recruiters = processRecruitersData(parsedRecruiters, existingUser.recruiters || []);
                        }
                    }
                } catch (error) {
                    // If recruiters is not JSON, handle as regular field
                    console.warn("Recruiters field is not valid JSON, treating as text");
                    updateFields.recruiters = recruitersData;
                }
            }

            // 🔹 Handle ANY other fields that weren't explicitly handled
            // This catches any additional fields that might be sent
            for (const [key, value] of formData.entries()) {
                // Skip fields we've already processed and system fields
                if (key === 'id' || key === 'userId' || key === 'image' || key === 'resume' ||
                    key === 'currentPassword' || key === 'newPassword' || key === 'resetPassword' ||
                    updateFields.hasOwnProperty(key)) {
                    continue;
                }

                // Process unknown fields
                if (value !== null && value !== undefined && value !== "") {
                    try {
                        // Try to parse as JSON
                        const parsedValue = JSON.parse(value);
                        updateFields[key] = parsedValue;
                    } catch (error) {
                        // If not JSON, store as string
                        updateFields[key] = value;
                    }
                }
            }

            // 🔹 Handle profile image upload - only update if new file provided
            const file = formData.get("image");
            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "users" },
                        (err, res) => (err ? reject(err) : resolve(res))
                    );
                    uploadStream.end(buffer);
                });
                updateFields.profileImage = result.secure_url;
            }

            // 🔹 Handle resume upload - only update if new file provided
            const resumeFile = formData.get("resume");
            if (resumeFile && resumeFile.size > 0) {
                const buffer = Buffer.from(await resumeFile.arrayBuffer());
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: "users/resumes",
                            resource_type: 'raw',
                            public_id: `resume_${userId}_${Date.now()}`
                        },
                        (err, res) => (err ? reject(err) : resolve(res))
                    );
                    uploadStream.end(buffer);
                });
                updateFields.resume = result.secure_url;
            }

            // ✅ Save updates - use $set to update only provided fields
            const result = await usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $set: updateFields }
            );

            if (result.matchedCount === 0)
                return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

            return new Response(JSON.stringify({
                success: true,
                message: "Profile updated successfully",
                updatedFields: Object.keys(updateFields).filter(k => k !== 'updatedAt')
            }), { status: 200 });
        }

        // ✅ Handle JSON request for regular profile updates
        const body = await request.json();

        // Check if this is a reset password request in JSON
        if (body.resetPassword && (body.email || body.mobile)) {
            const { error, value } = resetPasswordSchema.validate({
                email: body.email,
                mobile: body.mobile,
                newPassword: body.newPassword
            });

            if (error) {
                return new Response(JSON.stringify({ error: error.details[0].message }), { status: 400 });
            }

            // Find user by email or mobile
            const query = {};
            if (value.email) query.email = value.email;
            if (value.mobile) query.mobile = value.mobile;

            const user = await usersCollection.findOne(query);
            if (!user) {
                return new Response(JSON.stringify({
                    error: "User not found with provided email or mobile"
                }), { status: 404 });
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(value.newPassword, 10);

            // Update password
            const result = await usersCollection.updateOne(
                { _id: user._id },
                {
                    $set: {
                        password: hashedPassword,
                        updatedAt: new Date()
                    }
                }
            );

            if (result.modifiedCount === 0) {
                return new Response(JSON.stringify({
                    error: "Failed to reset password"
                }), { status: 500 });
            }

            return new Response(JSON.stringify({
                success: true,
                message: "Password reset successfully"
            }), { status: 200 });
        }

        // Regular JSON profile update
        userId = body.id || body.userId;
        if (!userId)
            return new Response(JSON.stringify({ error: "User ID required" }), { status: 400 });

        const existingUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!existingUser)
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

        // 🔹 CRITICAL FIX: Only update fields that are provided
        updateFields.updatedAt = new Date();

        // 🔹 Handle ALL fields from the request body
        // Process each field in the request body
        for (const [field, value] of Object.entries(body)) {
            // Skip system fields
            if (field === 'id' || field === 'userId' || field === 'resetPassword') {
                continue;
            }

            // Handle password separately
            if (field === "password" && value) {
                if (value.length < 6) {
                    return new Response(JSON.stringify({
                        error: "Password must be at least 6 characters long"
                    }), { status: 400 });
                }
                updateFields.password = await bcrypt.hash(value, 10);
                continue;
            }

            // Handle currentPassword + newPassword combination
            if (field === "currentPassword" && body.newPassword) {
                const isCurrentPasswordValid = await bcrypt.compare(value, existingUser.password);
                if (!isCurrentPasswordValid) {
                    return new Response(JSON.stringify({
                        error: "Current password is incorrect"
                    }), { status: 400 });
                }
                // The newPassword will be handled in its own iteration
                continue;
            }

            if (field === "newPassword" && body.currentPassword) {
                // Already handled above with currentPassword
                if (value.length < 6) {
                    return new Response(JSON.stringify({
                        error: "New password must be at least 6 characters long"
                    }), { status: 400 });
                }
                updateFields.password = await bcrypt.hash(value, 10);
                continue;
            }

            // Handle role-specific restrictions
            if (field === "projects" && !["company", "superadmin", "recruiter"].includes(existingUser.role)) {
                return new Response(JSON.stringify({
                    error: "Only company, superadmin, and recruiter roles can manage projects"
                }), { status: 403 });
            }

            if (field === "recruiters" && !["company", "superadmin"].includes(existingUser.role)) {
                return new Response(JSON.stringify({
                    error: "Only company and superadmin roles can manage recruiters"
                }), { status: 403 });
            }

            // Handle skills merging
            if (field === "skills") {
                updateFields.skills = [
                    ...(existingUser.skills || []),
                    ...(Array.isArray(value) ? value : [value])
                ].filter((v, i, arr) => arr.indexOf(v) === i);
                continue;
            }

            // For all other fields, store as-is (arrays, objects, strings, numbers)
            if (value !== undefined && value !== null) {
                updateFields[field] = value;
            }
        }

        // ✅ Update DB - only updates provided fields, keeps others intact
        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0)
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

        return new Response(JSON.stringify({
            success: true,
            message: "Profile updated successfully",
            updatedFields: Object.keys(updateFields).filter(k => k !== 'updatedAt')
        }), { status: 200 });

    } catch (err) {
        console.error("PUT /api/users error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const usersCollection = db.collection("rej_users");

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const index = Number(searchParams.get("index"));
        const type = searchParams.get("type"); // "experience" or "education"
        const deleteType = searchParams.get("deleteType") || "entry"; // "entry" or "document"

        console.log(`DELETE Request:`, { id, index, type, deleteType });

        // Validate required parameters
        if (!id) {
            return Response.json({ error: "User ID is required" }, { status: 400 });
        }

        if (!type || !["experience", "education"].includes(type)) {
            return Response.json({ error: "Type must be 'experience' or 'education'" }, { status: 400 });
        }

        if (isNaN(index) || index < 0) {
            return Response.json({ error: "Valid index is required" }, { status: 400 });
        }

        // Find user
        const user = await usersCollection.findOne({ _id: new ObjectId(id) });
        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        // Validate the array exists
        if (!user[type] || !Array.isArray(user[type])) {
            return Response.json({ error: `${type} data not found` }, { status: 404 });
        }

        // Check if index is within bounds
        if (index >= user[type].length) {
            return Response.json({ error: `Invalid ${type} index` }, { status: 400 });
        }

        let updateResult;
        let updatedArray;

        if (deleteType === "document") {
            // 🔹 Only remove the document URL, keep the entry
            updatedArray = [...user[type]];
            const itemToUpdate = updatedArray[index];

            // Remove document from Cloudinary if exists
            if (itemToUpdate.documentUrl) {
                try {
                    // Extract public_id from Cloudinary URL
                    const urlParts = itemToUpdate.documentUrl.split('/');
                    const publicIdWithExtension = urlParts[urlParts.length - 1];
                    const publicId = publicIdWithExtension.split('.')[0];
                    const fullPublicId = `users/${id}/${type}/${publicId}`;

                    await cloudinary.uploader.destroy(fullPublicId, { resource_type: 'raw' });
                    console.log(`Cloudinary document deleted: ${fullPublicId}`);
                } catch (cloudinaryError) {
                    console.warn("Could not delete from Cloudinary, continuing:", cloudinaryError);
                }
            }

            // Remove document reference
            updatedArray[index] = {
                ...itemToUpdate,
                documentUrl: "",
                document: null
            };

            updateResult = await usersCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        [type]: updatedArray,
                        updatedAt: new Date()
                    }
                }
            );

        } else {
            // 🔹 Delete the entire entry
            updatedArray = [...user[type]];
            const itemToDelete = updatedArray[index];

            // Delete associated document from Cloudinary if exists
            if (itemToDelete.documentUrl) {
                try {
                    const urlParts = itemToDelete.documentUrl.split('/');
                    const publicIdWithExtension = urlParts[urlParts.length - 1];
                    const publicId = publicIdWithExtension.split('.')[0];
                    const fullPublicId = `users/${id}/${type}/${publicId}`;

                    await cloudinary.uploader.destroy(fullPublicId, { resource_type: 'raw' });
                    console.log(`Cloudinary document deleted: ${fullPublicId}`);
                } catch (cloudinaryError) {
                    console.warn("Could not delete from Cloudinary, continuing:", cloudinaryError);
                }
            }

            // Remove the entry
            updatedArray.splice(index, 1);

            updateResult = await usersCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        [type]: updatedArray,
                        updatedAt: new Date()
                    }
                }
            );
        }

        if (updateResult.matchedCount === 0) {
            return Response.json({ error: "User not found during update" }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: deleteType === "document"
                ? `${type} document deleted successfully`
                : `${type} entry deleted successfully`,
            [type]: updatedArray,
            deletedIndex: index,
            deleteType: deleteType
        });

    } catch (err) {
        console.error("Error in DELETE /api/users:", err);

        // Handle specific MongoDB errors
        if (err.message.includes("buffering timed out")) {
            return Response.json({ error: "Database connection timeout" }, { status: 408 });
        }

        if (err.message.includes("Invalid ObjectId")) {
            return Response.json({ error: "Invalid user ID format" }, { status: 400 });
        }

        return Response.json(
            { error: err.message || "Internal server error" },
            { status: 500 }
        );
    }
}