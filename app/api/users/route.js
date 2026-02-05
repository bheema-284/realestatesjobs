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

const recruiterResetPasswordSchema = Joi.object({
    recruiterEmail: Joi.string().email().required(),
    newPassword: Joi.string().min(6).required(),
    resetBy: Joi.string().required(), // companyId or 'superadmin'
});

// -------------------- Helpers for Cloudinary --------------------

// Upload a buffer to Cloudinary; folder is full path like `users/${userId}/projects`
async function uploadBufferToCloudinary(buffer, folder, options = {}) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: options.resource_type || 'image',
                transformation: options.transformation || [{ quality: "auto" }, { format: "webp" }]
            },
            (err, result) => (err ? reject(err) : resolve(result))
        );
        uploadStream.end(buffer);
    });
}

// Try to find a file in formData using several strategies.
// 1) formData.get(tempId)
// 2) formData.get(`projectImage_${pIndex}_${iIndex}`)
// 3) try to find a file among formData entries with matching filename/caption (best-effort)
function findProjectFileInFormData(formData, tempId, pIndex, iIndex, caption) {
    // 1) tempId
    if (tempId) {
        const f = formData.get(tempId);
        if (f && f.size && f.size > 0) return f;
    }

    // 2) indexed key
    const indexedKey = `projectImage_${pIndex}_${iIndex}`;
    const f2 = formData.get(indexedKey);
    if (f2 && f2.size && f2.size > 0) return f2;

    // 3) brute-force search over all formData files (best-effort)
    for (const pair of formData.entries()) {
        const [key, value] = pair;
        // skip non-File entries
        if (!value || typeof value !== 'object' || typeof value.size !== 'number') continue;
        // If caption exists, try match filename or original filename
        if (caption && value.name && caption && value.name.includes(caption)) {
            return value;
        }
        // Also allow keys beginning with "projectImage" (in case front-end used different keys)
        if (key && key.startsWith('projectImage')) {
            return value;
        }
    }

    return null;
}

// Optional helper: delete Cloudinary publicIds that were removed
async function cleanupDeletedProjectImages(oldProjects = [], newProjects = []) {
    try {
        const oldPublicIds = new Set();
        const newPublicIds = new Set();

        oldProjects.forEach(p => (p.images || []).forEach(img => { if (img.publicId) oldPublicIds.add(img.publicId); }));
        newProjects.forEach(p => (p.images || []).forEach(img => { if (img.publicId) newPublicIds.add(img.publicId); }));

        for (const publicId of oldPublicIds) {
            if (!newPublicIds.has(publicId)) {
                try {
                    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
                } catch (err) {
                    console.error("cleanupDeletedProjectImages - failed to destroy", publicId, err);
                }
            }
        }
    } catch (err) {
        console.error("cleanupDeletedProjectImages error:", err);
    }
}

// -------------------- Project images handler (REPLACEMENT) --------------------
// This function reads project images from parsedProjects and formData, uploads new files and returns final projects.
async function handleUpdatedProjectImages(formData, newProjects, oldProjects, userId) {
    const finalProjects = [];

    for (let pIndex = 0; pIndex < newProjects.length; pIndex++) {
        const project = newProjects[pIndex] || {};
        const existingProject = (oldProjects || [])[pIndex] || {};

        const resultImages = [];

        // If frontend provided an images array, iterate; otherwise fallback to existingProject.images
        const projectImagesArray = Array.isArray(project.images) ? project.images : [];

        for (let iIndex = 0; iIndex < projectImagesArray.length; iIndex++) {
            const img = projectImagesArray[iIndex];

            if (!img) continue;

            // CASE A: Already uploaded image (Cloudinary url) — keep as-is
            if (!img.isNew && img.url && !img.url.startsWith('blob:')) {
                resultImages.push({
                    url: img.url,
                    publicId: img.publicId || null,
                    caption: img.caption || ""
                });
                continue;
            }

            // CASE B: New image that was previewed and has tempId or indexed file => upload it
            if (img.isNew) {
                // Attempt to find the file in formData using multiple fallbacks
                const file = findProjectFileInFormData(formData, img.tempId, pIndex, iIndex, img.caption || "");

                if (file && file.size > 0) {
                    try {
                        // Convert file to buffer then upload
                        const buffer = Buffer.from(await file.arrayBuffer());
                        const uploaded = await uploadBufferToCloudinary(buffer, `users/${userId}/projects`, {
                            transformation: [
                                { width: 1200, height: 800, crop: "limit" },
                                { quality: "auto" },
                                { format: "webp" }
                            ]
                        });

                        resultImages.push({
                            url: uploaded.secure_url,
                            publicId: uploaded.public_id,
                            caption: img.caption || ""
                        });
                    } catch (err) {
                        console.error(`handleUpdatedProjectImages: upload failed for project ${pIndex} image ${iIndex}`, err);
                        // skip this image on error
                    }
                } else {
                    // No file found for this new image: skip it (do not push blob url)
                    console.warn(`No file found in formData for project ${pIndex} image ${iIndex} (tempId: ${img.tempId})`);
                }
                continue;
            }

            // CASE C: Unexpected / invalid entry — skip
        }

        // If no images were resolved for this project, keep existing images (so we don't wipe them)
        const finalImageSet = resultImages.length > 0 ? resultImages : (existingProject.images || []);

        // Merge project info: preserve existingProject fields and override with incoming project fields
        finalProjects.push({
            ...existingProject,
            ...project,
            images: finalImageSet,
            updatedAt: new Date().toISOString()
        });
    }

    return finalProjects;
}

