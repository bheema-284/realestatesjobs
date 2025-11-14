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
    salary: Joi.string().required(),
    location: Joi.string().min(2).max(100).required(),
    experience: Joi.string().valid(
        'Fresher', '6 Months', '1 Year', '2 Years', '3 Years',
        '4 Years', '5 Years', '6-8 Years', '8-10 Years', '10+ Years'
    ).required(),
    categorySlug: Joi.string().valid(
        'channel-partners', 'hr-and-operations', 'real-estate-sales',
        'tele-caller', 'digital-marketing', 'web-development',
        'crm-executive', 'accounts-and-auditing', 'architects', 'legal'
    ).required(),
    jobRoleType: Joi.string().valid('field-sales', 'office-based', 'hybrid', 'site-based', 'channel-sales', '').optional(),
    commissionStructure: Joi.string().allow('').optional(),
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
    targetAudience: Joi.string().valid('nri', 'local', 'corporate', 'investors', 'end-users', 'channel-partners', 'brokers', 'all', '').optional(),
    salesTargets: Joi.string().allow('').optional(),
    leadProvided: Joi.boolean().default(false),
    trainingProvided: Joi.boolean().default(false),
    certificationRequired: Joi.boolean().default(false),
    hiringMultiple: Joi.boolean().default(false),
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

