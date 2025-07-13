// /app/profile/page.js
'use client';
import { PencilIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react';
import AboutMe from './aboutme';
import Applications from './applications';
import Projects from './projects';
import Services from './services';
import Marketing from './marketing';

const tabs = [
    { name: 'About Me', component: AboutMe },
    { name: 'My Applications', component: Applications },
    { name: 'My Projects', component: Projects },
    { name: 'My Previous Services', component: Services },
    { name: 'My Digital Marketing', component: Marketing },
];

export default function ProfilePage({ userId }) {
    const [activeTab, setActiveTab] = useState(0);
    const [profile, setProfile] = useState({ name: '', title: '', email: '', image: '', summary: '', experience: [], education: [] });
    const [editingHeader, setEditingHeader] = useState(false);
    const [tempProfile, setTempProfile] = useState(profile);

    useEffect(() => {
        const candidateData = [
            {
                id: 1,
                name: 'Emma Robin',
                location: 'Hyderabad, Madhapur',
                image: 'https://randomuser.me/api/portraits/women/75.jpg',
                title: 'Senior Developer - Hyderabad',
                email: 'emma.robin@example.com',
                summary: 'Full-stack developer with 10+ years experience building scalable web apps and leading agile teams.',
                experience: [
                    { company: 'TechMinds', location: 'Hyderabad', role: 'Senior Developer' },
                    { company: 'NextGen Solutions', location: 'Hyderabad', role: 'Software Engineer' },
                ],
                education: [
                    { degree: 'B.Tech in Computer Science', board: 'Osmania University', years: '2007 - 2011' },
                    { degree: 'M.Tech in Software Engineering', board: 'JNTU Hyderabad', years: '2011 - 2013' },
                ],
                projects: [
                    { name: 'Inventory App', description: 'Full-stack MERN project for warehouse tracking.' },
                    { name: 'Agile Task Board', description: 'Built with React and Node.js for sprint tracking.' },
                ],
                services: [
                    { name: 'Web App Development', description: 'Building secure enterprise platforms.' },
                    { name: 'Code Review', description: 'Ensuring code quality and standards.' },
                ],
                marketing: [
                    { platform: 'LinkedIn', campaign: 'Developer Hiring', performance: '2K clicks' },
                    { platform: 'YouTube', campaign: 'Product Demos', performance: '15K views' },
                ],
                applications: [
                    { jobTitle: 'Lead Developer', company: 'Infosys', status: 'Interview Scheduled' },
                    { jobTitle: 'Tech Lead', company: 'TCS', status: 'Applied' },
                ],
            },
            {
                id: 2,
                name: 'Alex Johnson',
                location: 'Mumbai, Andheri',
                image: 'https://randomuser.me/api/portraits/men/32.jpg',
                title: 'Recruitment Manager - Mumbai',
                email: 'alex.johnson@example.com',
                summary: 'Seasoned recruiter managing end-to-end hiring operations across IT & Finance domains.',
                experience: [
                    { company: 'HRSolutions', location: 'Mumbai', role: 'Recruitment Manager' },
                    { company: 'TalentBridge', location: 'Mumbai', role: 'HR Executive' },
                ],
                education: [
                    { degree: 'MBA in HR', board: 'Mumbai University', years: '2010 - 2012' },
                    { degree: 'B.Com', board: 'Mumbai University', years: '2007 - 2010' },
                ],
                projects: [
                    { name: 'HR Workflow Automation', description: 'Digitized hiring pipelines using Zoho Recruit.' },
                    { name: 'Bulk Hiring Campaign', description: 'Hired 100+ candidates in 3 months.' },
                ],
                applications: [
                    { jobTitle: 'HR Director', company: 'Capgemini', status: 'Shortlisted' },
                    { jobTitle: 'Talent Acquisition Lead', company: 'Wipro', status: 'Applied' },
                ],
                services: [
                    { name: 'Campus Hiring', description: 'Managing relations with universities for talent.' },
                    { name: 'HR Policy Setup', description: 'Developing internal HR SOPs.' },
                ],
                marketing: [
                    { platform: 'Email', campaign: 'Candidate Outreach', performance: '30% open rate' },
                    { platform: 'Instagram', campaign: 'Employer Branding', performance: '8K engagement' },
                ],

            },
            {
                id: 3,
                name: 'Priya Mehta',
                location: 'Bangalore, Koramangala',
                image: 'https://randomuser.me/api/portraits/women/65.jpg',
                title: 'UI/UX Designer - Bangalore',
                email: 'priya.mehta@example.com',
                summary: 'Creative UI/UX designer with a knack for intuitive design, accessibility, and mobile-first interfaces.',
                experience: [
                    { company: 'CreativeBox', location: 'Bangalore', role: 'Lead UI Designer' },
                    { company: 'DesignGrid', location: 'Bangalore', role: 'UX Analyst' },
                ],
                education: [
                    { degree: 'B.Des in Communication Design', board: 'NID', years: '2012 - 2016' },
                    { degree: 'Diploma in Visual Design', board: 'Arena Multimedia', years: '2010 - 2012' },
                ],
                applications: [
                    { jobTitle: 'Senior UI/UX Designer', company: 'Flipkart', status: 'Interview Scheduled' },
                    { jobTitle: 'Product Designer', company: 'Freshworks', status: 'Under Review' },
                ],
                projects: [
                    { name: 'E-commerce Redesign', description: 'Improved UX and conversions for fashion site.' },
                    { name: 'Healthcare Mobile App', description: 'User-centric design for appointment booking.' },
                ],
                services: [
                    { name: 'UX Audits', description: 'Expert reviews for web/mobile apps.' },
                    { name: 'Prototyping', description: 'Interactive flows with Figma and XD.' },
                ],
                marketing: [
                    { platform: 'Behance', campaign: 'Portfolio Highlights', performance: '10K views' },
                    { platform: 'Dribbble', campaign: 'Design Showcase', performance: 'Top trending shots' },
                ],
            },
            {
                id: 4,
                name: 'Rahul Verma',
                location: 'Pune, Baner',
                image: 'https://randomuser.me/api/portraits/men/44.jpg',
                title: 'DevOps Engineer - Pune',
                email: 'rahul.verma@example.com',
                summary: 'Automation-first DevOps engineer with deep experience in CI/CD and Kubernetes.',
                experience: [
                    { company: 'CloudOps', location: 'Pune', role: 'DevOps Lead' },
                    { company: 'SysStack', location: 'Pune', role: 'SRE' },
                ],
                education: [
                    { degree: 'B.Tech in IT', board: 'Pune University', years: '2009 - 2013' },
                ],
                applications: [
                    { jobTitle: 'DevOps Engineer', company: 'Zensar', status: 'Rejected' },
                    { jobTitle: 'Site Reliability Engineer', company: 'Mindtree', status: 'Applied' },
                ],
                projects: [
                    { name: 'K8s Migration', description: 'Moved legacy workloads to cloud-native infra.' },
                    { name: 'Monitoring Dashboards', description: 'Built Grafana dashboards for prod.' },
                ],
                services: [
                    { name: 'CI/CD Pipelines', description: 'Jenkins, GitHub Actions, ArgoCD setup.' },
                    { name: 'Infra as Code', description: 'Terraform + AWS automation.' },
                ],
                marketing: [
                    { platform: 'Twitter', campaign: 'DevOps Tips', performance: '1K followers gained' },
                    { platform: 'Blog', campaign: 'Weekly DevOps Reads', performance: '5K readers' },
                ],
            },
            {
                id: 5,
                name: 'Anjali Singh',
                location: 'Delhi, Hauz Khas',
                image: 'https://randomuser.me/api/portraits/women/25.jpg',
                title: 'Digital Marketer - Delhi',
                email: 'anjali.singh@example.com',
                summary: 'Performance marketer specializing in SEO, SEM, and content-led campaigns.',
                experience: [
                    { company: 'ClickBuzz', location: 'Delhi', role: 'Marketing Manager' },
                    { company: 'AdLift', location: 'Noida', role: 'SEO Analyst' },
                ],
                education: [
                    { degree: 'MBA in Marketing', board: 'IIM Lucknow', years: '2014 - 2016' },
                ],
                projects: [
                    { name: 'SEO Revamp', description: 'Took organic traffic up by 150% in 6 months.' },
                    { name: 'Paid Funnel Setup', description: 'Built Google Ads + FB campaigns for SaaS client.' },
                ],
                services: [
                    { name: 'SEO Audits', description: 'Technical + content-focused audits.' },
                    { name: 'Lead Gen Campaigns', description: 'Full-funnel design and tracking.' },
                ],
                marketing: [
                    { platform: 'Google Ads', campaign: 'B2B SaaS', performance: '200+ leads/mo' },
                    { platform: 'LinkedIn Ads', campaign: 'Consulting Services', performance: '35% CPL reduction' },
                ],
            },
            {
                id: 6,
                name: 'Arjun Desai',
                location: 'Ahmedabad, Satellite',
                image: 'https://randomuser.me/api/portraits/men/15.jpg',
                title: 'Product Manager - Ahmedabad',
                email: 'arjun.desai@example.com',
                summary: 'Product leader driving vision, roadmap, and GTM strategies for SaaS platforms.',
                experience: [
                    { company: 'InnoTech', location: 'Ahmedabad', role: 'Product Manager' },
                    { company: 'SoftCore', location: 'Ahmedabad', role: 'Business Analyst' },
                ],
                education: [
                    { degree: 'PGDM in Product Management', board: 'ISB Hyderabad', years: '2015 - 2017' },
                ],
                projects: [
                    { name: 'Feature Rollout System', description: 'Built internal tools for staged releases.' },
                    { name: 'Customer Feedback Loop', description: 'Created surveys + metrics dashboard.' },
                ],
                services: [
                    { name: 'Roadmap Planning', description: 'Vision to epics conversion' },
                    { name: 'User Research', description: 'Interview frameworks & persona creation' },
                ],
                marketing: [
                    { platform: 'Webinars', campaign: 'Product Demos', performance: '1K attendees avg' },
                    { platform: 'Newsletters', campaign: 'Product Updates', performance: '50% open rate' },
                ],
                applications: [
                    { jobTitle: 'Senior Product Manager', company: 'Razorpay', status: 'Under Review' },
                    { jobTitle: 'Product Lead', company: 'Paytm', status: 'Interview Scheduled' },
                ],
            },
            {
                id: 7,
                name: 'Sneha Kapoor',
                location: 'Chennai, T. Nagar',
                image: 'https://randomuser.me/api/portraits/women/35.jpg',
                title: 'Content Strategist - Chennai',
                email: 'sneha.kapoor@example.com',
                summary: 'Helping brands grow through content that ranks, converts, and builds loyalty.',
                experience: [
                    { company: 'WriteCraft', location: 'Chennai', role: 'Lead Content Strategist' },
                    { company: 'InkHive', location: 'Chennai', role: 'Content Writer' },
                ],
                applications: [
                    { jobTitle: 'Content Lead', company: 'Zomato', status: 'Applied' },
                    { jobTitle: 'Copywriting Manager', company: 'Swiggy', status: 'Interview Scheduled' },
                ],
                education: [
                    { degree: 'BA in English Literature', board: 'Madras University', years: '2008 - 2011' },
                ],
                projects: [
                    { name: 'Content Calendar System', description: 'Automated publishing using Notion + Zapier.' },
                    { name: 'SEO Blogs Pipeline', description: 'Wrote 150+ high-ranking articles.' },
                ],
                services: [
                    { name: 'Content Strategy', description: 'Planning, auditing, and repurposing.' },
                    { name: 'Copywriting', description: 'Sales pages, ads, and email funnels.' },
                ],
                marketing: [
                    { platform: 'Medium', campaign: 'Thought Leadership', performance: '1M reads total' },
                    { platform: 'Twitter Threads', campaign: 'Quick Wins', performance: '200K impressions/thread' },
                ],
            },
            {
                id: 8,
                name: 'Rohit Sharma',
                location: 'Kolkata, Salt Lake',
                image: 'https://randomuser.me/api/portraits/men/55.jpg',
                title: 'QA Engineer - Kolkata',
                email: 'rohit.sharma@example.com',
                summary: 'Detail-driven QA engineer with a passion for test automation and release confidence.',
                experience: [
                    { company: 'BugFree Labs', location: 'Kolkata', role: 'QA Lead' },
                    { company: 'TestCraft', location: 'Kolkata', role: 'Automation Tester' },
                ],
                education: [
                    { degree: 'B.Sc. in CS', board: 'Calcutta University', years: '2008 - 2011' },
                ],
                projects: [
                    { name: 'Selenium Suite', description: 'Built a full suite for regression testing.' },
                    { name: 'CI-based Testing', description: 'Automated tests on every PR merge.' },
                ],
                services: [
                    { name: 'Test Automation', description: 'Selenium, Cypress, Playwright scripts.' },
                    { name: 'Bug Tracking', description: 'Jira workflow optimization.' },
                ],
                applications: [
                    { jobTitle: 'QA Automation Engineer', company: 'HCL', status: 'Under Review' },
                    { jobTitle: 'Test Engineer', company: 'Tech Mahindra', status: 'Shortlisted' },
                ],
                marketing: [
                    { platform: 'LinkedIn', campaign: 'QA Career Guide', performance: '1.2K likes' },
                    { platform: 'Blog', campaign: 'Testing Tips', performance: '8K monthly visitors' },
                ],
            },
            {
                id: 9,
                name: 'Neha Dubey',
                location: 'Jaipur, Malviya Nagar',
                image: 'https://randomuser.me/api/portraits/women/45.jpg',
                title: 'Customer Success Manager - Jaipur',
                email: 'neha.dubey@example.com',
                summary: 'Client-focused CSM with a history of improving retention and NPS for SaaS platforms.',
                experience: [
                    { company: 'ClientBoost', location: 'Jaipur', role: 'CS Manager' },
                    { company: 'Supportly', location: 'Remote', role: 'Customer Support' },
                ],
                education: [
                    { degree: 'MBA in Operations', board: 'BITS Pilani', years: '2013 - 2015' },
                ],
                projects: [
                    { name: 'Churn Reduction Plan', description: 'Reduced churn by 20% using lifecycle campaigns.' },
                    { name: 'CS Playbook', description: 'Standardized onboarding & support flows.' },
                ],
                services: [
                    { name: 'Customer Onboarding', description: 'Customized sessions and tooltips.' },
                    { name: 'Renewal Management', description: 'Tracking and upsell strategy.' },
                ],
                marketing: [
                    { platform: 'Webinars', campaign: 'Client Stories', performance: '4.5 avg rating' },
                    { platform: 'Case Studies', campaign: 'Retention Success', performance: 'Used by sales team' },
                ],
                applications: [
                    { jobTitle: 'Customer Success Lead', company: 'Zoho', status: 'Interview Scheduled' },
                    { jobTitle: 'Account Manager', company: 'Salesforce', status: 'Applied' },
                ],
            },
            {
                id: 10,
                name: 'Vikram Rao',
                location: 'Nagpur, Dharampeth',
                image: 'https://randomuser.me/api/portraits/men/65.jpg',
                title: 'Android Developer - Nagpur',
                email: 'vikram.rao@example.com',
                summary: 'Android developer building performant and accessible mobile apps with Kotlin.',
                experience: [
                    { company: 'MobilityX', location: 'Nagpur', role: 'Android Dev' },
                    { company: 'CodeNest', location: 'Nagpur', role: 'Junior Android Dev' },
                ],
                education: [
                    { degree: 'B.E. in Computer Engineering', board: 'RTMNU', years: '2011 - 2015' },
                ],
                projects: [
                    { name: 'Fitness Tracker App', description: 'Logged over 10K installs on Play Store.' },
                    { name: 'Retail POS App', description: 'Offline-first solution for retail stores.' },
                ],
                services: [
                    { name: 'Mobile App Development', description: 'Custom Android apps built with Kotlin + Jetpack.' },
                    { name: 'Play Store Optimization', description: 'Boost ASO & review management.' },
                ],
                marketing: [
                    { platform: 'Play Store', campaign: 'App Promo', performance: '15K downloads' },
                    { platform: 'YouTube Shorts', campaign: 'Feature Teasers', performance: '50K views' },
                ],
                applications: [
                    { jobTitle: 'Android App Developer', company: 'CRED', status: 'Interview Scheduled' },
                    { jobTitle: 'Mobile Developer', company: 'Groww', status: 'Shortlisted' },
                ],
            },
        ];


        const data = candidateData.find((c) => String(c.id) === String(userId));
        if (data) {
            setProfile(data);
            setTempProfile(data);
        }
    }, [userId]);

    const ActiveComponent = tabs[activeTab].component;

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="bg-[#0d1b2a] text-white py-6 px-4 relative">
                <div className="flex items-center gap-4 max-w-5xl mx-auto">
                    <img
                        src={tempProfile.image}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full border-4 border-white object-cover"
                    />
                    {editingHeader ? (
                        <div className="flex flex-col w-full gap-2">
                            <label className="text-sm">Name</label>
                            <input
                                className="bg-white text-black p-1 rounded"
                                value={tempProfile.name}
                                onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                            />
                            <label className="text-sm">Title</label>
                            <input
                                className="bg-white text-black p-1 rounded"
                                value={tempProfile.title}
                                onChange={(e) => setTempProfile({ ...tempProfile, title: e.target.value })}
                            />
                            <label className="text-sm">Email</label>
                            <input
                                className="bg-white text-black p-1 rounded"
                                value={tempProfile.email}
                                onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    className="text-sm bg-white text-black px-3 py-1 rounded"
                                    onClick={() => {
                                        setProfile(tempProfile);
                                        setEditingHeader(false);
                                    }}
                                >
                                    Save
                                </button>
                                <button
                                    className="text-sm text-white border border-white px-3 py-1 rounded"
                                    onClick={() => setEditingHeader(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="font-bold text-xl">{profile.name}</h2>
                            <p className="text-sm">{profile.title}</p>
                            <p className="text-xs text-gray-300">{profile.email}</p>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            setEditingHeader(true);
                            setTempProfile(profile);
                        }}
                        className="absolute top-4 right-6 text-white"
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-white border-b border-gray-200 max-w-5xl mx-auto px-4 py-6 rounded-b-md shadow-sm">
                <div className="flex gap-4 justify-between text-sm">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.name}
                            className={`py-1 px-3 rounded-t-md transition-colors duration-150 ${activeTab === index
                                ? 'bg-indigo-900 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            onClick={() => setActiveTab(index)}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>
                <ActiveComponent profile={profile} />
            </div>
        </div>
    );
}
