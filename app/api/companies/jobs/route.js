// app/api/company/jobs/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/components/lib/db';
import Joi from 'joi';
import { ObjectId } from 'mongodb';

/* -------------------- JOI SCHEMAS -------------------- */
const jobSchema = Joi.object({
    companyId: Joi.string().required(),
    jobTitle: Joi.string().min(3).max(100).required(),
    jobDescription: Joi.string().min(5).max(10000).required(),
    employmentTypes: Joi.array().items(Joi.string().valid('full-time', 'part-time')).min(1).required(),
    workingSchedule: Joi.object({
        dayShift: Joi.boolean().default(false),
        nightShift: Joi.boolean().default(false),
        weekendAvailability: Joi.boolean().default(false),
        custom: Joi.string().allow('').optional()
    }).required(),
    salaryType: Joi.string().valid('fixed', 'commission', 'hybrid').default('fixed'),
    salaryAmount: Joi.string().allow('').optional(),
    salaryFrequency: Joi.string().valid('Monthly', 'Yearly', 'Commission Based', 'Performance Based').default('Monthly'),
    salaryNegotiable: Joi.boolean().default(false),
    salaryRange: Joi.string().required(),
    skills: Joi.string().optional(),
    location: Joi.string().min(2).max(100).required(),
    experience: Joi.string().required(),
    categorySlug: Joi.string().valid(
        'channel-partners', 'hr-and-operations', 'real-estate-sales',
        'tele-caller', 'digital-marketing', 'web-development',
        'crm-executive', 'accounts-and-auditing', 'architects', 'legal'
    ).required(),

    // Common fields for all categories
    qualification: Joi.string().allow('').optional(),
    additionalBenefits: Joi.array().items(Joi.string()).default([]),

    // Real Estate Sales specific
    jobRoleType: Joi.string().valid(
        'field-sales', 'inside-sales', 'senior-sales', 'team-lead',
        'relationship-manager', 'inbound', 'outbound', 'customer-service',
        'lead-generation', 'follow-up', ''
    ).allow('').optional(),
    commissionStructure: Joi.string().allow('').optional(),
    salesTargetAmount: Joi.string().allow('').optional(),
    commissionPercentage: Joi.string().allow('').optional(),

    // Digital Marketing specific
    specialization: Joi.string().valid(
        'seo', 'social-media', 'content-marketing', 'email-marketing',
        'ppc', 'real-estate-marketing', ''
    ).allow('').optional(),
    tools: Joi.string().allow('').optional(),

    // Web Development specific
    techStack: Joi.string().valid(
        'react', 'angular', 'vue', 'node', 'php', 'wordpress',
        'python', 'java', ''
    ).allow('').optional(),
    workMode: Joi.string().valid('remote', 'hybrid', 'onsite', '').allow('').optional(),

    // Accounts specific
    accountsQualification: Joi.string().valid(
        'ca', 'cma', 'mcom', 'bcom', 'mba-finance', 'inter-ca', ''
    ).allow('').optional(),
    accountingSoftware: Joi.string().valid(
        'tally', 'sap', 'quickbooks', 'zoho', 'busy', 'microsoft-dynamics', ''
    ).allow('').optional(),

    // Architects specific
    architectureType: Joi.string().valid(
        'residential', 'commercial', 'interior', 'landscape', 'urban', ''
    ).allow('').optional(),
    designSoftware: Joi.string().valid(
        'autocad', 'revit', 'sketchup', '3ds-max', 'lumion', 'v-ray', 'photoshop', ''
    ).allow('').optional(),

    // Legal specific
    legalSpecialization: Joi.string().valid(
        'real-estate-law', 'corporate-law', 'property-law', 'contract-law',
        'compliance', 'due-diligence', 'litigation', ''
    ).allow('').optional(),
    legalQualification: Joi.string().valid(
        'llb', 'llm', 'cs', 'ca', 'mba-law', ''
    ).allow('').optional(),

    // Channel Partners specific
    partnerType: Joi.string().valid(
        'individual-broker', 'brokerage-firm', 'property-consultant',
        'real-estate-agent', 'corporate-partner', ''
    ).allow('').optional(),
    partnerCommission: Joi.string().valid(
        '1-2%', '2-3%', '3-5%', '5-7%', 'negotiable', ''
    ).allow('').optional(),

    // HR specific
    hrSpecialization: Joi.string().valid(
        'recruitment', 'operations', 'payroll', 'employee-relations',
        'training', 'hr-business-partner', ''
    ).allow('').optional(),
    hrQualification: Joi.string().valid(
        'mba-hr', 'msw', 'mhrdm', 'bachelors-hr', 'diploma-hr', ''
    ).allow('').optional(),

    // CRM specific
    crmSoftware: Joi.string().valid(
        'salesforce', 'zoho-crm', 'hubspot', 'dynamics-crm', 'sugar-crm', 'freshworks', ''
    ).allow('').optional(),
    customerSegment: Joi.string().valid(
        'nri', 'investors', 'end-users', 'channel-partners', 'corporate', 'all', ''
    ).allow('').optional(),

    // Real Estate common fields
    incentives: Joi.string().allow('').optional(),
    propertyTypes: Joi.array().items(
        Joi.string().valid(
            'residential', 'commercial', 'industrial', 'plots',
            'luxury', 'affordable', 'villas', 'apartments',
            'farmhouses', 'redevelopment'
        )
    ).default([]),
    targetAreas: Joi.string().allow('').optional(),
    languageRequirements: Joi.array().items(
        Joi.string().valid(
            'english', 'hindi', 'telugu', 'tamil', 'kannada',
            'malayalam', 'marathi', 'bengali', 'gujarati', 'punjabi'
        )
    ).default([]),
    vehicleRequirement: Joi.boolean().default(false),
    targetAudience: Joi.string().allow('').optional(),
    salesTargets: Joi.string().allow('').optional(),
    leadProvided: Joi.boolean().default(false),
    trainingProvided: Joi.boolean().default(false),
    certificationRequired: Joi.boolean().default(false),
    hiringMultiple: Joi.boolean().default(false),

    // System fields
    status: Joi.string().valid('active', 'inactive', 'closed', 'draft').default('active'),
    postedBy: Joi.string().required(),
    postedByRole: Joi.string().valid('company', 'superadmin', 'recruiter').required(),
    companyName: Joi.string().required(),
    applications: Joi.array().default([]),
    views: Joi.number().default(0)
});

