// app/api/company/jobs/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/components/lib/db';
import Joi from 'joi';
import { ObjectId } from 'mongodb';

/* -------------------- JOI SCHEMAS -------------------- */
const jobSchema = Joi.object({
    // Job basic info (from frontend)
    jobTitle: Joi.string().min(3).max(100).required(),
    categorySlug: Joi.string().valid(
        'channel-partners', 'hr-and-operations', 'real-estate-sales',
        'tele-caller', 'digital-marketing', 'web-development',
        'crm-executive', 'accounts-and-auditing', 'architects', 'legal'
    ).required(),

    // Common fields from frontend
    location: Joi.string().min(2).max(100).required(),
    salary: Joi.string().min(2).max(100).required(),
    jobRoleType: Joi.string().required(),
    employmentTypes: Joi.array().items(Joi.string().valid('full-time', 'part-time')).min(1).required(),
    qualification: Joi.array().items(Joi.string()).default([]),
    experience: Joi.string().required(),
    skills: Joi.array().items(Joi.string()).default([]),
    languageRequirements: Joi.array().items(Joi.string().valid(
        'english', 'hindi', 'telugu', 'tamil', 'kannada',
        'malayalam', 'marathi', 'bengali', 'gujarati', 'punjabi',
        'odia', 'urdu', 'sanskrit', 'assamese', 'maithili',
        'kashmiri', 'sindhi', 'konkani', 'nepali', 'manipuri',
        'bodo', 'dogri'
    )).default([]),
    propertyTypes: Joi.array().items(Joi.string().valid(
        'residential', 'commercial', 'industrial', 'plots',
        'luxury', 'affordable'
    )).default([]),
    jobDescription: Joi.string().min(5).max(10000).required(),

    // Tele Caller specific
    commissionPercentage: Joi.string().allow('').optional(),
    incentives: Joi.string().allow('').optional(),
    salesTargets: Joi.string().allow('').optional(),
    additionalBenefits: Joi.array().items(Joi.string()).default([]),

    // Real Estate Sales specific
    salesTargetAmount: Joi.string().allow('').optional(),
    targetAreas: Joi.string().allow('').optional(),
    leadProvided: Joi.boolean().default(false),
    trainingProvided: Joi.boolean().default(false),
    vehicleRequirement: Joi.boolean().default(false),

    // Digital Marketing specific
    specialization: Joi.string().allow('').optional(),
    tools: Joi.string().allow('').optional(),
    workMode: Joi.string().allow('').optional(),

    // Web Development specific
    techStack: Joi.string().allow('').optional(),
    projectType: Joi.string().allow('').optional(),

    // Accounts & Auditing specific
    accountsQualification: Joi.string().allow('').optional(),
    accountingSoftware: Joi.string().allow('').optional(),
    industryExperience: Joi.array().items(Joi.string()).default([]),

    // Architects specific
    architectureType: Joi.string().allow('').optional(),
    designSoftware: Joi.string().allow('').optional(),
    projectScale: Joi.string().allow('').optional(),
    portfolioRequired: Joi.boolean().default(false),

    // Legal specific
    legalSpecialization: Joi.string().allow('').optional(),
    legalQualification: Joi.string().allow('').optional(),
    caseTypes: Joi.array().items(Joi.string()).default([]),

    // Channel Partners specific
    partnerType: Joi.string().allow('').optional(),
    partnerCommission: Joi.string().allow('').optional(),
    networkSize: Joi.string().allow('').optional(),
    exclusivePartnership: Joi.boolean().default(false),

    // HR & Operations specific
    hrSpecialization: Joi.string().allow('').optional(),
    hrQualification: Joi.string().allow('').optional(),
    industryKnowledge: Joi.array().items(Joi.string()).default([]),

    // CRM Executive specific
    crmSoftware: Joi.string().allow('').optional(),
    customerSegment: Joi.string().allow('').optional(),
    dataManagement: Joi.boolean().default(false),
    clientRetention: Joi.boolean().default(false),

    // System fields (mapped from frontend)
    salaryType: Joi.string().valid('fixed', 'commission', 'hybrid').default('fixed'),
    salaryFrequency: Joi.string().valid('Monthly', 'Yearly', 'Commission Based', 'Performance Based').default('Monthly'),
    salaryNegotiable: Joi.boolean().default(false),
    hiringMultiple: Joi.boolean().default(false),
    workingSchedule: Joi.object({
        dayShift: Joi.boolean().default(false),
        nightShift: Joi.boolean().default(false),
        weekendAvailability: Joi.boolean().default(false),
        custom: Joi.string().allow('').optional()
    }).default({
        dayShift: false,
        nightShift: false,
        weekendAvailability: false,
        custom: ''
    }),

    // Company/User info from frontend
    companyId: Joi.string().required(),
    postedBy: Joi.string().required(),
    postedByRole: Joi.string().valid('company', 'superadmin', 'recruiter').required(),
    companyName: Joi.string().required(),

    // System fields
    status: Joi.string().valid('active', 'inactive', 'closed', 'draft').default('active'),
    applications: Joi.array().default([]),
    views: Joi.number().default(0)
});