// -------------------- Experience Documents Handler --------------------
async function processExperienceDocuments(formData, experienceData, userId, existingExperience) {
    const experienceWithDocs = [];

    for (let i = 0; i < Math.max(experienceData.length, existingExperience.length); i++) {
        const newExp = experienceData[i] || {};
        const existingExp = existingExperience[i] || {};

        let documentUrl = existingExp.documentUrl;
        let documentPreviewUrl = existingExp.documentPreviewUrl;

        // Check if there's a new document file for this experience entry
        const docFile = formData.get(`experienceDoc_${i}`);
        if (docFile && docFile.size > 0) {
            console.log(`Uploading experience document for index ${i}`);

            const buffer = Buffer.from(await docFile.arrayBuffer());

            // Check file type
            const isPDF = docFile.type === 'application/pdf';
            const isWord = docFile.type.includes('msword') || docFile.type.includes('wordprocessingml');

            // Use 'auto' for PDFs to get proper preview, 'raw' for other files
            const resourceType = isPDF ? 'auto' : 'raw';

            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: `users/${userId}/experience`,
                        resource_type: resourceType,
                        public_id: `exp_${i}_${Date.now()}`,
                        // For PDFs, add flags for better handling
                        ...(isPDF && {
                            flags: 'attachment'
                        }),
                        // For Word docs, preserve format
                        ...(isWord && {
                            format: docFile.name.endsWith('.docx') ? 'docx' : 'doc'
                        })
                    },
                    (err, res) => (err ? reject(err) : resolve(res))
                );
                uploadStream.end(buffer);
            });

            documentUrl = result.secure_url;

            // For PDFs, we can use the URL directly for preview
            // For other files, we'll need to handle preview differently
            if (isPDF) {
                documentPreviewUrl = documentUrl;
            } else {
                // For non-PDF files, we can't preview in iframe
                documentPreviewUrl = null;
            }

            console.log(`Experience document uploaded: ${documentUrl}`, { isPDF, isWord });
        }

        const mergedExperience = {
            ...existingExp,
            ...newExp,
            documentUrl: documentUrl,
            documentPreviewUrl: documentPreviewUrl,
            logo: newExp.logo || existingExp.logo || dummyLogos[i % dummyLogos.length],
            showDescription: newExp.showDescription !== undefined ? newExp.showDescription : (existingExp.showDescription || false)
        };

        experienceWithDocs.push(mergedExperience);
    }

    return experienceWithDocs;
}

// -------------------- Education Documents Handler --------------------
async function processEducationDocuments(formData, educationData, userId, existingEducation) {
    const educationWithDocs = [];

    for (let i = 0; i < Math.max(educationData.length, existingEducation.length); i++) {
        const newEdu = educationData[i] || {};
        const existingEdu = existingEducation[i] || {};

        let documentUrl = existingEdu.documentUrl;
        let documentPreviewUrl = existingEdu.documentPreviewUrl;

        const docFile = formData.get(`educationDoc_${i}`);
        if (docFile && docFile.size > 0) {
            console.log(`Uploading education document for index ${i}`);

            const buffer = Buffer.from(await docFile.arrayBuffer());

            const isPDF = docFile.type === 'application/pdf';
            const isWord = docFile.type.includes('msword') || docFile.type.includes('wordprocessingml');
            const resourceType = isPDF ? 'auto' : 'raw';

            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: `users/${userId}/education`,
                        resource_type: resourceType,
                        public_id: `edu_${i}_${Date.now()}`,
                        ...(isPDF && {
                            flags: 'attachment'
                        }),
                        ...(isWord && {
                            format: docFile.name.endsWith('.docx') ? 'docx' : 'doc'
                        })
                    },
                    (err, res) => (err ? reject(err) : resolve(res))
                );
                uploadStream.end(buffer);
            });

            documentUrl = result.secure_url;

            if (isPDF) {
                documentPreviewUrl = documentUrl;
            } else {
                documentPreviewUrl = null;
            }

            console.log(`Education document uploaded: ${documentUrl}`, { isPDF, isWord });
        }

        const mergedEducation = {
            ...existingEdu,
            ...newEdu,
            documentUrl: documentUrl,
            documentPreviewUrl: documentPreviewUrl,
            years: newEdu.years || `${newEdu.startYear || ''} - ${newEdu.endYear || ''}` || existingEdu.years
        };

        educationWithDocs.push(mergedEducation);
    }

    return educationWithDocs;
}