/* -------------------- GET (FETCH JOBS) -------------------- */
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const usersCollection = db.collection('rej_users');

        // Extract query parameters
        const companyId = searchParams.get('companyId');
        const jobId = searchParams.get('jobId');
        const category = searchParams.get('category');
        const location = searchParams.get('location');
        const employmentType = searchParams.get('employmentType');
        const experience = searchParams.get('experience');
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit')) || 50;
        const page = parseInt(searchParams.get('page')) || 1;
        const skip = (page - 1) * limit;

        // 🔹 CASE 1: Get specific job by ID
        if (jobId) {
            const company = await usersCollection.findOne({
                'jobs.id': jobId
            });

            if (!company) {
                return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
            }

            const job = company.jobs.find(j => j.id === jobId);
            if (!job) {
                return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
            }

            // Increment views
            await usersCollection.updateOne(
                { _id: company._id, 'jobs.id': jobId },
                { $inc: { 'jobs.$.views': 1 } }
            );

            return NextResponse.json({
                success: true,
                job: {
                    ...job,
                    companyDetails: {
                        _id: company._id,
                        name: company.name,
                        email: company.email,
                        profileImage: company.profileImage,
                        location: company.location,
                        summary: company.summary
                    }
                }
            });
        }

        // 🔹 CASE 2: Get jobs for specific company
        if (companyId) {
            let company;
            try {
                company = await usersCollection.findOne({
                    $or: [
                        { _id: new ObjectId(companyId) },
                        { companyId: new ObjectId(companyId) }
                    ],
                    role: 'company'
                });
            } catch (err) {
                return NextResponse.json({ success: false, error: 'Invalid company ID format' }, { status: 400 });
            }

            if (!company) {
                return NextResponse.json({ success: false, error: 'Company not found' }, { status: 404 });
            }

            let jobs = company.jobs || [];

            // Apply filters for company-specific jobs
            if (category) {
                jobs = jobs.filter(job => job.categorySlug === category);
            }
            if (location) {
                jobs = jobs.filter(job =>
                    job.location.toLowerCase().includes(location.toLowerCase())
                );
            }
            if (employmentType) {
                jobs = jobs.filter(job =>
                    job.employmentTypes.includes(employmentType)
                );
            }
            if (experience) {
                jobs = jobs.filter(job => job.experience === experience);
            }
            if (status) {
                jobs = jobs.filter(job => job.status === status);
            }
            if (search) {
                const searchLower = search.toLowerCase();
                jobs = jobs.filter(job =>
                    job.jobTitle.toLowerCase().includes(searchLower) ||
                    job.jobDescription.toLowerCase().includes(searchLower) ||
                    job.location.toLowerCase().includes(searchLower)
                );
            }

            // Sort by creation date (newest first)
            jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Pagination
            const totalJobs = jobs.length;
            const paginatedJobs = jobs.slice(skip, skip + limit);

            return NextResponse.json({
                success: true,
                jobs: paginatedJobs,
                pagination: {
                    total: totalJobs,
                    page,
                    limit,
                    totalPages: Math.ceil(totalJobs / limit)
                },
                company: {
                    _id: company._id,
                    name: company.name,
                    profileImage: company.profileImage
                }
            });
        }

        // 🔹 CASE 3: Get all jobs from all companies (with filters)
        const allCompanies = await usersCollection.find({
            role: 'company',
            jobs: { $exists: true, $ne: [] }
        }).toArray();

        let allJobs = [];

        // Extract and flatten all jobs with company information
        allCompanies.forEach(company => {
            const companyJobs = (company.jobs || []).map(job => ({
                ...job,
                companyDetails: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    profileImage: company.profileImage,
                    location: company.location,
                    summary: company.summary,
                    website: company.website,
                    established: company.established,
                    teamSize: company.teamSize
                }
            }));
            allJobs = allJobs.concat(companyJobs);
        });

        // Apply filters to all jobs
        if (category) {
            allJobs = allJobs.filter(job => job.categorySlug === category);
        }
        if (location) {
            allJobs = allJobs.filter(job =>
                job.location.toLowerCase().includes(location.toLowerCase())
            );
        }
        if (employmentType) {
            allJobs = allJobs.filter(job =>
                job.employmentTypes.includes(employmentType)
            );
        }
        if (experience) {
            allJobs = allJobs.filter(job => job.experience === experience);
        }
        if (status) {
            allJobs = allJobs.filter(job => job.status === status);
        }
        if (search) {
            const searchLower = search.toLowerCase();
            allJobs = allJobs.filter(job =>
                job.jobTitle.toLowerCase().includes(searchLower) ||
                job.jobDescription.toLowerCase().includes(searchLower) ||
                job.location.toLowerCase().includes(searchLower) ||
                job.companyDetails.name.toLowerCase().includes(searchLower)
            );
        }

        // Sort by creation date (newest first)
        allJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Pagination
        const totalJobs = allJobs.length;
        const paginatedJobs = allJobs.slice(skip, skip + limit);

        // Get unique categories, locations, etc. for filters
        const uniqueCategories = [...new Set(allJobs.map(job => job.categorySlug))];
        const uniqueLocations = [...new Set(allJobs.map(job => job.location))];
        const uniqueExperiences = [...new Set(allJobs.map(job => job.experience))];

        return NextResponse.json({
            success: true,
            jobs: paginatedJobs,
            pagination: {
                total: totalJobs,
                page,
                limit,
                totalPages: Math.ceil(totalJobs / limit)
            },
            filters: {
                categories: uniqueCategories,
                locations: uniqueLocations,
                experiences: uniqueExperiences
            },
            stats: {
                totalJobs: totalJobs,
                activeJobs: allJobs.filter(job => job.status === 'active').length,
                companies: allCompanies.length
            }
        });

    } catch (err) {
        console.error('❌ GET Jobs Error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

/* -------------------- POST (CREATE JOB) -------------------- */
export async function POST(req) {
    try {
        const body = await req.json();
        const { error, value } = jobSchema.validate(body);
        if (error) {
            return NextResponse.json({ success: false, error: error.details[0].message }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const usersCollection = db.collection('rej_users');

        // Ensure company exists
        const company = await usersCollection.findOne({
            $or: [
                { _id: new ObjectId(value.companyId) },
                { companyId: new ObjectId(value.companyId) }
            ],
            role: 'company'
        });

        if (!company) {
            return NextResponse.json({ success: false, error: 'Company not found or invalid role' }, { status: 404 });
        }

        // Create job object
        const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const newJob = {
            ...value,
            id: jobId,
            postedOn: new Date().toISOString(),
            createdAt: new Date(),
            updatedAt: new Date()
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
            return NextResponse.json({ success: false, error: 'Job creation failed' }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: 'Job created successfully', job: newJob }, { status: 200 });

    } catch (err) {
        console.error('❌ POST Job Error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

/* -------------------- PUT (UPDATE JOB) -------------------- */
export async function PUT(req) {
    try {
        const body = await req.json();
        const { error, value } = jobUpdateSchema.validate(body);
        if (error) {
            return NextResponse.json({ success: false, error: error.details[0].message }, { status: 400 });
        }

        const { id, companyId, ...updateData } = value;

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const usersCollection = db.collection('rej_users');

        const setFields = {};
        for (const key in updateData) {
            setFields[`jobs.$.${key}`] = updateData[key];
        }
        setFields['jobs.$.updatedAt'] = new Date();
        setFields['updatedAt'] = new Date();

        const result = await usersCollection.updateOne(
            {
                $or: [
                    { _id: new ObjectId(companyId) },
                    { companyId: new ObjectId(companyId) }
                ],
                'jobs.id': id
            },
            { $set: setFields }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ success: false, error: 'Job not found or update failed' }, { status: 404 });
        }

        const company = await usersCollection.findOne(
            {
                $or: [
                    { _id: new ObjectId(companyId) },
                    { companyId: new ObjectId(companyId) }
                ]
            },
            { projection: { jobs: 1 } }
        );

        const updatedJob = company.jobs.find(job => job.id === id);
        return NextResponse.json({ success: true, message: 'Job updated successfully', job: updatedJob });

    } catch (err) {
        console.error('❌ PUT Job Error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

/* -------------------- DELETE (REMOVE JOB) -------------------- */
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const jobId = searchParams.get('jobId');
        const companyId = searchParams.get('companyId');

        if (!companyId || !jobId) {
            return NextResponse.json({ success: false, error: 'Missing companyId or jobId' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DBNAME);
        const usersCollection = db.collection('rej_users');

        const result = await usersCollection.updateOne(
            {
                $or: [
                    { _id: new ObjectId(companyId) },
                    { companyId: new ObjectId(companyId) }
                ]
            },
            {
                $pull: { jobs: { id: jobId } },
                $set: { updatedAt: new Date() }
            }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ success: false, error: 'Job not found or delete failed' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Job deleted successfully',
            deletedJobId: jobId
        });

    } catch (err) {
        console.error('❌ DELETE Job Error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}