const jobUpdateSchema = Joi.object({
    id: Joi.string().required(),
    companyId: Joi.string().required(),
}).unknown(true);

/* -------------------- CATEGORY-SPECIFIC VALIDATION -------------------- */
const getCategoryValidation = (categorySlug) => {
    const baseValidation = {
        jobTitle: Joi.string().required(),
        location: Joi.string().required(),
        salary: Joi.string().required(),
        experience: Joi.string().required(),
        jobDescription: Joi.string().required()
    };

    switch (categorySlug) {
        case 'tele-caller':
            return {
                ...baseValidation,
                commissionPercentage: Joi.string().required()
            };
        case 'real-estate-sales':
            return {
                ...baseValidation,
                commissionPercentage: Joi.string().required(),
                jobRoleType: Joi.string().required()
            };
        case 'digital-marketing':
            return {
                ...baseValidation,
                specialization: Joi.string().required()
            };
        case 'web-development':
            return {
                ...baseValidation,
                techStack: Joi.string().required(),
                workMode: Joi.string().required()
            };
        case 'accounts-and-auditing':
            return {
                ...baseValidation,
                accountsQualification: Joi.string().required(),
                accountingSoftware: Joi.string().required()
            };
        case 'architects':
            return {
                ...baseValidation,
                architectureType: Joi.string().required(),
                designSoftware: Joi.string().required()
            };
        case 'legal':
            return {
                ...baseValidation,
                legalSpecialization: Joi.string().required(),
                legalQualification: Joi.string().required()
            };
        case 'channel-partners':
            return {
                ...baseValidation,
                partnerType: Joi.string().required(),
                partnerCommission: Joi.string().required()
            };
        case 'hr-and-operations':
            return {
                ...baseValidation,
                hrSpecialization: Joi.string().required(),
                hrQualification: Joi.string().required()
            };
        case 'crm-executive':
            return {
                ...baseValidation,
                crmSoftware: Joi.string().required(),
                customerSegment: Joi.string().required()
            };
        default:
            return baseValidation;
    }
};