// -------------------- Media uploads (gallery, videos, logo, cover) --------------------
async function handleMediaUploads(formData, updateFields, existingUser, userId) {
    try {
        // Handle gallery images upload
        const galleryImagesData = formData.get("galleryImages");
        if (galleryImagesData) {
            try {
                const parsedImages = JSON.parse(galleryImagesData);
                if (Array.isArray(parsedImages)) {
                    updateFields.galleryImages = parsedImages;
                }
            } catch (error) {
                console.warn("Gallery images field is not valid JSON, treating as text");
                updateFields.galleryImages = galleryImagesData;
            }
        }

        // Handle individual image file uploads for gallery
        const imageFiles = formData.getAll("galleryImageFiles");
        if (imageFiles && imageFiles.length > 0 && imageFiles[0].size > 0) {
            const uploadedImages = [];

            for (const file of imageFiles) {
                if (file.size > 0) {
                    try {
                        const buffer = Buffer.from(await file.arrayBuffer());
                        const result = await new Promise((resolve, reject) => {
                            const uploadStream = cloudinary.uploader.upload_stream(
                                {
                                    folder: `users/${userId}/gallery`,
                                    resource_type: 'image',
                                    transformation: [
                                        { width: 1200, height: 800, crop: "limit" },
                                        { quality: "auto" },
                                        { format: "webp" }
                                    ]
                                },
                                (err, res) => (err ? reject(err) : resolve(res))
                            );
                            uploadStream.end(buffer);
                        });

                        uploadedImages.push({
                            url: result.secure_url,
                            publicId: result.public_id,
                            caption: "",
                            isVisible: true,
                            uploadedAt: new Date(),
                            size: file.size,
                            type: file.type
                        });
                    } catch (error) {
                        console.error("Error uploading gallery image:", error);
                    }
                }
            }

            if (uploadedImages.length > 0) {
                const existingImages = existingUser.galleryImages || [];
                updateFields.galleryImages = [...existingImages, ...uploadedImages];
            }
        }

        // Handle videos data
        const videosData = formData.get("videos");
        if (videosData) {
            try {
                const parsedVideos = JSON.parse(videosData);
                if (Array.isArray(parsedVideos)) {
                    updateFields.videos = parsedVideos;
                }
            } catch (error) {
                console.warn("Videos field is not valid JSON, treating as text");
                updateFields.videos = videosData;
            }
        }

        // Handle individual video file uploads
        const videoFiles = formData.getAll("videoFiles");
        if (videoFiles && videoFiles.length > 0 && videoFiles[0].size > 0) {
            const uploadedVideos = [];

            for (const file of videoFiles) {
                if (file.size > 0) {
                    try {
                        const buffer = Buffer.from(await file.arrayBuffer());
                        const result = await new Promise((resolve, reject) => {
                            const uploadStream = cloudinary.uploader.upload_stream(
                                {
                                    folder: `users/${userId}/videos`,
                                    resource_type: 'video',
                                    chunk_size: 6000000, // 6MB chunks
                                },
                                (err, res) => (err ? reject(err) : resolve(res))
                            );
                            uploadStream.end(buffer);
                        });

                        uploadedVideos.push({
                            url: result.secure_url,
                            publicId: result.public_id,
                            title: file.name.replace(/\.[^/.]+$/, ""),
                            description: "",
                            thumbnail: result.secure_url.replace(/\.(mp4|mov|avi)$/, '.jpg'),
                            isVisible: true,
                            uploadedAt: new Date(),
                            size: file.size,
                            type: file.type,
                            duration: result.duration || 0
                        });
                    } catch (error) {
                        console.error("Error uploading video:", error);
                    }
                }
            }

            if (uploadedVideos.length > 0) {
                const existingVideos = existingUser.videos || [];
                updateFields.videos = [...existingVideos, ...uploadedVideos];
            }
        }

        // Handle company logo upload
        const companyLogoFile = formData.get("companyLogo");
        if (companyLogoFile && companyLogoFile.size > 0) {
            try {
                const buffer = Buffer.from(await companyLogoFile.arrayBuffer());
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: `users/${userId}/company`,
                            public_id: `company_logo_${Date.now()}`,
                            transformation: [
                                { width: 200, height: 200, crop: "fill" },
                                { quality: "auto" },
                                { format: "webp" }
                            ]
                        },
                        (err, res) => (err ? reject(err) : resolve(res))
                    );
                    uploadStream.end(buffer);
                });
                updateFields.companyLogo = result.secure_url;
            } catch (error) {
                console.error("Error uploading company logo:", error);
            }
        }

        // Handle cover image upload
        const coverImageFile = formData.get("coverImage");
        if (coverImageFile && coverImageFile.size > 0) {
            try {
                const buffer = Buffer.from(await coverImageFile.arrayBuffer());
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: `users/${userId}/cover`,
                            public_id: `cover_image_${Date.now()}`,
                            transformation: [
                                { width: 1200, height: 400, crop: "fill" },
                                { quality: "auto" },
                                { format: "webp" }
                            ]
                        },
                        (err, res) => (err ? reject(err) : resolve(res))
                    );
                    uploadStream.end(buffer);
                });
                updateFields.coverImage = result.secure_url;
            } catch (error) {
                console.error("Error uploading cover image:", error);
            }
        }

    } catch (error) {
        console.error("Error handling media uploads:", error);
        throw new Error(`Media upload failed: ${error.message}`);
    }
}

/**
 * Process recruiters data for company/superadmin roles
 */
function processRecruitersData(newRecruiters, existingRecruiters) {
    return newRecruiters.map(recruiter => {
        const existingRecruiter =
            existingRecruiters.find(r => r.id === recruiter.id) || {};

        return {
            ...existingRecruiter,
            ...recruiter,

            // never overwrite password with empty string
            password: recruiter.password || existingRecruiter.password,

            id:
                recruiter.id ||
                existingRecruiter.id ||
                `recruiter-${Date.now()}-${Math.random().toString(36).substring(7)}`,

            joinDate:
                recruiter.joinDate ||
                existingRecruiter.joinDate ||
                new Date().toISOString().split("T")[0],

            updatedAt: new Date().toISOString(),
        };
    });
}

// -------------------- Recruiter Password Reset Helper --------------------
async function resetRecruiterPassword(recruiterEmail, newPassword, resetBy) {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DBNAME);
    const usersCollection = db.collection("rej_users");

    console.log('🔄 Resetting recruiter password:', { recruiterEmail, resetBy });

    // Find the company that has this recruiter
    const company = await usersCollection.findOne({
        "recruiters.email": recruiterEmail.toLowerCase().trim()
    });

    if (!company) {
        throw new Error("Recruiter not found in any company");
    }

    // Find the specific recruiter
    const recruiter = company.recruiters.find(rec =>
        rec.email?.toLowerCase().trim() === recruiterEmail.toLowerCase().trim()
    );

    if (!recruiter) {
        throw new Error("Recruiter not found in company");
    }

    // Check permissions
    if (resetBy !== 'superadmin') {
        // If resetBy is a company ID, check if this company owns the recruiter
        if (company._id.toString() !== resetBy) {
            throw new Error("You don't have permission to reset this recruiter's password");
        }
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the recruiter's password in the company's recruiters array
    const result = await usersCollection.updateOne(
        {
            _id: company._id,
            "recruiters.email": recruiterEmail.toLowerCase().trim()
        },
        {
            $set: {
                "recruiters.$.password": hashedPassword,
                "recruiters.$.updatedAt": new Date().toISOString(),
                "recruiters.$.lastUpdated": new Date()
            }
        }
    );

    if (result.modifiedCount === 0) {
        throw new Error("Failed to update recruiter password");
    }

    console.log('✅ Recruiter password reset successfully');
    return {
        success: true,
        message: "Recruiter password reset successfully",
        recruiterName: recruiter.name,
        recruiterEmail: recruiter.email,
        companyName: company.name
    };
}

// Helper function for JSON projects (for non-formData requests)
function processProjectsFromJSON(newProjects, existingProjects) {
    return newProjects.map(project => {
        const existingProject = existingProjects.find(p =>
            p._id?.toString() === project._id?.toString() ||
            p.id === project.id
        ) || {};

        return {
            ...existingProject,
            ...project,
            _id: project._id && typeof project._id === 'string' ?
                new ObjectId(project._id) :
                project._id || existingProject._id || new ObjectId(),
            lastUpdated: new Date(),
            addedDate: project.addedDate || existingProject.addedDate || new Date()
        };
    });
}

