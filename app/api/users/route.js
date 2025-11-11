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
            profileImage: "",
            experience: [],
            education: [],
            skills: [],
            summary: "",
            resume: "",
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

// --------------------------------------------------------------------
// ✅ PUT – Comprehensive Update (Multipart + JSON support)
// --------------------------------------------------------------------
export async function PUT(request) {
    try {
        const contentType = request.headers.get("content-type") || "";
        const parseJSON = (val) => { try { return JSON.parse(val); } catch { return val; } };

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const usersCollection = db.collection("rej_users");

        let userId;
        let updateFields = {};

        // ✅ Multipart (FormData) case - Handle profile updates + documents
        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            userId = formData.get("id") || formData.get("userId");
            if (!userId)
                return new Response(JSON.stringify({ error: "User ID required" }), { status: 400 });

            // Get existing user data first to preserve existing data
            const existingUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
            if (!existingUser)
                return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

            // Build update object - only update provided fields
            updateFields.updatedAt = new Date();

            // Text fields - only update if provided
            const textFields = [
                "name", "email", "mobile", "gender", "summary", "dateOfBirth",
                "company", "position", "role"
            ];
            textFields.forEach(key => {
                const value = formData.get(key);
                if (value !== null && value !== undefined && value !== "") {
                    updateFields[key] = value;
                }
            });

            // 🔹 Handle Password update (hash if provided)
            const password = formData.get("password");
            if (password) {
                updateFields.password = await bcrypt.hash(password, 10);
            }

            // 🔹 Handle Experience Data with Documents - MERGE with existing
            const experienceData = parseJSON(formData.get("experience"));
            if (experienceData && Array.isArray(experienceData)) {
                const experienceWithDocs = await processExperienceDocuments(
                    formData,
                    experienceData,
                    userId,
                    existingUser.experience || []
                );
                updateFields.experience = experienceWithDocs;
            } else {
                // Preserve existing experience if no new data provided
                updateFields.experience = existingUser.experience;
            }

            // 🔹 Handle Education Data with Documents - MERGE with existing
            const educationData = parseJSON(formData.get("education"));
            if (educationData && Array.isArray(educationData)) {
                const educationWithDocs = await processEducationDocuments(
                    formData,
                    educationData,
                    userId,
                    existingUser.education || []
                );
                updateFields.education = educationWithDocs;
            } else {
                // Preserve existing education if no new data provided
                updateFields.education = existingUser.education;
            }

            // 🔹 Handle Skills (sent as JSON string in formData)
            const skillsData = formData.get("skills");
            if (skillsData) {
                try {
                    updateFields.skills = JSON.parse(skillsData);
                } catch (err) {
                    console.warn("Invalid skills JSON, using as string array");
                    updateFields.skills = Array.isArray(skillsData) ? skillsData : [skillsData];
                }
            } else {
                updateFields.skills = existingUser.skills;
            }

            // 🔹 Handle profile image upload
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
            } else {
                updateFields.profileImage = existingUser.profileImage;
            }

            // 🔹 Handle resume upload
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
            } else {
                updateFields.resume = existingUser.resume;
            }

            console.log("Updating user fields:", Object.keys(updateFields));

            const result = await usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $set: updateFields }
            );

            if (result.matchedCount === 0)
                return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

            return new Response(JSON.stringify({
                success: true,
                message: "Profile updated successfully",
                updatedFields: Object.keys(updateFields).filter(key => key !== 'updatedAt')
            }), { status: 200 });
        }

        // ✅ JSON body case (normal update or password reset)
        const body = await request.json();

        // ✅ Password reset logic
        if (body.newPassword && (body.email || body.mobile)) {
            const { error, value } = resetPasswordSchema.validate(body);
            if (error)
                return new Response(JSON.stringify({ error: error.details[0].message }), { status: 400 });

            const query = {};
            if (value.email) query.email = value.email;
            if (value.mobile) query.mobile = value.mobile;

            const existingUser = await usersCollection.findOne(query);
            if (!existingUser)
                return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

            const hashedPassword = await bcrypt.hash(value.newPassword, 10);

            await usersCollection.updateOne(
                { _id: existingUser._id },
                { $set: { password: hashedPassword, updatedAt: new Date() } }
            );

            return new Response(JSON.stringify({ success: true, message: "Password reset successful" }), { status: 200 });
        }

        // ✅ Normal JSON update request
        userId = body.id || body.userId;
        if (!userId)
            return new Response(JSON.stringify({ error: "User ID required" }), { status: 400 });

        // Get existing user data first to preserve existing documents
        const existingUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!existingUser)
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

        updateFields.updatedAt = new Date();

        // Only update provided fields, preserve others
        const allowedFields = [
            "name", "email", "mobile", "role", "summary", "password",
            "experience", "education", "skills", "company", "position",
            "dateOfBirth", "gender", "resume"
        ];

        allowedFields.forEach(field => {
            if (body[field] !== undefined && body[field] !== null) {
                // Hash password if it's being updated
                if (field === "password" && body[field]) {
                    updateFields[field] = bcrypt.hash(body[field], 10);
                } else {
                    updateFields[field] = body[field];
                }
            } else {
                // Preserve existing field if not provided
                updateFields[field] = existingUser[field];
            }
        });

        // 🔹 Handle Experience - preserve document URLs and merge with existing
        if (body.experience && Array.isArray(body.experience)) {
            updateFields.experience = body.experience.map((newExp, index) => {
                const existingExp = existingUser.experience?.[index];
                // If we have existing experience at this index, merge with new data
                if (existingExp) {
                    return {
                        ...existingExp, // Start with existing data
                        ...newExp, // Override with new data
                        documentUrl: newExp.documentUrl || existingExp.documentUrl, // Preserve existing document URL if new one not provided
                        logo: newExp.logo || existingExp.logo || dummyLogos[index % dummyLogos.length],
                        showDescription: newExp.showDescription !== undefined ? newExp.showDescription : existingExp.showDescription
                    };
                } else {
                    // New experience entry
                    return {
                        ...newExp,
                        logo: newExp.logo || dummyLogos[index % dummyLogos.length],
                        showDescription: newExp.showDescription || false
                    };
                }
            });
        } else {
            updateFields.experience = existingUser.experience;
        }

        // 🔹 Handle Education - preserve document URLs and merge with existing
        if (body.education && Array.isArray(body.education)) {
            updateFields.education = body.education.map((newEdu, index) => {
                const existingEdu = existingUser.education?.[index];
                // If we have existing education at this index, merge with new data
                if (existingEdu) {
                    return {
                        ...existingEdu, // Start with existing data
                        ...newEdu, // Override with new data
                        documentUrl: newEdu.documentUrl || existingEdu.documentUrl, // Preserve existing document URL if new one not provided
                        years: newEdu.years || `${newEdu.startYear || ''} - ${newEdu.endYear || ''}` || existingEdu.years
                    };
                } else {
                    // New education entry
                    return {
                        ...newEdu,
                        years: newEdu.years || `${newEdu.startYear || ''} - ${newEdu.endYear || ''}`
                    };
                }
            });
        } else {
            updateFields.education = existingUser.education;
        }

        // 🔹 Handle Skills - merge with existing
        if (body.skills) {
            updateFields.skills = [
                ...(existingUser.skills || []),
                ...(Array.isArray(body.skills) ? body.skills : [body.skills])
            ].filter((skill, index, arr) => arr.indexOf(skill) === index); // Remove duplicates
        } else {
            updateFields.skills = existingUser.skills;
        }

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0)
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

        return new Response(JSON.stringify({
            success: true,
            message: "Profile updated successfully",
            updatedFields: Object.keys(updateFields).filter(key => key !== 'updatedAt')
        }), { status: 200 });

    } catch (err) {
        console.error("PUT /api/users error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

// --------------------------------------------------------------------
// ✅ DELETE – Delete experience/education entries or documents
// --------------------------------------------------------------------
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

/* ----------------------------------------------------------
   🧾 Document Processing Helper Functions
---------------------------------------------------------- */

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