/* -------------------- POST (CREATE JOB) -------------------- */
export async function POST(req) {
    try {
        const body = await req.json();

        // Validate based on category
        const categoryValidation = getCategoryValidation(body.categorySlug);
        const categorySchema = jobSchema.append(categoryValidation);

        const { error, value } = categorySchema.validate(body);
        if (error) {
            console.error('Validation Error:', error.details);
            return NextResponse.json({
                success: false,
                error: error.details[0].message,
                details: error.details
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const usersCollection = db.collection('rej_users');

        // Ensure company exists
        let company;
        try {
            company = await usersCollection.findOne({
                $or: [
                    { _id: new ObjectId(value.companyId) },
                    { companyId: new ObjectId(value.companyId) }
                ],
                role: 'company'
            });
        } catch (err) {
            console.error('Company lookup error:', err);
            return NextResponse.json({
                success: false,
                error: 'Invalid company ID format'
            }, { status: 400 });
        }

        if (!company) {
            return NextResponse.json({
                success: false,
                error: 'Company not found or invalid role'
            }, { status: 404 });
        }

        // Create MongoDB ObjectId for the job
        const jobObjectId = new ObjectId();

        // Map frontend fields to backend structure
        const jobData = {
            // Basic info
            jobTitle: value.jobTitle,
            categorySlug: value.categorySlug,

            // Common fields
            location: value.location,
            experience: value.experience,
            qualification: value.qualification || [],
            skills: value.skills || [],
            languageRequirements: value.languageRequirements || [],
            propertyTypes: value.propertyTypes || [],
            jobDescription: value.jobDescription,

            // Salary mapping (from frontend salary field)
            salaryType: value.salaryType || 'fixed',
            salaryAmount: value.salary || '', // Map from frontend's salary field
            salaryFrequency: value.salaryFrequency || 'Monthly',
            salaryNegotiable: value.salaryNegotiable || false,
            salaryRange: value.salary || '', // Use salary as range for display

            // Employment info
            employmentTypes: value.employmentTypes,
            jobRoleType: value.jobRoleType,

            // Category-specific fields
            commissionPercentage: value.commissionPercentage || '',
            incentives: value.incentives || '',
            salesTargets: value.salesTargets || '',
            additionalBenefits: value.additionalBenefits || [],
            salesTargetAmount: value.salesTargetAmount || '',
            targetAreas: value.targetAreas || '',
            leadProvided: value.leadProvided || false,
            trainingProvided: value.trainingProvided || false,
            vehicleRequirement: value.vehicleRequirement || false,
            specialization: value.specialization || '',
            tools: value.tools || '',
            workMode: value.workMode || '',
            techStack: value.techStack || '',
            projectType: value.projectType || '',
            accountsQualification: value.accountsQualification || '',
            accountingSoftware: value.accountingSoftware || '',
            industryExperience: value.industryExperience || [],
            architectureType: value.architectureType || '',
            designSoftware: value.designSoftware || '',
            projectScale: value.projectScale || '',
            portfolioRequired: value.portfolioRequired || false,
            legalSpecialization: value.legalSpecialization || '',
            legalQualification: value.legalQualification || '',
            caseTypes: value.caseTypes || [],
            partnerType: value.partnerType || '',
            partnerCommission: value.partnerCommission || '',
            networkSize: value.networkSize || '',
            exclusivePartnership: value.exclusivePartnership || false,
            hrSpecialization: value.hrSpecialization || '',
            hrQualification: value.hrQualification || '',
            industryKnowledge: value.industryKnowledge || [],
            crmSoftware: value.crmSoftware || '',
            customerSegment: value.customerSegment || '',
            dataManagement: value.dataManagement || false,
            clientRetention: value.clientRetention || false,

            // Working schedule
            workingSchedule: value.workingSchedule || {
                dayShift: false,
                nightShift: false,
                weekendAvailability: false,
                custom: ''
            },

            // System fields
            companyId: value.companyId,
            postedBy: value.postedBy,
            postedByRole: value.postedByRole,
            companyName: value.companyName,
            status: value.status || 'active',
            hiringMultiple: value.hiringMultiple || false,

            // Timestamps and IDs
            _id: jobObjectId,
            id: jobObjectId.toString(),
            postedOn: new Date().toISOString(),
            createdAt: new Date(),
            updatedAt: new Date(),
            applications: [],
            views: 0
        };

        // Push into jobs array
        const result = await usersCollection.updateOne(
            { _id: company._id },
            {
                $push: { jobs: jobData },
                $set: { updatedAt: new Date() }
            }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                error: 'Job creation failed'
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: 'Job created successfully',
            job: jobData
        }, { status: 200 });

    } catch (err) {
        console.error('❌ POST Job Error:', err);
        return NextResponse.json({
            success: false,
            error: err.message
        }, { status: 500 });
    }
}

/* -------------------- PUT (UPDATE JOB) -------------------- */
export async function PUT(req) {
    try {
        const body = await req.json();

        // First validate the required fields
        if (!body.id || !body.companyId) {
            return NextResponse.json({
                success: false,
                error: 'Job ID and Company ID are required'
            }, { status: 400 });
        }

        const { id, companyId, ...updateData } = body;

        // Create an update schema that allows all job fields but requires id and companyId
        const jobUpdateSchema = Joi.object({
            // Required for update
            id: Joi.string().required(),
            companyId: Joi.string().required(),

            // Job basic info
            jobTitle: Joi.string().min(3).max(100),
            categorySlug: Joi.string().valid(
                'channel-partners', 'hr-and-operations', 'real-estate-sales',
                'tele-caller', 'digital-marketing', 'web-development',
                'crm-executive', 'accounts-and-auditing', 'architects', 'legal'
            ),

            // Common fields
            location: Joi.string().min(2).max(100),
            salary: Joi.string().min(2).max(100),
            jobRoleType: Joi.string(),
            employmentTypes: Joi.array().items(Joi.string().valid('full-time', 'part-time')).min(1),
            qualification: Joi.array().items(Joi.string()).default([]),
            experience: Joi.string(),
            skills: Joi.array().items(Joi.string()).default([]),
            languageRequirements: Joi.array().items(Joi.string().valid(
                'english', 'hindi', 'telugu', 'tamil', 'kannada',
                'malayalam', 'marathi', 'bengali', 'gujarati', 'punjabi',
                'odia', 'urdu', 'sanskrit', 'assamese', 'maithili',
                'kashmiri', 'sindhi', 'konkani', 'nepali', 'manipuri',
                'bodo', 'dogri'
            )).default([]),
            propertyTypes: Joi.array().items(Joi.string().valid(
                'residential', 'commercial', 'industrial', 'plots',
                'luxury', 'affordable'
            )).default([]),
            jobDescription: Joi.string().min(5).max(10000),

            // Tele Caller specific
            commissionPercentage: Joi.string().allow(''),
            incentives: Joi.string().allow(''),
            salesTargets: Joi.string().allow(''),
            additionalBenefits: Joi.array().items(Joi.string()).default([]),

            // Real Estate Sales specific
            salesTargetAmount: Joi.string().allow(''),
            targetAreas: Joi.string().allow(''),
            leadProvided: Joi.boolean(),
            trainingProvided: Joi.boolean(),
            vehicleRequirement: Joi.boolean(),

            // Digital Marketing specific
            specialization: Joi.string().allow(''),
            tools: Joi.string().allow(''),
            workMode: Joi.string().allow(''),

            // Web Development specific
            techStack: Joi.string().allow(''),
            projectType: Joi.string().allow(''),

            // Accounts & Auditing specific
            accountsQualification: Joi.string().allow(''),
            accountingSoftware: Joi.string().allow(''),
            industryExperience: Joi.array().items(Joi.string()).default([]),

            // Architects specific
            architectureType: Joi.string().allow(''),
            designSoftware: Joi.string().allow(''),
            projectScale: Joi.string().allow(''),
            portfolioRequired: Joi.boolean(),

            // Legal specific
            legalSpecialization: Joi.string().allow(''),
            legalQualification: Joi.string().allow(''),
            caseTypes: Joi.array().items(Joi.string()).default([]),

            // Channel Partners specific
            partnerType: Joi.string().allow(''),
            partnerCommission: Joi.string().allow(''),
            networkSize: Joi.string().allow(''),
            exclusivePartnership: Joi.boolean(),

            // HR & Operations specific
            hrSpecialization: Joi.string().allow(''),
            hrQualification: Joi.string().allow(''),
            industryKnowledge: Joi.array().items(Joi.string()).default([]),

            // CRM Executive specific
            crmSoftware: Joi.string().allow(''),
            customerSegment: Joi.string().allow(''),
            dataManagement: Joi.boolean(),
            clientRetention: Joi.boolean(),

            // System fields
            salaryType: Joi.string().valid('fixed', 'commission', 'hybrid'),
            salaryFrequency: Joi.string().valid('Monthly', 'Yearly', 'Commission Based', 'Performance Based'),
            salaryNegotiable: Joi.boolean(),
            hiringMultiple: Joi.boolean(),
            workingSchedule: Joi.object({
                dayShift: Joi.boolean(),
                nightShift: Joi.boolean(),
                weekendAvailability: Joi.boolean(),
                custom: Joi.string().allow('')
            }),

            // Company/User info
            postedBy: Joi.string(),
            postedByRole: Joi.string().valid('company', 'superadmin', 'recruiter'),
            companyName: Joi.string(),

            // System fields
            status: Joi.string().valid('active', 'inactive', 'closed', 'draft')
        });

        // Validate the entire payload
        const { error, value } = jobUpdateSchema.validate(body, { abortEarly: false });
        if (error) {
            console.error('Validation Error:', error.details);
            return NextResponse.json({
                success: false,
                error: 'Validation failed',
                details: error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                }))
            }, { status: 400 });
        }

        // Add category-specific validation if categorySlug is present in update data
        if (updateData.categorySlug) {
            const categoryValidation = getCategoryValidation(updateData.categorySlug);

            // Check required fields for the category
            for (const [field, validation] of Object.entries(categoryValidation)) {
                // Only validate if the field is required and present in updateData
                if (validation._flags?.presence === 'required' && updateData[field] === undefined) {
                    // If updating category, all required fields for that category must be present
                    const { error: catError } = validation.validate(updateData[field]);
                    if (catError) {
                        return NextResponse.json({
                            success: false,
                            error: `Field "${field}" is required for category "${updateData.categorySlug}"`
                        }, { status: 400 });
                    }
                }
            }
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const usersCollection = db.collection('rej_users');

        // Convert job ID to ObjectId if it's a valid ObjectId string, otherwise use as string
        const jobIdFilter = ObjectId.isValid(id) ? new ObjectId(id) : id;

        // Map update fields
        const setFields = {};
        for (const key in updateData) {
            if (updateData[key] !== undefined) {
                // Skip id and companyId as they're used for querying
                if (key === 'id' || key === 'companyId') continue;

                // Handle special mapping for salary
                if (key === 'salary') {
                    setFields[`jobs.$.salaryAmount`] = updateData[key];
                    setFields[`jobs.$.salaryRange`] = updateData[key];
                } else {
                    setFields[`jobs.$.${key}`] = updateData[key];
                }
            }
        }

        // Always update timestamps
        setFields['jobs.$.updatedAt'] = new Date();
        setFields['updatedAt'] = new Date();

        // Build the query to find the job
        const query = {
            $or: [
                { _id: new ObjectId(companyId) },
                { companyId: new ObjectId(companyId) }
            ],
            'jobs': {
                $elemMatch: {
                    $or: [
                        { _id: jobIdFilter },
                        { id: id }
                    ]
                }
            }
        };

        console.log('Update query:', JSON.stringify(query, null, 2));
        console.log('Update fields:', JSON.stringify(setFields, null, 2));

        const result = await usersCollection.updateOne(
            query,
            { $set: setFields }
        );

        console.log('Update result:', result);

        if (result.matchedCount === 0) {
            return NextResponse.json({
                success: false,
                error: 'Job not found'
            }, { status: 404 });
        }

        if (result.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                error: 'No changes made or update failed'
            }, { status: 400 });
        }

        // Fetch the updated job
        const company = await usersCollection.findOne(
            {
                $or: [
                    { _id: new ObjectId(companyId) },
                    { companyId: new ObjectId(companyId) }
                ]
            },
            { projection: { jobs: 1 } }
        );

        // Find the updated job
        const updatedJob = company.jobs.find(job =>
            (job._id && job._id.toString() === id) || job.id === id
        );

        if (!updatedJob) {
            return NextResponse.json({
                success: false,
                error: 'Failed to retrieve updated job'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Job updated successfully',
            job: updatedJob
        });

    } catch (err) {
        console.error('❌ PUT Job Error:', err);
        return NextResponse.json({
            success: false,
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }, { status: 500 });
    }
}