const jobUpdateSchema = Joi.object({
    id: Joi.string().required(),
    companyId: Joi.string().required(),
}).unknown(true);

/* -------------------- POST (CREATE JOB) -------------------- */
export async function POST(req) {
    try {
        const body = await req.json();

        // Add category-specific validation
        let categoryValidation = {};

        // Validate based on category
        switch (body.categorySlug) {
            case 'tele-caller':
                categoryValidation = {
                    jobTitle: Joi.string().required(),
                    qualification: Joi.string().required(),
                    jobRoleType: Joi.string().required()
                };
                break;
            case 'real-estate-sales':
                categoryValidation = {
                    jobTitle: Joi.string().required(),
                    jobRoleType: Joi.string().required(),
                    commissionPercentage: Joi.string().required()
                };
                break;
            case 'digital-marketing':
                categoryValidation = {
                    jobTitle: Joi.string().required(),
                    specialization: Joi.string().required()
                };
                break;
            case 'web-development':
                categoryValidation = {
                    jobTitle: Joi.string().required(),
                    techStack: Joi.string().required(),
                    workMode: Joi.string().required()
                };
                break;
            case 'accounts-and-auditing':
                categoryValidation = {
                    jobTitle: Joi.string().required(),
                    accountsQualification: Joi.string().required(),
                    accountingSoftware: Joi.string().required()
                };
                break;
            case 'architects':
                categoryValidation = {
                    jobTitle: Joi.string().required(),
                    architectureType: Joi.string().required(),
                    designSoftware: Joi.string().required()
                };
                break;
            case 'legal':
                categoryValidation = {
                    jobTitle: Joi.string().required(),
                    legalSpecialization: Joi.string().required(),
                    legalQualification: Joi.string().required()
                };
                break;
            case 'channel-partners':
                categoryValidation = {
                    jobTitle: Joi.string().required(),
                    partnerType: Joi.string().required(),
                    partnerCommission: Joi.string().required()
                };
                break;
            case 'hr-and-operations':
                categoryValidation = {
                    jobTitle: Joi.string().required(),
                    hrSpecialization: Joi.string().required(),
                    hrQualification: Joi.string().required()
                };
                break;
            case 'crm-executive':
                categoryValidation = {
                    jobTitle: Joi.string().required(),
                    crmSoftware: Joi.string().required(),
                    customerSegment: Joi.string().required()
                };
                break;
            default:
                categoryValidation = {
                    jobTitle: Joi.string().required()
                };
        }

        // Merge base schema with category-specific validation
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

        // Create job object with MongoDB ObjectId
        const newJob = {
            ...value,
            _id: jobObjectId, // MongoDB ObjectId as _id
            id: jobObjectId.toString(), // Also store string representation as id for compatibility
            postedOn: new Date().toISOString(),
            createdAt: new Date(),
            updatedAt: new Date(),
            applications: [], // Initialize empty applications array
            views: 0 // Initialize views count
        };

        // Push into jobs array
        const result = await usersCollection.updateOne(
            { _id: company._id },
            {
                $push: { jobs: newJob },
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
            job: newJob
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

        // First validate the base schema
        const { error: baseError, value: baseValue } = jobUpdateSchema.validate(body);
        if (baseError) {
            return NextResponse.json({
                success: false,
                error: baseError.details[0].message
            }, { status: 400 });
        }

        const { id, companyId, ...updateData } = baseValue;

        // Add category-specific validation for update if category is being changed
        if (updateData.categorySlug) {
            let categoryValidation = {};

            // Same validation logic as POST
            switch (updateData.categorySlug) {
                case 'tele-caller':
                    if (updateData.jobTitle !== undefined) {
                        categoryValidation.jobTitle = Joi.string().required();
                    }
                    if (updateData.qualification !== undefined) {
                        categoryValidation.qualification = Joi.string().required();
                    }
                    break;
                // Add other categories as needed...
            }

            if (Object.keys(categoryValidation).length > 0) {
                const categorySchema = Joi.object(categoryValidation);
                const { error: catError } = categorySchema.validate(updateData);
                if (catError) {
                    return NextResponse.json({
                        success: false,
                        error: catError.details[0].message
                    }, { status: 400 });
                }
            }
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const usersCollection = db.collection('rej_users');

        // Convert job ID to ObjectId if it's a valid ObjectId string, otherwise use as string
        const jobIdFilter = ObjectId.isValid(id) ? new ObjectId(id) : id;

        const setFields = {};
        for (const key in updateData) {
            if (updateData[key] !== undefined) {
                setFields[`jobs.$.${key}`] = updateData[key];
            }
        }
        setFields['jobs.$.updatedAt'] = new Date();
        setFields['updatedAt'] = new Date();

        // Build the query to find the job
        const query = {
            $or: [
                { _id: new ObjectId(companyId) },
                { companyId: new ObjectId(companyId) }
            ],
            $or: [
                { 'jobs._id': jobIdFilter },
                { 'jobs.id': id }
            ]
        };

        const result = await usersCollection.updateOne(
            query,
            { $set: setFields }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                error: 'Job not found or update failed'
            }, { status: 404 });
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

        return NextResponse.json({
            success: true,
            message: 'Job updated successfully',
            job: updatedJob
        });

    } catch (err) {
        console.error('❌ PUT Job Error:', err);
        return NextResponse.json({
            success: false,
            error: err.message
        }, { status: 500 });
    }
}