// -------------------- PUT handler (main) --------------------
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

            // 🔹 Handle Recruiter Password Reset
            if (body.resetRecruiterPassword && body.recruiterEmail) {
                console.log('🔄 Processing recruiter password reset request');

                const { error, value } = recruiterResetPasswordSchema.validate({
                    recruiterEmail: body.recruiterEmail,
                    newPassword: body.newPassword,
                    resetBy: body.resetBy
                });

                if (error) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: error.details[0].message
                    }), { status: 400 });
                }

                try {
                    const result = await resetRecruiterPassword(
                        value.recruiterEmail,
                        value.newPassword,
                        value.resetBy
                    );

                    return new Response(JSON.stringify(result), { status: 200 });
                } catch (error) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: error.message
                    }), { status: 400 });
                }
            }

            // 🔹 Handle Regular User Password Reset
            if (body.resetPassword && (body.email || body.mobile)) {
                const { error, value } = resetPasswordSchema.validate({
                    email: body.email,
                    mobile: body.mobile,
                    newPassword: body.newPassword
                });

                if (error) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: error.details[0].message
                    }), { status: 400 });
                }

                // Find user by email or mobile
                const query = {};
                if (value.email) query.email = value.email;
                if (value.mobile) query.mobile = value.mobile;

                const user = await usersCollection.findOne(query);
                if (!user) {
                    return new Response(JSON.stringify({
                        success: false,
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
                        success: false,
                        error: "Failed to reset password"
                    }), { status: 500 });
                }

                return new Response(JSON.stringify({
                    success: true,
                    message: "Password reset successfully"
                }), { status: 200 });
            }
        }

        // ✅ Handle Multipart (FormData) - Profile updates + documents + media
        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            userId = formData.get("id") || formData.get("userId");

            // Check if this is a password reset via form data
            const resetPassword = formData.get("resetPassword");
            const email = formData.get("email");
            const mobile = formData.get("mobile");
            const newPassword = formData.get("newPassword");

            // 🔹 Handle Recruiter Password Reset via FormData
            const resetRecruiterPasswordFlag = formData.get("resetRecruiterPassword");
            const recruiterEmail = formData.get("recruiterEmail");
            const resetBy = formData.get("resetBy");

            if (resetRecruiterPasswordFlag === "true" && recruiterEmail && resetBy) {
                console.log('🔄 Processing recruiter password reset via FormData');

                const newPassword = formData.get("newPassword");

                const { error, value } = recruiterResetPasswordSchema.validate({
                    recruiterEmail: recruiterEmail,
                    newPassword: newPassword,
                    resetBy: resetBy
                });

                if (error) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: error.details[0].message
                    }), { status: 400 });
                }

                try {
                    const result = await resetRecruiterPassword(
                        value.recruiterEmail,
                        value.newPassword,
                        value.resetBy
                    );

                    return new Response(JSON.stringify(result), { status: 200 });
                } catch (error) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: error.message
                    }), { status: 400 });
                }
            }

            if (resetPassword === "true" && (email || mobile) && newPassword) {
                // Validate reset password data using Joi schema
                const { error, value } = resetPasswordSchema.validate({
                    email: email || undefined,
                    mobile: mobile || undefined,
                    newPassword: newPassword
                });

                if (error) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: error.details[0].message
                    }), { status: 400 });
                }

                // Find user by email or mobile
                const query = {};
                if (value.email) query.email = value.email;
                if (value.mobile) query.mobile = value.mobile;

                const user = await usersCollection.findOne(query);
                if (!user) {
                    return new Response(JSON.stringify({
                        success: false,
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
                        success: false,
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
                return new Response(JSON.stringify({
                    success: false,
                    error: "User ID required"
                }), { status: 400 });

            const existingUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
            if (!existingUser)
                return new Response(JSON.stringify({
                    success: false,
                    error: "User not found"
                }), { status: 404 });

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
                "about", "vision", "mission", "services", "values"
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
                        success: false,
                        error: "Current password is incorrect"
                    }), { status: 400 });
                }

                if (newPasswordChange.length < 6) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: "New password must be at least 6 characters long"
                    }), { status: 400 });
                }

                updateFields.password = await bcrypt.hash(newPasswordChange, 10);
            }

            // 🔹 Handle JSON fields - parse if they contain JSON, otherwise treat as text
            const potentialJsonFields = [
                "experience", "education", "applications", "marketing",
                "leadership", "achievements", "certifications",
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
                        if (["company", "superadmin", "recruiter"].includes(existingUser.role)) {

                            // Process projects to ensure they have MongoDB ObjectIds
                            const processedProjects = parsedProjects.map(project => {
                                // If project doesn't have _id, create a new ObjectId
                                if (!project._id) {
                                    const projectObjectId = new ObjectId();
                                    return {
                                        ...project,
                                        _id: projectObjectId,
                                        id: projectObjectId.toString(), // Keep string id for compatibility
                                        addedDate: project.addedDate || new Date(),
                                        lastUpdated: new Date()
                                    };
                                }

                                // If project has _id but it's a string, convert to ObjectId
                                if (project._id && typeof project._id === 'string') {
                                    return {
                                        ...project,
                                        _id: new ObjectId(project._id),
                                        lastUpdated: new Date()
                                    };
                                }

                                // Existing project with proper ObjectId, just update lastUpdated
                                return {
                                    ...project,
                                    lastUpdated: new Date()
                                };
                            });

                            // ---- NEW: robust project handling using helper above ----
                            updateFields.projects = await handleUpdatedProjectImages(
                                formData,
                                processedProjects,
                                existingUser.projects || [],
                                userId
                            );

                            // Optional: cleanup deleted images from Cloudinary
                            try {
                                await cleanupDeletedProjectImages(existingUser.projects || [], updateFields.projects || []);
                            } catch (cleanupErr) {
                                console.error("cleanupDeletedProjectImages error:", cleanupErr);
                            }

                        } else {
                            return new Response(
                                JSON.stringify({
                                    success: false,
                                    error: "Only company, superadmin, and recruiter roles can manage projects",
                                }),
                                { status: 403 }
                            );
                        }
                    }
                } catch (error) {
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
                        // 🔹 Permission check
                        if (["company", "superadmin"].includes(existingUser.role)) {

                            const processedRecruiters = await Promise.all(
                                parsedRecruiters.map(async recruiter => {

                                    let finalPassword = undefined;

                                    // 🔹 If frontend sends password → hash it
                                    if (recruiter.password && recruiter.password.trim() !== "") {
                                        const salt = await bcrypt.genSalt(10);
                                        finalPassword = await bcrypt.hash(recruiter.password, salt);
                                    }

                                    // 🔹 Ensure correct _id handling
                                    if (!recruiter._id) {
                                        return {
                                            ...recruiter,
                                            password: finalPassword || undefined, // don't overwrite if not sent
                                            _id: new ObjectId(),
                                            id: recruiter.id || `recruiter-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                                            addedDate: recruiter.addedDate || new Date(),
                                            lastUpdated: new Date(),
                                            updatedAt: new Date(),
                                        };
                                    }

                                    if (recruiter._id && typeof recruiter._id === "string") {
                                        return {
                                            ...recruiter,
                                            password: finalPassword || undefined,
                                            _id: new ObjectId(recruiter._id),
                                            lastUpdated: new Date(),
                                            updatedAt: new Date(),
                                        };
                                    }

                                    // Existing recruiter (keep old password unless new one provided)
                                    return {
                                        ...recruiter,
                                        password: finalPassword || recruiter.password,
                                        lastUpdated: new Date(),
                                        updatedAt: new Date(),
                                    };
                                })
                            );

                            updateFields.recruiters = processRecruitersData(
                                processedRecruiters,
                                existingUser.recruiters || []
                            );
                        }
                    }
                } catch (err) {
                    console.warn("Recruiters JSON invalid:", err);
                    updateFields.recruiters = recruitersData;
                }
            }

            // 🔹 Handle Experience with documents
            const experienceData = formData.get("experience");
            if (experienceData) {
                try {
                    const parsedExperience = JSON.parse(experienceData);
                    if (Array.isArray(parsedExperience)) {
                        // ✅ FIXED: Now calling processExperienceDocuments for experience
                        updateFields.experience = await processExperienceDocuments(
                            formData,
                            parsedExperience,
                            userId,
                            existingUser.experience || []
                        );
                    }
                } catch (error) {
                    console.warn("Experience field is not valid JSON, treating as text");
                    updateFields.experience = experienceData;
                }
            }

            // 🔹 Handle Education with documents
            const educationData = formData.get("education");
            if (educationData) {
                try {
                    const parsedEducation = JSON.parse(educationData);
                    if (Array.isArray(parsedEducation)) {
                        updateFields.education = await processEducationDocuments(
                            formData,
                            parsedEducation,
                            userId,
                            existingUser.education || []
                        );
                    }
                } catch (error) {
                    console.warn("Education field is not valid JSON, treating as text");
                    updateFields.education = educationData;
                }
            }

            // 🔹 Handle Media Uploads - Images and Videos
            await handleMediaUploads(formData, updateFields, existingUser, userId);

            // 🔹 Handle ANY other fields that weren't explicitly handled
            for (const [key, value] of formData.entries()) {
                // Skip fields we've already processed and system fields
                if (key === 'id' || key === 'userId' || key === 'image' || key === 'resume' ||
                    key === 'currentPassword' || key === 'newPassword' || key === 'resetPassword' ||
                    key === 'resetRecruiterPassword' || key === 'recruiterEmail' || key === 'resetBy' ||
                    key.startsWith('galleryImage_') || key.startsWith('video_') || key.startsWith('projectImage_') ||
                    key.startsWith('projectGallery_') || key.startsWith('projectDocuments_') ||
                    key.startsWith('experienceDoc_') || key.startsWith('educationDoc_') ||
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
                        {
                            folder: "users",
                            transformation: [
                                { width: 200, height: 200, crop: "fill" },
                                { quality: "auto" },
                                { format: "webp" }
                            ]
                        },
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
                return new Response(JSON.stringify({
                    success: false,
                    error: "User not found"
                }), { status: 404 });

            return new Response(JSON.stringify({
                success: true,
                message: "Profile updated successfully",
                updatedFields: Object.keys(updateFields).filter(k => k !== 'updatedAt'),
                projects: updateFields.projects ? updateFields.projects.length : 0
            }), { status: 200 });
        }

        // ✅ Handle JSON request for regular profile updates
        const body = await request.json();

        // 🔹 Handle Recruiter Password Reset in JSON
        if (body.resetRecruiterPassword && body.recruiterEmail) {
            console.log('🔄 Processing recruiter password reset request');

            const { error, value } = recruiterResetPasswordSchema.validate({
                recruiterEmail: body.recruiterEmail,
                newPassword: body.newPassword,
                resetBy: body.resetBy
            });

            if (error) {
                return new Response(JSON.stringify({
                    success: false,
                    error: error.details[0].message
                }), { status: 400 });
            }

            try {
                const result = await resetRecruiterPassword(
                    value.recruiterEmail,
                    value.newPassword,
                    value.resetBy
                );

                return new Response(JSON.stringify(result), { status: 200 });
            } catch (error) {
                return new Response(JSON.stringify({
                    success: false,
                    error: error.message
                }), { status: 400 });
            }
        }

        // Check if this is a reset password request in JSON
        if (body.resetPassword && (body.email || body.mobile)) {
            const { error, value } = resetPasswordSchema.validate({
                email: body.email,
                mobile: body.mobile,
                newPassword: body.newPassword
            });

            if (error) {
                return new Response(JSON.stringify({
                    success: false,
                    error: error.details[0].message
                }), { status: 400 });
            }

            // Find user by email or mobile
            const query = {};
            if (value.email) query.email = value.email;
            if (value.mobile) query.mobile = value.mobile;

            const user = await usersCollection.findOne(query);
            if (!user) {
                return new Response(JSON.stringify({
                    success: false,
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
                    success: false,
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
            return new Response(JSON.stringify({
                success: false,
                error: "User ID required"
            }), { status: 400 });

        const existingUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!existingUser)
            return new Response(JSON.stringify({
                success: false,
                error: "User not found"
            }), { status: 404 });

        // 🔹 CRITICAL FIX: Only update fields that are provided
        updateFields.updatedAt = new Date();

        // 🔹 Handle ALL fields from the request body
        for (const [field, value] of Object.entries(body)) {
            // Skip system fields
            if (field === 'id' || field === 'userId' || field === 'resetPassword' || field === 'resetRecruiterPassword') {
                continue;
            }

            // Handle password separately
            if (field === "password" && value) {
                if (value.length < 6) {
                    return new Response(JSON.stringify({
                        success: false,
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
                        success: false,
                        error: "Current password is incorrect"
                    }), { status: 400 });
                }
                continue;
            }

            if (field === "newPassword" && body.currentPassword) {
                if (value.length < 6) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: "New password must be at least 6 characters long"
                    }), { status: 400 });
                }
                updateFields.password = await bcrypt.hash(value, 10);
                continue;
            }

            // Handle role-specific restrictions
            if (field === "projects" && !["company", "superadmin", "recruiter"].includes(existingUser.role)) {
                return new Response(JSON.stringify({
                    success: false,
                    error: "Only company, superadmin, and recruiter roles can manage projects"
                }), { status: 403 });
            }

            if (field === "recruiters" && !["company", "superadmin"].includes(existingUser.role)) {
                return new Response(JSON.stringify({
                    success: false,
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

            // Handle media fields
            if (field === "galleryImages" || field === "videos") {
                if (Array.isArray(value)) {
                    updateFields[field] = value;
                }
                continue;
            }

            // Handle experience and education in JSON requests
            if (field === "experience" || field === "education") {
                if (Array.isArray(value)) {
                    updateFields[field] = value;
                }
                continue;
            }

            // For all other fields, store as-is (arrays, objects, strings, numbers)
            if (value !== undefined && value !== null) {
                updateFields[field] = value;
            }
        }

        // 🔹 FIXED: Handle projects specifically for JSON requests
        if (body.projects) {
            if (["company", "superadmin", "recruiter"].includes(existingUser.role)) {
                updateFields.projects = processProjectsFromJSON(
                    body.projects,
                    existingUser.projects || []
                );
            } else {
                return new Response(JSON.stringify({
                    success: false,
                    error: "Only company, superadmin, and recruiter roles can manage projects"
                }), { status: 403 });
            }
        }

        // ✅ Update DB - only updates provided fields, keeps others intact
        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0)
            return new Response(JSON.stringify({
                success: false,
                error: "User not found"
            }), { status: 404 });

        return new Response(JSON.stringify({
            success: true,
            message: "Profile updated successfully",
            updatedFields: Object.keys(updateFields).filter(k => k !== 'updatedAt'),
            projects: updateFields.projects ? updateFields.projects.length : 0
        }), { status: 200 });

    } catch (err) {
        console.error("PUT /api/users error:", err);
        return new Response(JSON.stringify({
            success: false,
            error: err.message
        }), { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { action, ...data } = body;

        console.log('📝 API Request:', { action, data });

        // Validate action
        if (!['register', 'login', 'add-recruiter'].includes(action)) {
            return new Response(
                JSON.stringify({ error: "Invalid action specified" }),
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const users = db.collection("rej_users");

        // Handle different actions
        switch (action) {
            case 'register':
                return await handleRegister(data, users);
            case 'login':
                return await handleLogin(data, users);
            case 'add-recruiter':
                return await handleAddRecruiter(data, users);
            default:
                return new Response(
                    JSON.stringify({ error: "Invalid action" }),
                    { status: 400 }
                );
        }

    } catch (err) {
        console.error("❌ POST Error:", err);
        return new Response(
            JSON.stringify({ error: "Internal server error. Please try again later." }),
            { status: 500 }
        );
    }
}

// Handle user registration
async function handleRegister(data, users) {
    const { name, email, role, password, confirmPassword } = data;

    console.log('📝 Registration attempt for:', email, 'role:', role);

    // Basic validation
    if (!name || !email || !password || !role) {
        return new Response(
            JSON.stringify({ error: "All fields are required" }),
            { status: 400 }
        );
    }

    // Validate role
    if (!['applicant', 'company'].includes(role)) {
        return new Response(
            JSON.stringify({ error: "Invalid role specified" }),
            { status: 400 }
        );
    }

    // Check password confirmation
    if (confirmPassword && password !== confirmPassword) {
        return new Response(
            JSON.stringify({ error: "Passwords do not match" }),
            { status: 400 }
        );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await users.findOne({ email: normalizedEmail });
    if (existingUser) {
        return new Response(
            JSON.stringify({ error: "Email already registered" }),
            { status: 409 }
        );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data based on role
    const userData = {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: role,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        lastSeen: new Date(),
        online: false
    };

    // Add role-specific fields
    if (role === 'company') {
        userData.companyId = new ObjectId();
        userData.profileImage = "";
        userData.mobile = "";
        userData.position = "";
        userData.location = "";
        userData.website = "";
        userData.about = "";
        userData.description = "";
        userData.mission = "";
        userData.vision = "";
        userData.tagline = "";
        userData.established = "";
        userData.industry = "Real Estate";
        userData.contactPerson = name;
        userData.projects = [];
        userData.recruiters = [];
        userData.applicants = [];
        userData.appliedJobs = [];
        userData.chats = [];
        userData.galleryImages = [];
        userData.videos = [];
        userData.services = [];
        userData.achievements = [];
        userData.certifications = [];
        userData.leadership = [];
        userData.statistics = [];
        userData.values = [];
        userData.whyChooseUs = [];
        userData.socialMedia = {
            linkedin: "",
            twitter: "",
            facebook: "",
            instagram: ""
        };
    } else if (role === 'applicant') {
        userData.applicantId = new ObjectId();
        userData.profileImage = "";
        userData.mobile = "";
        userData.position = "";
        userData.location = "";
        userData.summary = "";
        userData.experience = 0;
        userData.education = 0;
        userData.skills = [];
        userData.workExperience = [];
        userData.educationHistory = [];
        userData.certifications = [];
        userData.languages = [];
        userData.appliedJobs = [];
        userData.chats = [];
        userData.resume = "";
        userData.coverLetter = "";
        userData.availability = "immediate";
        userData.expectedSalary = "";
        userData.preferredLocations = [];
        userData.noticePeriod = 0;
        userData.dateOfBirth = "";
        userData.gender = "";
        userData.maritalStatus = "";
        userData.nationality = "";
        userData.address = "";
        userData.city = "";
        userData.state = "";
        userData.pincode = "";
        userData.linkedin = "";
        userData.github = "";
        userData.portfolio = "";
    }

    // Insert user
    const result = await users.insertOne(userData);
    const insertedId = result.insertedId;

    console.log('✅ User registered successfully:', email, 'role:', role);

    // Generate JWT token for immediate login
    const token = generateAuthToken({
        _id: insertedId,
        name: userData.name,
        email: userData.email,
        role: userData.role
    });

    // Prepare response data
    const responseData = {
        success: true,
        user: {
            _id: insertedId,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            mobile: userData.mobile || "",
            isRecruiter: false
        },
        token: token
    };

    // Add role-specific response data
    if (role === 'company') {
        responseData.user.companyId = userData.companyId;
        responseData.user.companyName = userData.name;
        responseData.user.isCompany = true;
    } else if (role === 'applicant') {
        responseData.user.applicantId = userData.applicantId;
        responseData.user.isApplicant = true;
    }

    return new Response(
        JSON.stringify(responseData),
        {
            status: 201,
            headers: {
                "Content-Type": "application/json",
                "Set-Cookie": `auth_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`
            }
        }
    );
}

// Handle user login
async function handleLogin(data, users) {
    const { email, password, isRecruiter } = data;

    console.log('🔐 Login attempt for:', email, 'isRecruiter:', isRecruiter);

    // Basic validation
    if (!email || !password) {
        return new Response(
            JSON.stringify({ error: "Email and password are required" }),
            { status: 400 }
        );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Step 1: First check if it's a recruiter (even if isRecruiter is false)
    console.log('🔍 Searching for recruiter in companies...');
    let company = null;
    let recruiter = null;

    // Try to find recruiter by email in any company
    const companies = await users.find({
        "role": "company",
        "recruiters.email": normalizedEmail
    }).toArray();

    for (const comp of companies) {
        const foundRecruiter = comp.recruiters?.find(rec =>
            rec.email?.toLowerCase().trim() === normalizedEmail
        );
        if (foundRecruiter) {
            company = comp;
            recruiter = foundRecruiter;
            break;
        }
    }

    if (recruiter) {
        console.log('✅ Found recruiter:', recruiter.email, 'in company:', company.name);

        // Verify recruiter password
        let isValidPassword = false;

        if (recruiter.password && recruiter.password.startsWith('$2b$')) {
            // Password is bcrypt hashed
            isValidPassword = await bcrypt.compare(password, recruiter.password);
        } else if (recruiter.password) {
            // Password is plain text (for testing/dev)
            isValidPassword = (password === recruiter.password);
        } else {
            console.log('❌ Recruiter has no password set');
            return new Response(
                JSON.stringify({ error: "Invalid email or password" }),
                { status: 401 }
            );
        }

        console.log('🔑 Password comparison result:', isValidPassword);

        if (!isValidPassword) {
            console.log('❌ Recruiter password incorrect');
            return new Response(
                JSON.stringify({ error: "Invalid email or password" }),
                { status: 401 }
            );
        }

        // Check if recruiter is active
        if (recruiter.isActive === false) {
            console.log('❌ Recruiter account deactivated');
            return new Response(
                JSON.stringify({ error: "Your account has been deactivated" }),
                { status: 403 }
            );
        }

        // Generate token and prepare response for recruiter
        const userData = {
            _id: recruiter._id || recruiter.id || new ObjectId(),
            name: recruiter.name,
            email: recruiter.email,
            phone: recruiter.phone || recruiter.mobile || "",
            isRecruiter: true,
            companyId: company._id,
            companyName: company.name,
            companyProfileImage: company.profileImage,
            mainUserRole: company.role,
            permissions: recruiter.permissions || {
                canPostJobs: true,
                canViewApplications: true,
                canManageJobs: false,
                canManageRecruiters: false
            },
            isActive: recruiter.isActive !== false,
            recruiterId: recruiter._id || recruiter.id,
            department: recruiter.department || ""
        };

        const token = generateAuthToken(userData);
        const responseData = {
            success: true,
            user: {
                _id: userData._id,
                name: userData.name,
                email: userData.email,
                role: "recruiter",
                mobile: userData.phone || "",
                companyId: userData.companyId,
                companyName: userData.companyName,
                companyProfileImage: userData.companyProfileImage,
                permissions: userData.permissions,
                isRecruiter: true,
                mainUserRole: userData.mainUserRole,
                recruiterId: userData.recruiterId,
                department: userData.department,
                createdBy: recruiter.createdBy || ""
            },
            token: token
        };

        console.log('🎉 Recruiter login successful for:', userData.email);
        return new Response(JSON.stringify(responseData), { status: 200 });
    }

    // Step 2: If not a recruiter, check for regular user (applicant or company)
    console.log('🔍 Searching for regular user...');
    const regularUser = await users.findOne({
        email: normalizedEmail
    });

    if (!regularUser) {
        console.log('❌ User not found with email:', normalizedEmail);
        return new Response(
            JSON.stringify({ error: "Invalid email or password" }),
            { status: 401 }
        );
    }

    console.log('✅ Found user:', regularUser.email, 'role:', regularUser.role);

    // Verify password
    const isValidPassword = await bcrypt.compare(password, regularUser.password);
    if (!isValidPassword) {
        console.log('❌ Password incorrect');
        return new Response(
            JSON.stringify({ error: "Invalid email or password" }),
            { status: 401 }
        );
    }

    // Generate token and prepare response based on role
    const token = generateAuthToken(regularUser);
    let userResponse = {
        _id: regularUser._id,
        name: regularUser.name,
        email: regularUser.email,
        mobile: regularUser.mobile || "",
        isRecruiter: false,
        profileImage: regularUser.profileImage || ""
    };

    // Add role-specific data
    if (regularUser.role === 'company') {
        userResponse = {
            ...userResponse,
            role: "company",
            companyId: regularUser._id,
            companyName: regularUser.name,
            isCompany: true,
            projects: regularUser.projects || [],
            recruiters: regularUser.recruiters || [],
            applicants: regularUser.applicants || [],
            website: regularUser.website || "",
            location: regularUser.location || "",
            industry: regularUser.industry || "Real Estate"
        };
    } else if (regularUser.role === 'applicant') {
        userResponse = {
            ...userResponse,
            role: "applicant",
            isApplicant: true,
            applicantId: regularUser._id,
            position: regularUser.position || "",
            experience: regularUser.experience || 0,
            education: regularUser.education || "",
            skills: regularUser.skills || [],
            location: regularUser.location || "",
            summary: regularUser.summary || ""
        };
    } else {
        userResponse.role = regularUser.role || "user";
    }

    const responseData = {
        success: true,
        user: userResponse,
        token: token
    };

    console.log('🎉 Login successful for:', regularUser.email);
    return new Response(JSON.stringify(responseData), { status: 200 });
}

// Handle adding recruiter
async function handleAddRecruiter(data, users) {
    const { companyId, recruiter } = data;

    console.log('👥 Add recruiter attempt for company:', companyId);

    if (!companyId || !recruiter) {
        return new Response(
            JSON.stringify({ error: "Company ID and recruiter data required" }),
            { status: 400 }
        );
    }

    // Check if company exists
    const company = await users.findOne({
        _id: new ObjectId(companyId),
        role: "company"
    });

    if (!company) {
        return new Response(
            JSON.stringify({ error: "Company not found" }),
            { status: 404 }
        );
    }

    // Validate recruiter data
    if (!recruiter.name || !recruiter.email || !recruiter.password) {
        return new Response(
            JSON.stringify({ error: "Recruiter name, email, and password are required" }),
            { status: 400 }
        );
    }

    // Check if recruiter email already exists in this company
    const existingRecruiter = company.recruiters?.find(
        rec => rec.email?.toLowerCase() === recruiter.email.toLowerCase()
    );

    if (existingRecruiter) {
        return new Response(
            JSON.stringify({ error: "Recruiter with this email already exists in your company" }),
            { status: 409 }
        );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(recruiter.password, 10);

    // Generate recruiter ID
    const generateRecruiterId = () => {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `recruiter-${timestamp}-${random}`;
    };

    // Prepare recruiter data
    const recruiterData = {
        _id: new ObjectId(),
        id: recruiter.id || generateRecruiterId(),
        name: recruiter.name,
        email: recruiter.email.toLowerCase(),
        password: hashedPassword,
        role: "recruiter",
        department: recruiter.department || "general",
        phone: recruiter.phone || "",
        permissions: recruiter.permissions || {
            canPostJobs: true,
            canViewApplications: true,
            canManageJobs: false,
            canManageRecruiters: false
        },
        addedDate: new Date(),
        lastUpdated: new Date(),
        updatedAt: new Date(),
        isActive: true,
        createdBy: companyId,
        joinDate: recruiter.joinDate || new Date().toISOString().split('T')[0]
    };

    // Update company with new recruiter
    const result = await users.updateOne(
        { _id: new ObjectId(companyId) },
        {
            $push: {
                recruiters: recruiterData
            },
            $set: {
                updatedAt: new Date()
            }
        }
    );

    if (result.modifiedCount === 0) {
        return new Response(
            JSON.stringify({ error: "Failed to add recruiter" }),
            { status: 500 }
        );
    }

    console.log('✅ Recruiter added successfully:', recruiterData.email);

    return new Response(
        JSON.stringify({
            success: true,
            message: "Recruiter added successfully",
            recruiter: {
                id: recruiterData.id,
                name: recruiterData.name,
                email: recruiterData.email,
                department: recruiterData.department,
                permissions: recruiterData.permissions
            }
        }),
        { status: 201 }
    );
}

// Helper function to handle recruiter login
async function handleRecruiterLogin(recruiter, company, password) {
    try {
        console.log('🔑 Recruiter password check for:', recruiter.email);
        console.log('📝 Recruiter data:', {
            email: recruiter.email,
            hasPassword: !!recruiter.password,
            passwordLength: recruiter.password?.length,
            passwordPreview: recruiter.password?.substring(0, 20) + '...'
        });

        // Check if recruiter has a password
        if (!recruiter.password) {
            console.log('❌ Recruiter has no password set');
            return null;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, recruiter.password);
        console.log('🔑 Password comparison result:', isValidPassword);

        if (!isValidPassword) {
            console.log('❌ Recruiter password incorrect');
            return null;
        }

        // Prepare user data
        return {
            _id: recruiter._id || recruiter.id || new ObjectId(),
            name: recruiter.name,
            email: recruiter.email,
            phone: recruiter.phone || recruiter.mobile,
            isRecruiter: true,
            companyId: company._id,
            companyName: company.name,
            companyProfileImage: company.profileImage,
            mainUserRole: company.role,
            permissions: recruiter.permissions || getDefaultRecruiterPermissions(),
            isActive: recruiter.isActive !== false
        };
    } catch (error) {
        console.error('❌ Error in handleRecruiterLogin:', error);
        return null;
    }
}

// Helper function to handle regular user login
async function handleRegularUserLogin(regularUser, password) {
    try {
        console.log('🔑 Regular user password check for:', regularUser.email);

        if (!regularUser.password) {
            console.log('❌ User has no password set');
            return null;
        }

        const isValidPassword = await bcrypt.compare(password, regularUser.password);
        console.log('🔑 Password comparison result:', isValidPassword);

        if (!isValidPassword) {
            console.log('❌ User password incorrect');
            return null;
        }

        return {
            ...regularUser,
            isRecruiter: false
        };
    } catch (error) {
        console.error('❌ Error in handleRegularUserLogin:', error);
        return null;
    }
}

// Helper function for default recruiter permissions
function getDefaultRecruiterPermissions() {
    return {
        canPostJobs: true,
        canViewApplications: true,
        canManageJobs: false,
        canManageRecruiters: false,
        canEditCompanyProfile: false
    };
}

// Helper function to prepare response data
function prepareResponseData(userData, token) {
    const baseUser = {
        _id: userData._id || userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.isRecruiter ? "recruiter" : userData.role,
        mobile: userData.mobile || userData.phone || "",
        isActive: userData.isActive !== false
    };

    if (userData.isRecruiter) {
        baseUser.companyId = userData.companyId;
        baseUser.companyName = userData.companyName;
        baseUser.companyProfileImage = userData.companyProfileImage;
        baseUser.permissions = userData.permissions;
        baseUser.isRecruiter = true;
        baseUser.mainUserRole = userData.mainUserRole;
        baseUser.recruiterId = userData._id || userData.id;
    }

    return {
        success: true,
        user: baseUser,
        token: token
    };
}

// Helper function to generate auth token (unchanged)
function generateAuthToken(userData) {
    const tokenData = {
        id: userData._id || userData.id,
        email: userData.email,
        role: userData.isRecruiter ? "recruiter" : userData.role,
        isRecruiter: userData.isRecruiter || false,
        timestamp: Date.now(),
        ...(userData.isRecruiter && {
            companyId: userData.companyId,
            permissions: userData.permissions
        })
    };

    return Buffer.from(JSON.stringify(tokenData)).toString('base64');
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