/* -------------------- GET (FETCH JOBS) -------------------- */
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const companyId = searchParams.get('companyId');
        const jobId = searchParams.get('id');
        const category = searchParams.get('category');

        if (!companyId) {
            return NextResponse.json({
                success: false,
                error: 'Company ID is required'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const usersCollection = db.collection('rej_users');

        // Find company
        const company = await usersCollection.findOne({
            $or: [
                { _id: new ObjectId(companyId) },
                { companyId: new ObjectId(companyId) }
            ]
        });

        if (!company) {
            return NextResponse.json({
                success: false,
                error: 'Company not found'
            }, { status: 404 });
        }

        let jobs = company.jobs || [];

        // Filter by job ID if provided
        if (jobId) {
            jobs = jobs.filter(job =>
                (job._id && job._id.toString() === jobId) || job.id === jobId
            );
        }

        // Filter by category if provided
        if (category) {
            jobs = jobs.filter(job => job.categorySlug === category);
        }

        return NextResponse.json({
            success: true,
            jobs: jobs,
            total: jobs.length
        });

    } catch (err) {
        console.error('❌ GET Jobs Error:', err);
        return NextResponse.json({
            success: false,
            error: err.message
        }, { status: 500 });
    }
}

/* -------------------- DELETE (REMOVE JOB) -------------------- */
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        // Accept both 'id' and 'jobId' parameters for flexibility
        const jobId = searchParams.get('id') || searchParams.get('jobId');
        const companyId = searchParams.get('companyId');

        if (!companyId || !jobId) {
            return NextResponse.json({
                success: false,
                error: 'Job ID and Company ID are required',
                receivedParams: { jobId, companyId }
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const usersCollection = db.collection('rej_users');

        // Convert job ID
        const jobIdFilter = ObjectId.isValid(jobId) ? new ObjectId(jobId) : jobId;

        // Pull job from array
        const result = await usersCollection.updateOne(
            {
                $or: [
                    { _id: new ObjectId(companyId) },
                    { companyId: new ObjectId(companyId) }
                ]
            },
            {
                $pull: {
                    jobs: {
                        $or: [
                            { _id: jobIdFilter },
                            { id: jobId }
                        ]
                    }
                },
                $set: { updatedAt: new Date() }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({
                success: false,
                error: 'Company not found'
            }, { status: 404 });
        }

        if (result.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                error: 'Job not found or delete failed'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Job deleted successfully'
        });

    } catch (err) {
        console.error('❌ DELETE Job Error:', err);
        return NextResponse.json({
            success: false,
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }, { status: 500 });
    }
}