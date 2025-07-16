'use client';
import React, { useState, useEffect, useRef } from 'react';
import { PencilIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import AboutMe from './aboutme';
import Applications from './applications';
import Projects from './projects';
import Services from './services';
import Marketing from './marketing';
import { useRouter } from 'next/navigation';

const tabs = [
    { name: 'About Me', component: AboutMe },
    { name: 'My Applications', component: Applications },
    { name: 'My Projects', component: Projects },
    { name: 'My Previous Services', component: Services },
    { name: 'My Digital Marketing', component: Marketing },
];

export default function ProfilePage({ userId }) {
    const router = useRouter();
    // const [activeTab, setActiveTab] = useState(0);
    const [activeTab, setActiveTab] = useState(0); // State to manage the active tab (clicked)
    const [indicatorStyle, setIndicatorStyle] = useState({}); // State for the moving indicator's style
    const tabRefs = useRef([]); // Ref to store references to each tab button
    const tabContainerRef = useRef(null); // Ref for the main tab container

    const [profile, setProfile] = useState({
        name: '', title: '', email: '', image: '', summary: '', experience: [], education: [],
    });
    const [editingHeader, setEditingHeader] = useState(false);
    const [tempProfile, setTempProfile] = useState(profile);
    const [accordionOpen, setAccordionOpen] = useState(null);

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
                    {
                        company: 'TechMinds',
                        location: 'Hyderabad',
                        role: 'Senior Developer',
                        startDate: '2017-04',
                        endDate: '2023-12',
                        description: 'Led enterprise-grade web application development using modern tech stacks...'
                    },
                    {
                        company: 'NextGen Solutions',
                        location: 'Hyderabad',
                        role: 'Software Engineer',
                        startDate: '2013-06',
                        endDate: '2017-03',
                        description: 'Developed and maintained full-stack applications...'
                    }
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
                    {
                        id: 1,
                        campaignName: 'Summer Tech Hiring 2024',
                        platform: 'LinkedIn, YouTube',
                        status: 'Scheduled',
                        budget: '$2,500',
                        impressions: '1M',
                        clicks: '80K',
                        conversionRate: '1.8%',
                        startDate: '2024-12-01',
                        endDate: '2024-01-31',
                        description: 'Targeted campaign to attract senior developers across Hyderabad via professional and video platforms.',
                    },
                    {
                        id: 2,
                        campaignName: 'Summer Tech Hiring 2025',
                        platform: 'Instagram',
                        status: 'Active',
                        budget: '$7,500',
                        impressions: '2M',
                        clicks: '60K',
                        conversionRate: '3.8%',
                        startDate: '2025-06-01',
                        endDate: '2025-08-31',
                        description: 'Targeted campaign to attract senior developers across Hyderabad via professional and video platforms.',
                    }
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
                    {
                        company: 'HRSolutions',
                        location: 'Mumbai',
                        role: 'Recruitment Manager',
                        description: 'Managed full-cycle recruitment processes for IT and finance roles, implementing strategic sourcing and reducing time-to-hire by 30%.'
                    },
                    {
                        company: 'TalentBridge',
                        location: 'Mumbai',
                        role: 'HR Executive',
                        description: 'Supported hiring campaigns and built a strong candidate pipeline through campus outreach and job portals.'
                    }
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
                    {
                        id: 2,
                        campaignName: 'Mass Hiring Drive 2025',
                        platform: 'Email, Instagram',
                        status: 'Completed',
                        budget: '$4,000',
                        impressions: '1.5M',
                        clicks: '40K',
                        conversionRate: '5.1%',
                        startDate: '2025-04-01',
                        endDate: '2025-06-30',
                        description: 'Bulk recruitment marketing campaign focused on finance and IT roles in urban metros.',
                    }
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
                    {
                        company: 'CreativeBox',
                        location: 'Bangalore',
                        role: 'Lead UI Designer',
                        description: 'Led UI design for web and mobile apps, focusing on user-centered design and brand consistency.'
                    },
                    {
                        company: 'DesignGrid',
                        location: 'Bangalore',
                        role: 'UX Analyst',
                        description: 'Conducted user research, usability testing, and created wireframes to enhance product usability.'
                    }
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
                    {
                        id: 3,
                        campaignName: 'UI/UX Portfolio Showcase',
                        platform: 'Behance, Dribbble',
                        status: 'Active',
                        budget: '$2,000',
                        impressions: '800K',
                        clicks: '22K',
                        conversionRate: '2.75%',
                        startDate: '2025-05-15',
                        endDate: '2025-08-15',
                        description: 'Design campaign highlighting portfolio pieces to attract product companies and recruiters.',
                    }
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
                    {
                        company: 'CloudOps',
                        location: 'Pune',
                        role: 'DevOps Lead',
                        description: 'Architected and managed CI/CD pipelines using Jenkins and GitHub Actions. Automated infrastructure provisioning using Terraform.'
                    },
                    {
                        company: 'SysStack',
                        location: 'Pune',
                        role: 'SRE',
                        description: 'Implemented monitoring systems and improved incident response using Grafana and Prometheus.'
                    }
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
                    {
                        id: 5,
                        campaignName: 'SEO & Lead Gen Blitz',
                        platform: 'Google Ads, LinkedIn Ads',
                        status: 'Active',
                        budget: '$6,000',
                        impressions: '2.2M',
                        clicks: '55K',
                        conversionRate: '4.9%',
                        startDate: '2025-06-01',
                        endDate: '2025-09-01',
                        description: 'Cross-channel campaign focused on driving leads for SaaS clients through paid search and retargeting.',
                    }
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
                    {
                        company: 'ClickBuzz',
                        location: 'Delhi',
                        role: 'Marketing Manager',
                        description: 'Managed end-to-end marketing strategy, including PPC campaigns and SEO efforts, leading to 150% growth in traffic.'
                    },
                    {
                        company: 'AdLift',
                        location: 'Noida',
                        role: 'SEO Analyst',
                        description: 'Optimized websites for search engines and improved SERP rankings through keyword and backlink strategies.'
                    }
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
                    {
                        id: 6,
                        campaignName: 'Product Demo Webinars',
                        platform: 'Webinars, Newsletters',
                        status: 'Active',
                        budget: '$3,500',
                        impressions: '1.1M',
                        clicks: '25K',
                        conversionRate: '2.3%',
                        startDate: '2025-06-10',
                        endDate: '2025-08-31',
                        description: 'Webinar series showcasing SaaS product features to boost product-led growth.',
                    }
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
                    {
                        company: 'InnoTech',
                        location: 'Ahmedabad',
                        role: 'Product Manager',
                        description: 'Led product roadmap, feature prioritization, and stakeholder alignment for SaaS offerings.'
                    },
                    {
                        company: 'SoftCore',
                        location: 'Ahmedabad',
                        role: 'Business Analyst',
                        description: 'Analyzed user needs and translated business goals into functional specifications for development teams.'
                    }
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
                    {
                        id: 7,
                        campaignName: 'Thought Leadership Push',
                        platform: 'Medium, Twitter Threads',
                        status: 'Active',
                        budget: '$2,200',
                        impressions: '1.8M',
                        clicks: '42K',
                        conversionRate: '3.4%',
                        startDate: '2025-05-20',
                        endDate: '2025-08-31',
                        description: 'Personal brand campaign focused on content strategy and viral tips for marketers.',
                    }
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
                    {
                        company: 'WriteCraft',
                        location: 'Chennai',
                        role: 'Lead Content Strategist',
                        description: 'Led content strategy and publishing calendar, resulting in consistent traffic growth and improved lead generation.'
                    },
                    {
                        company: 'InkHive',
                        location: 'Chennai',
                        role: 'Content Writer',
                        description: 'Authored high-performing articles for B2B and B2C domains, focusing on SEO and storytelling.'
                    }
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
                    {
                        id: 8,
                        campaignName: 'QA Career Insights',
                        platform: 'LinkedIn, Blog',
                        status: 'Completed',
                        budget: '$1,500',
                        impressions: '900K',
                        clicks: '21K',
                        conversionRate: '2.9%',
                        startDate: '2025-04-01',
                        endDate: '2025-06-30',
                        description: 'Educational campaign for fellow QA engineers with automation best practices and tool reviews.',
                    }
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
                    {
                        company: 'BugFree Labs',
                        location: 'Kolkata',
                        role: 'QA Lead',
                        description: 'Designed and executed comprehensive test plans and led QA teams across projects with a focus on automation.'
                    },
                    {
                        company: 'TestCraft',
                        location: 'Kolkata',
                        role: 'Automation Tester',
                        description: 'Developed Selenium and Cypress scripts to ensure product stability across builds and environments.'
                    }
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
                    {
                        id: 9,
                        campaignName: 'Customer Retention Insights',
                        platform: 'Webinars, Case Studies',
                        status: 'Active',
                        budget: '$3,000',
                        impressions: '1.3M',
                        clicks: '30K',
                        conversionRate: '4.1%',
                        startDate: '2025-06-01',
                        endDate: '2025-08-31',
                        description: 'Client engagement campaign sharing success stories and customer onboarding methods.',
                    }
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
                    {
                        company: 'ClientBoost',
                        location: 'Jaipur',
                        role: 'CS Manager',
                        description: 'Led customer onboarding and success strategies, achieving 20% churn reduction.'
                    },
                    {
                        company: 'Supportly',
                        location: 'Remote',
                        role: 'Customer Support',
                        description: 'Provided support across channels and contributed to CSAT score improvement through proactive service.'
                    }
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
                    {
                        company: 'MobilityX',
                        location: 'Nagpur',
                        role: 'Android Dev',
                        description: 'Developed Kotlin-based mobile apps with Jetpack libraries and followed MVVM architecture for scalability.'
                    },
                    {
                        company: 'CodeNest',
                        location: 'Nagpur',
                        role: 'Junior Android Dev',
                        description: 'Assisted in maintaining existing Android apps and improving app performance and UI responsiveness.'
                    }
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
                    {
                        id: 10,
                        campaignName: 'Android App Showcase',
                        platform: 'Play Store, YouTube Shorts',
                        status: 'Active',
                        budget: '$2,500',
                        impressions: '1.5M',
                        clicks: '35K',
                        conversionRate: '4.6%',
                        startDate: '2025-06-01',
                        endDate: '2025-08-31',
                        description: 'Promotional push for Android apps with feature highlights, ASO, and short-form videos.',
                    }
                ],
                applications: [
                    { jobTitle: 'Android App Developer', company: 'CRED', status: 'Interview Scheduled' },
                    { jobTitle: 'Mobile Developer', company: 'Groww', status: 'Shortlisted' },
                ],
            },
        ];
        const data = candidateData.find((c) => String(c.id) === String(userId || 1));
        if (data) {
            setProfile(data);
            setTempProfile(data);
        }
    }, [userId]);

    const updateIndicatorStyle = (index) => {
        if (tabRefs.current[index]) {
            const targetButton = tabRefs.current[index];
            setIndicatorStyle({
                width: targetButton.offsetWidth,
                left: targetButton.offsetLeft,
            });
        }
    };

    // Effect to set initial indicator position to the active tab
    // and recalculate on activeTab change or window resize
    useEffect(() => {
        updateIndicatorStyle(activeTab);

        const handleResize = () => {
            updateIndicatorStyle(activeTab);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [activeTab]);

    // Handle hover effect: move indicator to hovered tab
    const handleMouseEnter = (index) => {
        updateIndicatorStyle(index);
    };

    // Handle mouse leave from the entire tab container: move indicator back to active tab
    const handleMouseLeave = () => {
        updateIndicatorStyle(activeTab);
    };

    const ActiveComponent = tabs[activeTab].component;

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="bg-[#0d1b2a] text-white py-6 px-4 relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-5xl mx-auto">
                    <img
                        src={tempProfile.image}
                        alt="Avatar"
                        className="w-16 sm:w-20 h-16 sm:h-20 rounded-full border-4 border-white object-cover"
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
                            <h2 className="font-bold text-lg sm:text-xl">{profile.name}</h2>
                            <p className="text-sm">{profile.title}</p>
                            <p className="text-xs text-gray-300">{profile.email}</p>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            setEditingHeader(true);
                            setTempProfile(profile);
                        }}
                        className="absolute top-8 sm:top-4 right-6 text-white"
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                </div>
                {/* Desktop Edit Icon */}
                <button
                    onClick={() => {
                        setEditingHeader(true);
                        setTempProfile(profile);
                    }}
                    className="hidden sm:block absolute top-4 right-6 text-white"
                >
                    <PencilIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Tab / Accordion Section */}
            <div className="bg-white border-b border-gray-200 max-w-5xl mx-auto px-4 py-6 rounded-b-md shadow-sm">
                {/* Desktop Tabs */}
                <div className="hidden sm:flex flex-col text-sm mb-6">
                    {/* Tab Navigation */}
                    <div
                        ref={tabContainerRef}
                        className="flex flex-row justify-between bg-white rounded-t-md relative overflow-hidden"
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Moving background indicator */}
                        <span
                            className="absolute bottom-0 h-full bg-gray-200 rounded-t-md transition-all duration-300 ease-in-out z-0"
                            style={indicatorStyle}
                        ></span>

                        {tabs.map((tab, index) => (
                            <button
                                key={tab.name}
                                ref={el => tabRefs.current[index] = el} // Assign ref to each button
                                className={`py-1 px-3 rounded-t-md transition-colors relative font-medium z-10
                            transition-colors duration-300 ease-in-out
                            ${activeTab === index
                                        ? 'bg-indigo-900 text-white' // Active tab text color (bg handled by indicator)
                                        : 'text-gray-700' // Non-active tab text color
                                    }`}
                                onClick={() => setActiveTab(index)}
                                onMouseEnter={() => handleMouseEnter(index)} // Listen for mouse entering individual tab
                            >
                                {/* Text content */}
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="py-1 px-3 rounded-t-md">
                        {tabs[activeTab].component}
                    </div>
                </div>

                {/* Desktop Tab Content */}
                <div className="hidden sm:block">
                    <ActiveComponent profile={profile} />
                </div>

                {/* Mobile Accordion */}
                <div className="sm:hidden">
                    {tabs.map((tab, index) => {
                        const Component = tab.component;
                        const isOpen = accordionOpen === index;
                        return (
                            <div key={tab.name} className="border-b border-gray-200">
                                <button
                                    onClick={() => setAccordionOpen(isOpen ? null : index)}
                                    className="w-full flex justify-between items-center py-2 px-2 bg-gray-50 text-left"
                                >
                                    <span className="font-medium text-gray-700 text-sm">{tab.name}</span>
                                    <ChevronDownIcon
                                        className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="p-2">
                                        <Component profile={profile} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
