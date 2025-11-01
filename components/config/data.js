export const users = [
    {
        name: "bheema",
        email: "bheema@gmail.com",
        mobile: "9000133416",
        password: "bheema@123",
        role: "applicant",
        token: "csef",
        isAdmin: true,
    },
    {
        name: "dlf",
        email: "dlf@gmail.com",
        mobile: "9000000016",
        password: "dlf@123",
        role: "recruiter",
        token: "csef",
        isAdmin: true,
    }
]

export const companyData = [
    {
        id: 1001,
        name: "DLF Ltd.",
        logo: "/company/dlf.png",
        industry: "Real Estate",
        location: "Gurugram",
        established: 1946,
        email: "dlf@gmail.com",
        website: "https://www.dlf.in",
        ratings: 3.5,
        projects: [
            { id: 1, title: "DLF Cyber Residency", location: "DLF Cyber City, Gurugram", price: "₹ 2.5 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project1.jpg", projectType: "Apartments", bedrooms: "2, 3, 4 BHK", devSize: "15 Acres", totalUnits: "1200 Units", },
            { id: 2, title: "DLF Park Place", location: "Golf Course Road, Gurugram", price: "₹ 3.1 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project2.jpg", projectType: "Luxury Apartments", bedrooms: "3, 4 BHK", devSize: "10 Acres", totalUnits: "1500 Units", },
            { id: 3, title: "DLF Ultima", location: "Sector 81, Gurugram", price: "₹ 2.0 Cr onwards", status: "ONGOING", image: "/rejobs/project3.jpg", projectType: "High-End Residential", bedrooms: "3, 4 BHK", devSize: "23 Acres", totalUnits: "500 Units", },
            { id: 4, title: "DLF The Crest", location: "Sector 54, Gurugram", price: "₹ 6.5 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project4.jpg", projectType: "Ultra Luxury", bedrooms: "2, 3, 4, 5 BHK", devSize: "8.2 Acres", totalUnits: "764 Units", },
            { id: 5, title: "DLF Privana", location: "Sector 76, Gurugram", price: "₹ 4.5 Cr onwards", status: "NEW LAUNCH", image: "/rejobs/project5.jpg", projectType: "Luxury Apartments", bedrooms: "4 BHK", devSize: "16 Acres", totalUnits: "1100 Units", },
            { id: 6, title: "DLF Two Horizon Center", location: "Cyber City, Gurugram", price: "Commercial Lease", status: "READY TO MOVE", image: "/rejobs/project6.jpg", projectType: "Commercial Office", bedrooms: "NA", devSize: "11 Acres", totalUnits: "NA", },
            { id: 7, title: "DLF Kings Court", location: "Greater Kailash II, Delhi", price: "₹ 8 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project7.jpg", projectType: "Luxury Residences", bedrooms: "4 BHK, Penthouses", devSize: "2.5 Acres", totalUnits: "120 Units", },
            { id: 8, title: "DLF Moti Nagar", location: "Moti Nagar, Delhi", price: "₹ 1.5 Cr onwards", status: "UNDER CONSTRUCTION", image: "/rejobs/project8.jpg", projectType: "Apartments", bedrooms: "2, 3 BHK", devSize: "7 Acres", totalUnits: "600 Units", },
            { id: 9, title: "DLF Summit", location: "DLF Phase V, Gurugram", price: "₹ 3.8 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project9.jpg", projectType: "Apartments", bedrooms: "4 BHK", devSize: "5 Acres", totalUnits: "300 Units", },
            { id: 10, title: "DLF Galleria Market", location: "DLF Phase IV, Gurugram", price: "Commercial Retail", status: "READY TO MOVE", image: "/rejobs/project10.jpg", projectType: "Retail Mall", bedrooms: "NA", devSize: "4 Acres", totalUnits: "NA", },
        ],
        jobs: [
            { id: 101, title: "Senior Sales Manager (Residential)", location: "Gurugram", experience: "8+ Years", salary: "₹ 18-25 LPA", categorySlug: "real-estate-sales", },
            { id: 102, title: "Project Engineer (Civil)", location: "Pan India (Relocation)", experience: "5-10 Years", salary: "₹ 12-18 LPA", categorySlug: "construction-and-design", },
            { id: 103, title: "Leasing Specialist (Commercial)", location: "Delhi/NCR", experience: "6+ Years", salary: "₹ 15-22 LPA", categorySlug: "real-estate-sales", },
            { id: 104, title: "Legal Counsel (RERA & Compliance)", location: "Gurugram", experience: "10+ Years", salary: "₹ 20-35 LPA", categorySlug: "legal-and-compliance", },
            { id: 105, title: "Financial Analyst (REITs)", location: "Gurugram", experience: "4+ Years", salary: "₹ 10-15 LPA", categorySlug: "finance-and-accounting", },
            { id: 106, title: "Chief Architect", location: "Gurugram", experience: "20+ Years", salary: "₹ 70-100 LPA", categorySlug: "construction-and-design", },
            { id: 107, title: "Digital Marketing Head", location: "Delhi", experience: "10+ Years", salary: "₹ 25-40 LPA", categorySlug: "marketing-and-pr", },
            { id: 108, title: "Site Supervisor (Plumbing)", location: "Mumbai", experience: "5+ Years", salary: "₹ 6-10 LPA", categorySlug: "construction-and-design", },
            { id: 109, title: "Executive Assistant to CEO", location: "Gurugram", experience: "5+ Years", salary: "₹ 12-18 LPA", categorySlug: "operations-and-management", },
            { id: 110, title: "HR Business Partner", location: "Pan India", experience: "8+ Years", salary: "₹ 15-20 LPA", categorySlug: "human-resources", },
        ],
        investors: [
            { id: 201, name: "GIC (Singapore Sovereign Wealth Fund)", type: "Institutional Investor", stake: "Significant Minority", investmentDate: "2022-05-15", },
            { id: 202, name: "Blackstone Group", type: "Private Equity", stake: "Commercial Portfolio", investmentDate: "2019-11-01", },
            { id: 203, name: "Carlyle Group", type: "Private Equity", stake: "Residential Joint Venture", investmentDate: "2023-01-20", },
            { id: 204, name: "Aberdeen Standard Investments", type: "Institutional Investor", stake: "Public Market Shareholding", investmentDate: "2021-09-01", },
            { id: 205, name: "HDFC Property Fund", type: "Debt Financing", stake: "Project Specific Debt", investmentDate: "2020-03-10", },
            { id: 206, name: "Kotak Investment Advisors", type: "Private Equity", stake: "Land Acquisition Funding", investmentDate: "2018-07-25", },
            { id: 207, name: "Morgan Stanley Real Estate", type: "Private Equity", stake: "Select Portfolio", investmentDate: "2016-11-11", },
            { id: 208, name: "LIC", type: "Institutional Investor", stake: "Public Market Shareholding", investmentDate: "Ongoing", },
            { id: 209, name: "SBI Mutual Fund", type: "Institutional Investor", stake: "Public Market Shareholding", investmentDate: "Ongoing", },
            { id: 210, name: "Promoter Family Holdings", type: "Internal/Private", stake: "Majority Stake", investmentDate: "NA", },
        ],
    },
    {
        id: 1002,
        name: "Honer Properties",
        logo: "/company/honer.jpg",
        industry: "Real Estate",
        location: "Hyderabad",
        established: 2010,
        email: "honer@gmail.com",
        website: "https://www.honerhomes.com",
        ratings: 3.6,
        projects: [
            { id: 1, title: "Honer Vivantis", location: "Gopanpally, Hyderabad", price: "₹ 1.2 Cr onwards", status: "UNDER CONSTRUCTION", image: "/rejobs/project1.jpg", projectType: "Apartments", bedrooms: "2 & 3 BHK", devSize: "10 Acres", totalUnits: "850 Units", },
            { id: 2, title: "Honer Bliss", location: "Tellapur, Hyderabad", price: "₹ 90 Lakh onwards", status: "NEW LAUNCH", image: "/rejobs/project2.jpg", projectType: "Affordable Apartments", bedrooms: "2 BHK", devSize: "8 Acres", totalUnits: "700 Units", },
            { id: 3, title: "Honer Homes City", location: "Kompally, Hyderabad", price: "₹ 70 Lakh onwards", status: "READY TO MOVE", image: "/rejobs/project3.jpg", projectType: "Villas", bedrooms: "3, 4 BHK", devSize: "15 Acres", totalUnits: "200 Units", },
            { id: 4, title: "Honer Heights", location: "Manikonda, Hyderabad", price: "₹ 1.5 Cr onwards", status: "ONGOING", image: "/rejobs/project4.jpg", projectType: "Luxury Apartments", bedrooms: "3 BHK", devSize: "5 Acres", totalUnits: "350 Units", },
            { id: 5, title: "Honer Gardens", location: "Gachibowli, Hyderabad", price: "₹ 2.0 Cr onwards", status: "NEW LAUNCH", image: "/rejobs/project5.jpg", projectType: "Premium Apartments", bedrooms: "4 BHK", devSize: "9 Acres", totalUnits: "450 Units", },
            { id: 6, title: "Honer Towers", location: "Hitech City, Hyderabad", price: "Commercial Lease", status: "READY TO MOVE", image: "/rejobs/project6.jpg", projectType: "Commercial Office", bedrooms: "NA", devSize: "6 Acres", totalUnits: "NA", },
            { id: 7, title: "Honer Valley", location: "Shamshabad, Hyderabad", price: "₹ 40 Lakh onwards", status: "READY TO MOVE", image: "/rejobs/project7.jpg", projectType: "Plots", bedrooms: "NA", devSize: "50 Acres", totalUnits: "500 Plots", },
            { id: 8, title: "Honer Retreat", location: "Patancheru, Hyderabad", price: "₹ 60 Lakh onwards", status: "UNDER CONSTRUCTION", image: "/rejobs/project8.jpg", projectType: "Apartments", bedrooms: "2 BHK", devSize: "12 Acres", totalUnits: "900 Units", },
            { id: 9, title: "Honer Signature", location: "Kondapur, Hyderabad", price: "₹ 2.5 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project9.jpg", projectType: "Luxury Penthouses", bedrooms: "5 BHK", devSize: "3 Acres", totalUnits: "150 Units", },
            { id: 10, title: "Honer Galleria", location: "Jubilee Hills, Hyderabad", price: "Commercial Retail", status: "READY TO MOVE", image: "/rejobs/project10.jpg", projectType: "Retail Mall", bedrooms: "NA", devSize: "2 Acres", totalUnits: "NA", },
        ],
        jobs: [
            { id: 111, title: "Marketing Executive", location: "Hyderabad", experience: "3+ Years", salary: "₹ 6-9 LPA", categorySlug: "marketing-and-pr", },
            { id: 112, title: "CRM Specialist", location: "Hyderabad", experience: "5+ Years", salary: "₹ 8-12 LPA", categorySlug: "real-estate-sales", },
            { id: 113, title: "Site Civil Engineer", location: "Gopanpally", experience: "4+ Years", salary: "₹ 7-10 LPA", categorySlug: "construction-and-design", },
            { id: 114, title: "Accounts Executive", location: "Hyderabad", experience: "2+ Years", salary: "₹ 4-6 LPA", categorySlug: "finance-and-accounting", },
            { id: 115, title: "Interior Designer", location: "Hyderabad", experience: "6+ Years", salary: "₹ 9-14 LPA", categorySlug: "construction-and-design", },
            { id: 116, title: "Sales Coordinator", location: "Hyderabad", experience: "1+ Years", salary: "₹ 3-5 LPA", categorySlug: "real-estate-sales", },
            { id: 117, title: "Project Manager (Residential)", location: "Hyderabad", experience: "10+ Years", salary: "₹ 20-30 LPA", categorySlug: "construction-and-design", },
            { id: 118, title: "Legal Officer (Documentation)", location: "Hyderabad", experience: "3+ Years", salary: "₹ 6-10 LPA", categorySlug: "legal-and-compliance", },
            { id: 119, title: "HR Recruiter", location: "Hyderabad", experience: "2+ Years", salary: "₹ 4-7 LPA", categorySlug: "human-resources", },
            { id: 120, title: "Tendering Engineer", location: "Hyderabad", experience: "5+ Years", salary: "₹ 8-13 LPA", categorySlug: "construction-and-design", },
        ],
        investors: [
            { id: 211, name: "Local Angel Investors", type: "Angel Funding", stake: "Private", investmentDate: "2015-08-01", },
            { id: 212, name: "HDFC Venture Capital", type: "Venture Capital", stake: "Project Specific Equity", investmentDate: "2019-04-10", },
            { id: 213, name: "Reliance Capital", type: "Debt Funding", stake: "Loan", investmentDate: "2021-01-15", },
            { id: 214, name: "IIFL Wealth", type: "Wealth Management Client Group", stake: "Undisclosed", investmentDate: "2022-10-01", },
            { id: 215, name: "Family Office - South India", type: "Private Investment", stake: "Minority", investmentDate: "2017-06-20", },
            { id: 216, name: "NBFC 1", type: "Debt Financing", stake: "Construction Finance", investmentDate: "2023-05-10", },
            { id: 217, name: "NBFC 2", type: "Debt Financing", stake: "Construction Finance", investmentDate: "2022-02-28", },
            { id: 218, name: "Bank of Baroda", type: "Term Loan", stake: "Debt", investmentDate: "2020-09-01", },
            { id: 219, name: "Promoter Family A", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 220, name: "Promoter Family B", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
        ],
    },
    {
        id: 1003,
        name: "Brigade Group",
        logo: "/company/brigade.jpeg",
        industry: "Real Estate",
        location: "Bengaluru",
        established: 1986,
        email: "brigade@gmail.com",
        website: "https://www.brigadegroup.com",
        ratings: 4.0,
        projects: [
            { id: 1, title: "Brigade Exotica", location: "Old Madras Road, Bengaluru", price: "₹ 3 Cr onwards", status: "ONGOING", image: "/rejobs/project1.jpg", projectType: "Apartments", bedrooms: "2, 3, 4 BHK & Penthouses", devSize: "10 Acres", totalUnits: "950 Units", },
            { id: 2, title: "Brigade El Dorado", location: "Bagalur Road, Bengaluru", price: "₹ 80 Lakh onwards", status: "ONGOING", image: "/rejobs/project2.jpg", projectType: "Apartments", bedrooms: "2 & 3 BHK", devSize: "50 Acres", totalUnits: "5000 Units", },
            { id: 3, title: "Brigade Gateway", location: "Rajajinagar, Bengaluru", price: "₹ 2.5 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project3.jpg", projectType: "Integrated Township", bedrooms: "3 BHK", devSize: "40 Acres", totalUnits: "1200 Units", },
            { id: 4, title: "Brigade Utopia", location: "Varthur Gachibowli, Bengaluru", price: "₹ 1 Cr onwards", status: "UNDER CONSTRUCTION", image: "/rejobs/project4.jpg", projectType: "Smart Township", bedrooms: "1, 2, 3 BHK", devSize: "47 Acres", totalUnits: "4000 Units", },
            { id: 5, title: "Brigade Compass", location: "Whitefield, Bengaluru", price: "Commercial Lease", status: "READY TO MOVE", image: "/rejobs/project5.jpg", projectType: "Office Spaces", bedrooms: "NA", devSize: "10 Acres", totalUnits: "NA", },
            { id: 6, title: "Brigade Millennium", location: "JP Nagar, Bengaluru", price: "₹ 1.8 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project6.jpg", projectType: "Apartments", bedrooms: "2, 3 BHK", devSize: "8 Acres", totalUnits: "500 Units", },
            { id: 7, title: "Brigade Woods", location: "Whitefield, Bengaluru", price: "₹ 1.2 Cr onwards", status: "ONGOING", image: "/rejobs/project7.jpg", projectType: "Apartments", bedrooms: "2, 3 BHK", devSize: "7 Acres", totalUnits: "350 Units", },
            { id: 8, title: "Brigade Buena Vista", location: "Old Madras Road, Bengaluru", price: "₹ 90 Lakh onwards", status: "UNDER CONSTRUCTION", image: "/rejobs/project8.jpg", projectType: "Apartments", bedrooms: "1, 2, 3 BHK", devSize: "7 Acres", totalUnits: "600 Units", },
            { id: 9, title: "Brigade Xanadu", location: "Mogappair West, Chennai", price: "₹ 1.1 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project9.jpg", projectType: "Apartments", bedrooms: "2, 3 BHK", devSize: "10 Acres", totalUnits: "750 Units", },
            { id: 10, title: "Brigade WTC", location: "Malleshwaram, Bengaluru", price: "Commercial Office", status: "READY TO MOVE", image: "/rejobs/project10.jpg", projectType: "Commercial Office", bedrooms: "NA", devSize: "10 Acres", totalUnits: "NA", },
        ],
        jobs: [
            { id: 121, title: "VP of Construction", location: "Bengaluru", experience: "15+ Years", salary: "₹ 40-60 LPA", categorySlug: "construction-and-design", },
            { id: 122, title: "Retail Leasing Manager", location: "Bengaluru", experience: "7+ Years", salary: "₹ 15-25 LPA", categorySlug: "real-estate-sales", },
            { id: 123, title: "MEP Engineer", location: "Pan India", experience: "6+ Years", salary: "₹ 10-18 LPA", categorySlug: "construction-and-design", },
            { id: 124, title: "Corporate Communications Lead", location: "Bengaluru", experience: "8+ Years", salary: "₹ 18-28 LPA", categorySlug: "marketing-and-pr", },
            { id: 125, title: "Project Manager (Township)", location: "Bengaluru", experience: "12+ Years", salary: "₹ 30-45 LPA", categorySlug: "construction-and-design", },
            { id: 126, title: "Treasury Manager", location: "Bengaluru", experience: "9+ Years", salary: "₹ 20-30 LPA", categorySlug: "finance-and-accounting", },
            { id: 127, title: "General Manager - Hospitality", location: "Chennai", experience: "15+ Years", salary: "₹ 35-50 LPA", categorySlug: "operations-and-management", },
            { id: 128, title: "Site Safety Officer", location: "Hyderabad", experience: "5+ Years", salary: "₹ 8-12 LPA", categorySlug: "construction-and-design", },
            { id: 129, title: "Senior Legal Counsel", location: "Bengaluru", experience: "15+ Years", salary: "₹ 40-55 LPA", categorySlug: "legal-and-compliance", },
            { id: 130, title: "Digital Transformation Lead", location: "Bengaluru", experience: "10+ Years", salary: "₹ 25-40 LPA", categorySlug: "operations-and-management", },
        ],
        investors: [
            { id: 221, name: "HDFC Property Fund", type: "Private Equity Real Estate", stake: "Project Specific", investmentDate: "2021-03-10", },
            { id: 222, name: "GIC (Singapore)", type: "Institutional Investor", stake: "Commercial Portfolio JV", investmentDate: "2018-08-01", },
            { id: 223, name: "Brookfield Asset Management", type: "Private Equity", stake: "Office Portfolio", investmentDate: "2022-05-20", },
            { id: 224, name: "Promoter Family Group", type: "Internal/Private", stake: "Majority Stake", investmentDate: "NA", },
            { id: 225, name: "Axis Bank", type: "Debt Financing", stake: "Construction Loan", investmentDate: "2023-01-15", },
            { id: 226, name: "ICICI Prudential AMC", type: "Institutional Investor", stake: "Public Market Shareholding", investmentDate: "Ongoing", },
            { id: 227, name: "Kotak Realty Fund", type: "Private Equity", stake: "Residential Debt", investmentDate: "2019-11-01", },
            { id: 228, name: "NBFC Lending Partner", type: "Debt Financing", stake: "Loan", investmentDate: "2020-07-01", },
            { id: 229, name: "Public Shareholders A", type: "Stock Exchange", stake: "Minority", investmentDate: "NA", },
            { id: 230, name: "Public Shareholders B", type: "Stock Exchange", stake: "Minority", investmentDate: "NA", },
        ],
    },
    {
        id: 1004,
        name: "Cyber City.",
        logo: "/company/cybercity.jpg",
        industry: "Real Estate",
        location: "Hyderabad",
        established: 2004,
        email: "cybercity@gmail.com",
        website: "https://www.cybercity.in",
        ratings: 3.8,
        projects: [
            { id: 1, title: "Cyber City Marina Skies", location: "Hi-Tech City, Hyderabad", price: "₹ 1.1 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project1.jpg", projectType: "Apartments", bedrooms: "2, 3 BHK", devSize: "8 Acres", totalUnits: "800 Units", },
            { id: 2, title: "Cyber City Rainbow Vistas", location: "Moosapet, Hyderabad", price: "₹ 95 Lakh onwards", status: "UNDER CONSTRUCTION", image: "/rejobs/project2.jpg", projectType: "High-Rise", bedrooms: "2, 3 BHK", devSize: "22 Acres", totalUnits: "2000 Units", },
            { id: 3, title: "Cyber City Fortune", location: "Gachibowli, Hyderabad", price: "₹ 1.5 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project3.jpg", projectType: "Apartments", bedrooms: "3 BHK", devSize: "10 Acres", totalUnits: "750 Units", },
            { id: 4, title: "Cyber City Prime", location: "Kondapur, Hyderabad", price: "₹ 2.0 Cr onwards", status: "NEW LAUNCH", image: "/rejobs/project4.jpg", projectType: "Luxury Apartments", bedrooms: "4 BHK", devSize: "6 Acres", totalUnits: "400 Units", },
            { id: 5, title: "Cyber City Offices", location: "Hi-Tech City, Hyderabad", price: "Commercial Lease", status: "READY TO MOVE", image: "/rejobs/project5.jpg", projectType: "Commercial Office", bedrooms: "NA", devSize: "15 Acres", totalUnits: "NA", },
            { id: 6, title: "Cyber City Springs", location: "Kukatpally, Hyderabad", price: "₹ 80 Lakh onwards", status: "ONGOING", image: "/rejobs/project6.jpg", projectType: "Apartments", bedrooms: "2 BHK", devSize: "7 Acres", totalUnits: "650 Units", },
            { id: 7, title: "Cyber City Villas", location: "Kompally, Hyderabad", price: "₹ 3 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project7.jpg", projectType: "Villas", bedrooms: "4, 5 BHK", devSize: "20 Acres", totalUnits: "150 Units", },
            { id: 8, title: "Cyber City Towers", location: "Madhavapur, Hyderabad", price: "Commercial Office", status: "UNDER CONSTRUCTION", image: "/rejobs/project8.jpg", projectType: "Commercial Office", bedrooms: "NA", devSize: "12 Acres", totalUnits: "NA", },
            { id: 9, title: "Cyber City Plaza", location: "Miyapur, Hyderabad", price: "Commercial Retail", status: "READY TO MOVE", image: "/rejobs/project9.jpg", projectType: "Retail Mall", bedrooms: "NA", devSize: "5 Acres", totalUnits: "NA", },
            { id: 10, title: "Cyber City Residency Annex", location: "Gachibowli, Hyderabad", price: "₹ 90 Lakh onwards", status: "ONGOING", image: "/rejobs/project10.jpg", projectType: "Apartments", bedrooms: "2 BHK", devSize: "4 Acres", totalUnits: "300 Units", },
        ],
        jobs: [
            { id: 131, title: "Finance Controller", location: "Hyderabad", experience: "10+ Years", salary: "₹ 20-30 LPA", categorySlug: "finance-and-accounting", },
            { id: 132, title: "Sales Executive", location: "Hyderabad", experience: "2+ Years", salary: "₹ 5-8 LPA", categorySlug: "real-estate-sales", },
            { id: 133, title: "Site Engineer", location: "Hyderabad", experience: "5+ Years", salary: "₹ 8-12 LPA", categorySlug: "construction-and-design", },
            { id: 134, title: "Marketing Analyst", location: "Hyderabad", experience: "3+ Years", salary: "₹ 6-9 LPA", categorySlug: "marketing-and-pr", },
            { id: 135, title: "Legal Officer", location: "Hyderabad", experience: "4+ Years", salary: "₹ 7-11 LPA", categorySlug: "legal-and-compliance", },
            { id: 136, title: "Project Manager", location: "Hyderabad", experience: "12+ Years", salary: "₹ 25-35 LPA", categorySlug: "construction-and-design", },
            { id: 137, title: "HR Manager", location: "Hyderabad", experience: "7+ Years", salary: "₹ 10-15 LPA", categorySlug: "human-resources", },
            { id: 138, title: "Accounts Assistant", location: "Hyderabad", experience: "1+ Years", salary: "₹ 3-5 LPA", categorySlug: "finance-and-accounting", },
            { id: 139, title: "Customer Support Executive", location: "Hyderabad", experience: "2+ Years", salary: "₹ 4-7 LPA", categorySlug: "operations-and-management", },
            { id: 140, title: "Design Architect", location: "Hyderabad", experience: "8+ Years", salary: "₹ 15-20 LPA", categorySlug: "construction-and-design", },
        ],
        investors: [
            { id: 231, name: "Private Funding Consortium", type: "Private Equity", stake: "Project Specific", investmentDate: "2020-01-20", },
            { id: 232, name: "Axis Bank", type: "Debt Financing", stake: "Construction Loan", investmentDate: "2021-03-01", },
            { id: 233, name: "HDFC Property Fund", type: "Private Equity", stake: "Project Specific", investmentDate: "2018-05-15", },
            { id: 234, name: "Promoter Family A", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 235, name: "Promoter Family B", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 236, name: "NBFC Partner X", type: "Debt Financing", stake: "Loan", investmentDate: "2022-09-10", },
            { id: 237, name: "NBFC Partner Y", type: "Debt Financing", stake: "Loan", investmentDate: "2023-01-25", },
            { id: 238, name: "Retail Investor Group 1", type: "Private Placement", stake: "Minority", investmentDate: "2019-02-14", },
            { id: 239, name: "Retail Investor Group 2", type: "Private Placement", stake: "Minority", investmentDate: "2020-11-30", },
            { id: 240, name: "Syndicate Bank", type: "Term Loan", stake: "Debt", investmentDate: "2017-06-01", },
        ],
    },
    {
        id: 1005,
        name: "Jayabheri Properties",
        logo: "/company/jayabheri.jpg",
        industry: "Real Estate",
        location: "Hyderabad",
        established: 1987,
        email: "jayabheri@gmail.com",
        website: "https://www.jayabherigroup.com",
        ratings: 3.9,
        projects: [
            { id: 1, title: "Jayabheri The Peak", location: "Nanakramguda, Hyderabad", price: "₹ 3.2 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project1.jpg", projectType: "Luxury Apartments", bedrooms: "3, 4 BHK", devSize: "12 Acres", totalUnits: "600 Units", },
            { id: 2, title: "Jayabheri The Capital", location: "Financial District, Hyderabad", price: "₹ 2.5 Cr onwards", status: "ONGOING", image: "/rejobs/project2.jpg", projectType: "Premium Apartments", bedrooms: "3 BHK", devSize: "9 Acres", totalUnits: "500 Units", },
            { id: 3, title: "Jayabheri Silicon County", location: "Gachibowli, Hyderabad", price: "₹ 1.8 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project3.jpg", projectType: "Apartments", bedrooms: "2, 3 BHK", devSize: "10 Acres", totalUnits: "800 Units", },
            { id: 4, title: "Jayabheri Nirvana", location: "Kondapur, Hyderabad", price: "₹ 4.0 Cr onwards", status: "NEW LAUNCH", image: "/rejobs/project4.jpg", projectType: "Villas", bedrooms: "5 BHK", devSize: "15 Acres", totalUnits: "120 Units", },
            { id: 5, title: "Jayabheri Offices", location: "Nanakramguda, Hyderabad", price: "Commercial Lease", status: "READY TO MOVE", image: "/rejobs/project5.jpg", projectType: "Commercial Office", bedrooms: "NA", devSize: "7 Acres", totalUnits: "NA", },
            { id: 6, title: "Jayabheri Towers", location: "Jubilee Hills, Hyderabad", price: "₹ 5 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project6.jpg", projectType: "Ultra Luxury", bedrooms: "4 BHK, Penthouses", devSize: "4 Acres", totalUnits: "80 Units", },
            { id: 7, title: "Jayabheri Grand", location: "Kothaguda, Hyderabad", price: "₹ 1.5 Cr onwards", status: "ONGOING", image: "/rejobs/project7.jpg", projectType: "Apartments", bedrooms: "3 BHK", devSize: "8 Acres", totalUnits: "400 Units", },
            { id: 8, title: "Jayabheri Residency", location: "Kondapur, Hyderabad", price: "₹ 90 Lakh onwards", status: "UNDER CONSTRUCTION", image: "/rejobs/project8.jpg", projectType: "Apartments", bedrooms: "2 BHK", devSize: "5 Acres", totalUnits: "300 Units", },
            { id: 9, title: "Jayabheri Square", location: "Banjara Hills, Hyderabad", price: "Commercial Retail", status: "READY TO MOVE", image: "/rejobs/project9.jpg", projectType: "Retail Mall", bedrooms: "NA", devSize: "3 Acres", totalUnits: "NA", },
            { id: 10, title: "Jayabheri Hills", location: "Manikonda, Hyderabad", price: "₹ 2.2 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project10.jpg", projectType: "Apartments", bedrooms: "3 BHK", devSize: "6 Acres", totalUnits: "250 Units", },
        ],
        jobs: [
            { id: 141, title: "HR Manager", location: "Hyderabad", experience: "7+ Years", salary: "₹ 10-15 LPA", categorySlug: "human-resources", },
            { id: 142, title: "Sales Head", location: "Hyderabad", experience: "15+ Years", salary: "₹ 30-50 LPA", categorySlug: "real-estate-sales", },
            { id: 143, title: "Design Manager", location: "Hyderabad", experience: "10+ Years", salary: "₹ 20-30 LPA", categorySlug: "construction-and-design", },
            { id: 144, title: "Finance Analyst", location: "Hyderabad", experience: "5+ Years", salary: "₹ 10-15 LPA", categorySlug: "finance-and-accounting", },
            { id: 145, title: "Legal Counsel", location: "Hyderabad", experience: "8+ Years", salary: "₹ 15-22 LPA", categorySlug: "legal-and-compliance", },
            { id: 146, title: "Site Supervisor", location: "Hyderabad", experience: "4+ Years", salary: "₹ 6-10 LPA", categorySlug: "construction-and-design", },
            { id: 147, title: "Digital Marketing Specialist", location: "Hyderabad", experience: "3+ Years", salary: "₹ 6-9 LPA", categorySlug: "marketing-and-pr", },
            { id: 148, title: "Customer Service Executive", location: "Hyderabad", experience: "2+ Years", salary: "₹ 4-7 LPA", categorySlug: "operations-and-management", },
            { id: 149, title: "Accounts Executive", location: "Hyderabad", experience: "2+ Years", salary: "₹ 4-6 LPA", categorySlug: "finance-and-accounting", },
            { id: 150, title: "Project Planner", location: "Hyderabad", experience: "6+ Years", salary: "₹ 10-16 LPA", categorySlug: "construction-and-design", },
        ],
        investors: [
            { id: 241, name: "Family Office Investment", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 242, name: "SBI Mutual Fund", type: "Debt Funding", stake: "Project Loan", investmentDate: "2023-02-01", },
            { id: 243, name: "ICICI Bank", type: "Term Loan", stake: "Debt", investmentDate: "2021-08-10", },
            { id: 244, name: "Private HNI 1", type: "Angel Investment", stake: "Minority", investmentDate: "2019-05-20", },
            { id: 245, name: "Private HNI 2", type: "Angel Investment", stake: "Minority", investmentDate: "2020-11-05", },
            { id: 246, name: "NBFC Partner C", type: "Debt Financing", stake: "Construction Finance", investmentDate: "2022-04-15", },
            { id: 247, name: "NBFC Partner D", type: "Debt Financing", stake: "Construction Finance", investmentDate: "2023-07-28", },
            { id: 248, name: "Promoter Family A", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 249, name: "Promoter Family B", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 250, name: "Kotak Mahindra Bank", type: "Term Loan", stake: "Debt", investmentDate: "2021-01-01", },
        ],
    },
    {
        id: 1006,
        name: "Muppa Group",
        logo: "/company/muppa.jpeg",
        industry: "Real Estate",
        location: "Hyderabad",
        established: 1991,
        email: "muppa@gmail.com",
        website: "https://www.muppaprojects.com",
        ratings: 3.7,
        projects: [
            { id: 1, title: "Muppa’s Indraprastha", location: "Tellapur, Hyderabad", price: "₹ 1.4 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project1.jpg", projectType: "Villas", bedrooms: "4 BHK", devSize: "36 Acres", totalUnits: "300 Units", },
            { id: 2, title: "Muppa’s Alankrita", location: "Nallagandla, Hyderabad", price: "₹ 85 Lakh onwards", status: "UNDER CONSTRUCTION", image: "/rejobs/project2.jpg", projectType: "Apartments", bedrooms: "2, 3 BHK", devSize: "15 Acres", totalUnits: "1000 Units", },
            { id: 3, title: "Muppa’s Panchavati", location: "Kondapur, Hyderabad", price: "₹ 1.2 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project3.jpg", projectType: "Apartments", bedrooms: "3 BHK", devSize: "10 Acres", totalUnits: "500 Units", },
            { id: 4, title: "Muppa’s Vihanga", location: "Gachibowli, Hyderabad", price: "₹ 2.5 Cr onwards", status: "NEW LAUNCH", image: "/rejobs/project4.jpg", projectType: "Luxury Apartments", bedrooms: "4 BHK", devSize: "8 Acres", totalUnits: "350 Units", },
            { id: 5, title: "Muppa’s Commercial", location: "Nanakramguda, Hyderabad", price: "Commercial Lease", status: "READY TO MOVE", image: "/rejobs/project5.jpg", projectType: "Commercial Office", bedrooms: "NA", devSize: "5 Acres", totalUnits: "NA", },
            { id: 6, title: "Muppa’s Residency", location: "Tellapur, Hyderabad", price: "₹ 90 Lakh onwards", status: "READY TO MOVE", image: "/rejobs/project6.jpg", projectType: "Apartments", bedrooms: "2 BHK", devSize: "6 Acres", totalUnits: "400 Units", },
            { id: 7, title: "Muppa’s Prime", location: "Manikonda, Hyderabad", price: "₹ 1.8 Cr onwards", status: "ONGOING", image: "/rejobs/project7.jpg", projectType: "Apartments", bedrooms: "3 BHK", devSize: "7 Acres", totalUnits: "550 Units", },
            { id: 8, title: "Muppa’s Meadows", location: "Shamshabad, Hyderabad", price: "₹ 50 Lakh onwards", status: "UNDER CONSTRUCTION", image: "/rejobs/project8.jpg", projectType: "Plots", bedrooms: "NA", devSize: "40 Acres", totalUnits: "300 Plots", },
            { id: 9, title: "Muppa’s Villas", location: "Nallagandla, Hyderabad", price: "₹ 3 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project9.jpg", projectType: "Villas", bedrooms: "4, 5 BHK", devSize: "18 Acres", totalUnits: "100 Units", },
            { id: 10, title: "Muppa’s Retail", location: "Gopanpally, Hyderabad", price: "Commercial Retail", status: "READY TO MOVE", image: "/rejobs/project10.jpg", projectType: "Retail Mall", bedrooms: "NA", devSize: "3 Acres", totalUnits: "NA", },
        ],
        jobs: [
            { id: 151, title: "Site Supervisor", location: "Tellapur, Hyderabad", experience: "4+ Years", salary: "₹ 5-8 LPA", categorySlug: "construction-and-design", },
            { id: 152, title: "Sales Executive", location: "Hyderabad", experience: "2+ Years", salary: "₹ 5-8 LPA", categorySlug: "real-estate-sales", },
            { id: 153, title: "Civil Engineer", location: "Hyderabad", experience: "5+ Years", salary: "₹ 8-12 LPA", categorySlug: "construction-and-design", },
            { id: 154, title: "Marketing Analyst", location: "Hyderabad", experience: "3+ Years", salary: "₹ 6-9 LPA", categorySlug: "marketing-and-pr", },
            { id: 155, title: "Legal Officer", location: "Hyderabad", experience: "4+ Years", salary: "₹ 7-11 LPA", categorySlug: "legal-and-compliance", },
            { id: 156, title: "Project Manager", location: "Hyderabad", experience: "12+ Years", salary: "₹ 25-35 LPA", categorySlug: "construction-and-design", },
            { id: 157, title: "HR Manager", location: "Hyderabad", experience: "7+ Years", salary: "₹ 10-15 LPA", categorySlug: "human-resources", },
            { id: 158, title: "Accounts Executive", location: "Hyderabad", experience: "1+ Years", salary: "₹ 3-5 LPA", categorySlug: "finance-and-accounting", },
            { id: 159, title: "Customer Support Executive", location: "Hyderabad", experience: "2+ Years", salary: "₹ 4-7 LPA", categorySlug: "operations-and-management", },
            { id: 160, title: "Design Architect", location: "Hyderabad", experience: "8+ Years", salary: "₹ 15-20 LPA", categorySlug: "construction-and-design", },
        ],
        investors: [
            { id: 251, name: "NBFC Project Finance", type: "Debt Funding", stake: "NA", investmentDate: "2023-01-01", },
            { id: 252, name: "Private HNI 3", type: "Angel Investment", stake: "Minority", investmentDate: "2021-06-15", },
            { id: 253, name: "Private HNI 4", type: "Angel Investment", stake: "Minority", investmentDate: "2022-11-20", },
            { id: 254, name: "Promoter Family A", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 255, name: "Promoter Family B", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 256, name: "State Bank of India", type: "Term Loan", stake: "Debt", investmentDate: "2020-03-01", },
            { id: 257, name: "HDFC Bank", type: "Term Loan", stake: "Debt", investmentDate: "2023-09-01", },
            { id: 258, name: "Retail Investor Group 3", type: "Private Placement", stake: "Minority", investmentDate: "2019-10-10", },
            { id: 259, name: "Retail Investor Group 4", type: "Private Placement", stake: "Minority", investmentDate: "2021-04-20", },
            { id: 260, name: "Local Lending Partner", type: "Debt Financing", stake: "Construction Finance", investmentDate: "2022-01-01", },
        ],
    },
    {
        id: 1007,
        name: "Prestige Group",
        logo: "/company/prestigegroup.png",
        industry: "Real Estate",
        location: "Bengaluru",
        established: 1986,
        email: "prestige@gmail.com",
        website: "https://www.prestigeconstructions.com",
        ratings: 4.2,
        projects: [
            { id: 1, title: "Prestige Shantiniketan", location: "Whitefield, Bengaluru", price: "₹ 2.7 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project1.jpg", projectType: "Township", bedrooms: "2, 3, 4 BHK", devSize: "105 Acres", totalUnits: "6000 Units", },
            { id: 2, title: "Prestige Lakeside Habitat", location: "Varthur, Bengaluru", price: "₹ 1.9 Cr onwards", status: "ONGOING", image: "/rejobs/project2.jpg", projectType: "Apartments & Villas", bedrooms: "2, 3, 4 BHK", devSize: "102 Acres", totalUnits: "3700 Units", },
            { id: 3, title: "Prestige Falcon City", location: "Kanakapura Road, Bengaluru", price: "₹ 1.5 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project3.jpg", projectType: "High-Rise", bedrooms: "2, 3 BHK", devSize: "41 Acres", totalUnits: "2500 Units", },
            { id: 4, title: "Prestige Group One", location: "Jubilee Hills, Hyderabad", price: "₹ 4 Cr onwards", status: "NEW LAUNCH", image: "/rejobs/project4.jpg", projectType: "Luxury Apartments", bedrooms: "4 BHK, Penthouses", devSize: "10 Acres", totalUnits: "300 Units", },
            { id: 5, title: "Prestige Commerce", location: "Outer Ring Road, Bengaluru", price: "Commercial Lease", status: "READY TO MOVE", image: "/rejobs/project5.jpg", projectType: "Commercial Office", bedrooms: "NA", devSize: "20 Acres", totalUnits: "NA", },
            { id: 6, title: "Prestige Jindal City", location: "Tumkur Road, Bengaluru", price: "₹ 80 Lakh onwards", status: "READY TO MOVE", image: "/rejobs/project6.jpg", projectType: "Apartments", bedrooms: "1, 2, 3 BHK", devSize: "32 Acres", totalUnits: "3500 Units", },
            { id: 7, title: "Prestige Aqua", location: "Sarjapur Road, Bengaluru", price: "₹ 1.1 Cr onwards", status: "ONGOING", image: "/rejobs/project7.jpg", projectType: "Apartments", bedrooms: "2, 3 BHK", devSize: "15 Acres", totalUnits: "1000 Units", },
            { id: 8, title: "Prestige Ascot", location: "Whitefield, Bengaluru", price: "₹ 3.5 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project8.jpg", projectType: "Villas", bedrooms: "4 BHK", devSize: "5 Acres", totalUnits: "80 Units", },
            { id: 9, title: "Prestige Forum", location: "Koramangala, Bengaluru", price: "Commercial Retail", status: "READY TO MOVE", image: "/rejobs/project9.jpg", projectType: "Retail Mall", bedrooms: "NA", devSize: "6 Acres", totalUnits: "NA", },
            { id: 10, title: "Prestige City", location: "Sarjapur Road, Bengaluru", price: "₹ 1.5 Cr onwards", status: "NEW LAUNCH", image: "/rejobs/project10.jpg", projectType: "Integrated Township", bedrooms: "2, 3, 4 BHK", devSize: "180 Acres", totalUnits: "7000 Units", },
        ],
        jobs: [
            { id: 161, title: "General Manager - Operations", location: "Bengaluru", experience: "12+ Years", salary: "₹ 30-45 LPA", categorySlug: "operations-and-management", },
            { id: 162, title: "Director of Sales (Luxury)", location: "Pan India", experience: "15+ Years", salary: "₹ 50-80 LPA", categorySlug: "real-estate-sales", },
            { id: 163, title: "Senior Quantity Surveyor", location: "Bengaluru", experience: "8+ Years", salary: "₹ 15-25 LPA", categorySlug: "construction-and-design", },
            { id: 164, title: "Head of Investor Relations", location: "Bengaluru", experience: "10+ Years", salary: "₹ 35-50 LPA", categorySlug: "finance-and-accounting", },
            { id: 165, title: "Chief Marketing Officer", location: "Bengaluru", experience: "20+ Years", salary: "₹ 80-120 LPA", categorySlug: "marketing-and-pr", },
            { id: 166, title: "Legal Head (Commercial)", location: "Bengaluru", experience: "18+ Years", salary: "₹ 50-70 LPA", categorySlug: "legal-and-compliance", },
            { id: 167, title: "Project Architect", location: "Mumbai", experience: "7+ Years", salary: "₹ 15-25 LPA", categorySlug: "construction-and-design", },
            { id: 168, title: "Leasing Executive (Retail)", location: "Hyderabad", experience: "4+ Years", salary: "₹ 8-15 LPA", categorySlug: "real-estate-sales", },
            { id: 169, title: "HR Business Partner", location: "Chennai", experience: "8+ Years", salary: "₹ 15-20 LPA", categorySlug: "human-resources", },
            { id: 170, title: "Sustainability Manager", location: "Bengaluru", experience: "6+ Years", salary: "₹ 12-18 LPA", categorySlug: "operations-and-management", },
        ],
        investors: [
            { id: 261, name: "Abu Dhabi Investment Authority (ADIA)", type: "Institutional Investor", stake: "Commercial Portfolio", investmentDate: "2024-01-01", },
            { id: 262, name: "Blackstone Group", type: "Private Equity", stake: "Commercial Portfolio", investmentDate: "2020-05-15", },
            { id: 263, name: "GIC (Singapore)", type: "Institutional Investor", stake: "Joint Venture", investmentDate: "2018-09-10", },
            { id: 264, name: "Kotak Realty Fund", type: "Private Equity", stake: "Residential Debt", investmentDate: "2021-03-20", },
            { id: 265, name: "APG (Dutch Pension Fund)", type: "Institutional Investor", stake: "Commercial JV", investmentDate: "2022-11-01", },
            { id: 266, name: "Public Shareholders A", type: "Stock Exchange", stake: "Minority", investmentDate: "NA", },
            { id: 267, name: "Public Shareholders B", type: "Stock Exchange", stake: "Minority", investmentDate: "NA", },
            { id: 268, name: "HDFC Bank", type: "Term Loan", stake: "Debt", investmentDate: "Ongoing", },
            { id: 269, name: "ICICI Prudential AMC", type: "Institutional Investor", stake: "Public Market Shareholding", investmentDate: "Ongoing", },
            { id: 270, name: "Promoter Family Holdings", type: "Internal/Private", stake: "Majority Stake", investmentDate: "NA", },
        ],
    },
    {
        id: 1008,
        name: "My Home Group.",
        logo: "/company/myhomegroup.png",
        industry: "Real Estate",
        location: "Hyderabad",
        established: 1981,
        email: "myhome@gmail.com",
        website: "https://www.myhomeconstructions.com",
        ratings: 4.0,
        projects: [
            { id: 1, title: "My Home Bhooja", location: "HITEC City, Hyderabad", price: "₹ 2.2 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project1.jpg", projectType: "Apartments", bedrooms: "3, 4 BHK", devSize: "18 Acres", totalUnits: "1200 Units", },
            { id: 2, title: "My Home Avatar", location: "Tellapur, Hyderabad", price: "₹ 1.1 Cr onwards", status: "ONGOING", image: "/rejobs/project2.jpg", projectType: "Apartments", bedrooms: "2, 3 BHK", devSize: "22 Acres", totalUnits: "2800 Units", },
            { id: 3, title: "My Home Vihanga", location: "Gopanpally, Hyderabad", price: "₹ 1.5 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project3.jpg", projectType: "Apartments", bedrooms: "3 BHK", devSize: "15 Acres", totalUnits: "900 Units", },
            { id: 4, title: "My Home Krishe", location: "Kondapur, Hyderabad", price: "₹ 2.5 Cr onwards", status: "NEW LAUNCH", image: "/rejobs/project4.jpg", projectType: "Luxury Apartments", bedrooms: "4 BHK", devSize: "10 Acres", totalUnits: "500 Units", },
            { id: 5, title: "My Home Summit", location: "Financial District, Hyderabad", price: "Commercial Lease", status: "READY TO MOVE", image: "/rejobs/project5.jpg", projectType: "Commercial Office", bedrooms: "NA", devSize: "7 Acres", totalUnits: "NA", },
            { id: 6, title: "My Home Jewel", location: "Miyapur, Hyderabad", price: "₹ 80 Lakh onwards", status: "READY TO MOVE", image: "/rejobs/project6.jpg", projectType: "Apartments", bedrooms: "2 BHK", devSize: "5 Acres", totalUnits: "300 Units", },
            { id: 7, title: "My Home Bhooja Annex", location: "HITEC City, Hyderabad", price: "₹ 3.0 Cr onwards", status: "ONGOING", image: "/rejobs/project7.jpg", projectType: "Apartments", bedrooms: "4 BHK", devSize: "10 Acres", totalUnits: "600 Units", },
            { id: 8, title: "My Home Prime", location: "Gachibowli, Hyderabad", price: "₹ 1.8 Cr onwards", status: "UNDER CONSTRUCTION", image: "/rejobs/project8.jpg", projectType: "Apartments", bedrooms: "3 BHK", devSize: "12 Acres", totalUnits: "750 Units", },
            { id: 9, title: "My Home Retail", location: "Kondapur, Hyderabad", price: "Commercial Retail", status: "READY TO MOVE", image: "/rejobs/project9.jpg", projectType: "Retail Mall", bedrooms: "NA", devSize: "3 Acres", totalUnits: "NA", },
            { id: 10, title: "My Home Grand", location: "Nallagandla, Hyderabad", price: "₹ 95 Lakh onwards", status: "ONGOING", image: "/rejobs/project10.jpg", projectType: "Apartments", bedrooms: "2 BHK", devSize: "6 Acres", totalUnits: "450 Units", },
        ],
        jobs: [
            { id: 171, title: "Quantity Surveyor", location: "Hyderabad", experience: "5+ Years", salary: "₹ 8-12 LPA", categorySlug: "construction-and-design", },
            { id: 172, title: "Senior Sales Executive", location: "Hyderabad", experience: "5+ Years", salary: "₹ 10-15 LPA", categorySlug: "real-estate-sales", },
            { id: 173, title: "Civil Engineer", location: "Hyderabad", experience: "5+ Years", salary: "₹ 8-12 LPA", categorySlug: "construction-and-design", },
            { id: 174, title: "Marketing Analyst", location: "Hyderabad", experience: "3+ Years", salary: "₹ 6-9 LPA", categorySlug: "marketing-and-pr", },
            { id: 175, title: "Legal Officer", location: "Hyderabad", experience: "4+ Years", salary: "₹ 7-11 LPA", categorySlug: "legal-and-compliance", },
            { id: 176, title: "Project Manager", location: "Hyderabad", experience: "12+ Years", salary: "₹ 25-35 LPA", categorySlug: "construction-and-design", },
            { id: 177, title: "HR Manager", location: "Hyderabad", experience: "7+ Years", salary: "₹ 10-15 LPA", categorySlug: "human-resources", },
            { id: 178, title: "Accounts Executive", location: "Hyderabad", experience: "1+ Years", salary: "₹ 3-5 LPA", categorySlug: "finance-and-accounting", },
            { id: 179, title: "Customer Support Executive", location: "Hyderabad", experience: "2+ Years", salary: "₹ 4-7 LPA", categorySlug: "operations-and-management", },
            { id: 180, title: "Design Architect", location: "Hyderabad", experience: "8+ Years", salary: "₹ 15-20 LPA", categorySlug: "construction-and-design", },
        ],
        investors: [
            { id: 271, name: "Company Reserves", type: "Self-Funded", stake: "100%", investmentDate: "NA", },
            { id: 272, name: "HDFC Bank", type: "Term Loan", stake: "Debt", investmentDate: "2023-01-01", },
            { id: 273, name: "ICICI Bank", type: "Term Loan", stake: "Debt", investmentDate: "2021-08-10", },
            { id: 274, name: "NBFC Partner X", type: "Debt Financing", stake: "Construction Finance", investmentDate: "2022-04-15", },
            { id: 275, name: "NBFC Partner Y", type: "Debt Financing", stake: "Construction Finance", investmentDate: "2023-07-28", },
            { id: 276, name: "Promoter Family A", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 277, name: "Promoter Family B", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 278, name: "Retail Investor Group 1", type: "Private Placement", stake: "Minority", investmentDate: "2019-10-10", },
            { id: 279, name: "Retail Investor Group 2", type: "Private Placement", stake: "Minority", investmentDate: "2021-04-20", },
            { id: 280, name: "State Bank of India", type: "Term Loan", stake: "Debt", investmentDate: "2020-03-01", },
        ],
    },
    {
        id: 1009,
        name: "Radhey Properties",
        logo: "/company/radhey.jpg",
        industry: "Real Estate",
        location: "Hyderabad",
        established: 1997,
        email: "radhey@gmail.com",
        website: "https://www.radheyconstructions.com",
        ratings: 3.6,
        projects: [
            { id: 1, title: "Radhey Pride", location: "Gachibowli, Hyderabad", price: "₹ 1.3 Cr onwards", status: "UNDER CONSTRUCTION", image: "/rejobs/project1.jpg", projectType: "Apartments", bedrooms: "2, 3 BHK", devSize: "10 Acres", totalUnits: "700 Units", },
            { id: 2, title: "Radhey Galaxy", location: "Kokapet, Hyderabad", price: "₹ 1.8 Cr onwards", status: "NEW LAUNCH", image: "/rejobs/project2.jpg", projectType: "Luxury Apartments", bedrooms: "3, 4 BHK", devSize: "12 Acres", totalUnits: "900 Units", },
            { id: 3, title: "Radhey Residency", location: "Tellapur, Hyderabad", price: "₹ 90 Lakh onwards", status: "READY TO MOVE", image: "/rejobs/project3.jpg", projectType: "Apartments", bedrooms: "2 BHK", devSize: "8 Acres", totalUnits: "600 Units", },
            { id: 4, title: "Radhey Prime", location: "Manikonda, Hyderabad", price: "₹ 1.5 Cr onwards", status: "ONGOING", image: "/rejobs/project4.jpg", projectType: "Apartments", bedrooms: "3 BHK", devSize: "7 Acres", totalUnits: "500 Units", },
            { id: 5, title: "Radhey Commercial", location: "Kondapur, Hyderabad", price: "Commercial Lease", status: "READY TO MOVE", image: "/rejobs/project5.jpg", projectType: "Commercial Office", bedrooms: "NA", devSize: "5 Acres", totalUnits: "NA", },
            { id: 6, title: "Radhey Towers", location: "Nallagandla, Hyderabad", price: "₹ 1.1 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project6.jpg", projectType: "Apartments", bedrooms: "2, 3 BHK", devSize: "6 Acres", totalUnits: "450 Units", },
            { id: 7, title: "Radhey Villas", location: "Gopanpally, Hyderabad", price: "₹ 3.5 Cr onwards", status: "ONGOING", image: "/rejobs/project7.jpg", projectType: "Villas", bedrooms: "4 BHK", devSize: "15 Acres", totalUnits: "100 Units", },
            { id: 8, title: "Radhey Elite", location: "Financial District, Hyderabad", price: "₹ 2.5 Cr onwards", status: "UNDER CONSTRUCTION", image: "/rejobs/project8.jpg", projectType: "Luxury Apartments", bedrooms: "4 BHK", devSize: "9 Acres", totalUnits: "400 Units", },
            { id: 9, title: "Radhey Retail", location: "Gachibowli, Hyderabad", price: "Commercial Retail", status: "READY TO MOVE", image: "/rejobs/project9.jpg", projectType: "Retail Mall", bedrooms: "NA", devSize: "4 Acres", totalUnits: "NA", },
            { id: 10, title: "Radhey Square", location: "Miyapur, Hyderabad", price: "₹ 80 Lakh onwards", status: "ONGOING", image: "/rejobs/project10.jpg", projectType: "Apartments", bedrooms: "2 BHK", devSize: "5 Acres", totalUnits: "350 Units", },
        ],
        jobs: [
            { id: 181, title: "Sales Head", location: "Hyderabad", experience: "10+ Years", salary: "₹ 25-35 LPA", categorySlug: "real-estate-sales", },
            { id: 182, title: "Project Architect", location: "Hyderabad", experience: "8+ Years", salary: "₹ 15-20 LPA", categorySlug: "construction-and-design", },
            { id: 183, title: "Sales Executive", location: "Hyderabad", experience: "2+ Years", salary: "₹ 5-8 LPA", categorySlug: "real-estate-sales", },
            { id: 184, title: "Marketing Analyst", location: "Hyderabad", experience: "3+ Years", salary: "₹ 6-9 LPA", categorySlug: "marketing-and-pr", },
            { id: 185, title: "Legal Officer", location: "Hyderabad", experience: "4+ Years", salary: "₹ 7-11 LPA", categorySlug: "legal-and-compliance", },
            { id: 186, title: "Project Manager", location: "Hyderabad", experience: "12+ Years", salary: "₹ 25-35 LPA", categorySlug: "construction-and-design", },
            { id: 187, title: "HR Manager", location: "Hyderabad", experience: "7+ Years", salary: "₹ 10-15 LPA", categorySlug: "human-resources", },
            { id: 188, title: "Accounts Executive", location: "Hyderabad", experience: "1+ Years", salary: "₹ 3-5 LPA", categorySlug: "finance-and-accounting", },
            { id: 189, title: "Customer Support Executive", location: "Hyderabad", experience: "2+ Years", salary: "₹ 4-7 LPA", categorySlug: "operations-and-management", },
            { id: 190, title: "Civil Engineer", location: "Hyderabad", experience: "5+ Years", salary: "₹ 8-12 LPA", categorySlug: "construction-and-design", },
        ],
        investors: [
            { id: 281, name: "Family Trust", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 282, name: "Private HNI 5", type: "Angel Investment", stake: "Minority", investmentDate: "2020-05-01", },
            { id: 283, name: "Private HNI 6", type: "Angel Investment", stake: "Minority", investmentDate: "2021-12-10", },
            { id: 284, name: "NBFC Partner C", type: "Debt Financing", stake: "Construction Finance", investmentDate: "2022-04-15", },
            { id: 285, name: "NBFC Partner D", type: "Debt Financing", stake: "Construction Finance", investmentDate: "2023-07-28", },
            { id: 286, name: "Promoter Family A", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 287, name: "Promoter Family B", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 288, name: "Retail Investor Group 5", type: "Private Placement", stake: "Minority", investmentDate: "2019-10-10", },
            { id: 289, name: "Retail Investor Group 6", type: "Private Placement", stake: "Minority", investmentDate: "2021-04-20", },
            { id: 290, name: "Axis Bank", type: "Term Loan", stake: "Debt", investmentDate: "2020-03-01", },
        ],
    },
    {
        id: 1010,
        name: "Rajpushpa Group",
        logo: "/company/rajpushpagroup.jpg",
        industry: "Real Estate",
        location: "Hyderabad",
        established: 2006,
        email: "rajpushpa@gmail.com",
        website: "https://www.rajpushpagroup.com",
        ratings: 3.9,
        projects: [
            { id: 1, title: "Rajpushpa Atria", location: "Kokapet, Hyderabad", price: "₹ 1.6 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project1.jpg", projectType: "Apartments", bedrooms: "3, 4 BHK", devSize: "15 Acres", totalUnits: "1100 Units", },
            { id: 2, title: "Rajpushpa Serene Dale", location: "Tellapur, Hyderabad", price: "₹ 90 Lakh onwards", status: "UNDER CONSTRUCTION", image: "/rejobs/project2.jpg", projectType: "Apartments", bedrooms: "2, 3 BHK", devSize: "10 Acres", totalUnits: "850 Units", },
            { id: 3, title: "Rajpushpa Regalia", location: "Gachibowli, Hyderabad", price: "₹ 2.2 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project3.jpg", projectType: "Luxury Apartments", bedrooms: "4 BHK", devSize: "12 Acres", totalUnits: "700 Units", },
            { id: 4, title: "Rajpushpa Casa Luxura", location: "Nanakramguda, Hyderabad", price: "₹ 3.5 Cr onwards", status: "NEW LAUNCH", image: "/rejobs/project4.jpg", projectType: "Villas", bedrooms: "5 BHK", devSize: "20 Acres", totalUnits: "150 Units", },
            { id: 5, title: "Rajpushpa Commercial Tower", location: "Kondapur, Hyderabad", price: "Commercial Lease", status: "READY TO MOVE", image: "/rejobs/project5.jpg", projectType: "Commercial Office", bedrooms: "NA", devSize: "8 Acres", totalUnits: "NA", },
            { id: 6, title: "Rajpushpa Residency", location: "Miyapur, Hyderabad", price: "₹ 80 Lakh onwards", status: "READY TO MOVE", image: "/rejobs/project6.jpg", projectType: "Apartments", bedrooms: "2 BHK", devSize: "6 Acres", totalUnits: "400 Units", },
            { id: 7, title: "Rajpushpa Prime", location: "Manikonda, Hyderabad", price: "₹ 1.4 Cr onwards", status: "ONGOING", image: "/rejobs/project7.jpg", projectType: "Apartments", bedrooms: "3 BHK", devSize: "7 Acres", totalUnits: "500 Units", },
            { id: 8, title: "Rajpushpa Elite", location: "Financial District, Hyderabad", price: "₹ 2.8 Cr onwards", status: "UNDER CONSTRUCTION", image: "/rejobs/project8.jpg", projectType: "Luxury Apartments", bedrooms: "4 BHK", devSize: "10 Acres", totalUnits: "450 Units", },
            { id: 9, title: "Rajpushpa Galleria", location: "Kokapet, Hyderabad", price: "Commercial Retail", status: "READY TO MOVE", image: "/rejobs/project9.jpg", projectType: "Retail Mall", bedrooms: "NA", devSize: "5 Acres", totalUnits: "NA", },
            { id: 10, title: "Rajpushpa Heights", location: "Gachibowli, Hyderabad", price: "₹ 1.2 Cr onwards", status: "ONGOING", image: "/rejobs/project10.jpg", projectType: "Apartments", bedrooms: "2, 3 BHK", devSize: "8 Acres", totalUnits: "600 Units", },
        ],
        jobs: [
            { id: 191, title: "Customer Relationship Manager", location: "Hyderabad", experience: "4+ Years", salary: "₹ 7-10 LPA", categorySlug: "real-estate-sales", },
            { id: 192, title: "Sales Executive", location: "Hyderabad", experience: "2+ Years", salary: "₹ 5-8 LPA", categorySlug: "real-estate-sales", },
            { id: 193, title: "Civil Engineer", location: "Hyderabad", experience: "5+ Years", salary: "₹ 8-12 LPA", categorySlug: "construction-and-design", },
            { id: 194, title: "Marketing Analyst", location: "Hyderabad", experience: "3+ Years", salary: "₹ 6-9 LPA", categorySlug: "marketing-and-pr", },
            { id: 195, title: "Legal Officer", location: "Hyderabad", experience: "4+ Years", salary: "₹ 7-11 LPA", categorySlug: "legal-and-compliance", },
            { id: 196, title: "Project Manager", location: "Hyderabad", experience: "12+ Years", salary: "₹ 25-35 LPA", categorySlug: "construction-and-design", },
            { id: 197, title: "HR Manager", location: "Hyderabad", experience: "7+ Years", salary: "₹ 10-15 LPA", categorySlug: "human-resources", },
            { id: 198, title: "Accounts Executive", location: "Hyderabad", experience: "1+ Years", salary: "₹ 3-5 LPA", categorySlug: "finance-and-accounting", },
            { id: 199, title: "Customer Support Executive", location: "Hyderabad", experience: "2+ Years", salary: "₹ 4-7 LPA", categorySlug: "operations-and-management", },
            { id: 200, title: "Design Architect", location: "Hyderabad", experience: "8+ Years", salary: "₹ 15-20 LPA", categorySlug: "construction-and-design", },
        ],
        investors: [
            { id: 291, name: "Private Investment", type: "Private Equity", stake: "Undisclosed", investmentDate: "2018-06-01", },
            { id: 292, name: "Private HNI 7", type: "Angel Investment", stake: "Minority", investmentDate: "2020-05-01", },
            { id: 293, name: "Private HNI 8", type: "Angel Investment", stake: "Minority", investmentDate: "2021-12-10", },
            { id: 294, name: "NBFC Partner E", type: "Debt Financing", stake: "Construction Finance", investmentDate: "2022-04-15", },
            { id: 295, name: "NBFC Partner F", type: "Debt Financing", stake: "Construction Finance", investmentDate: "2023-07-28", },
            { id: 296, name: "Promoter Family A", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 297, name: "Promoter Family B", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 298, name: "Retail Investor Group 7", type: "Private Placement", stake: "Minority", investmentDate: "2019-10-10", },
            { id: 299, name: "Retail Investor Group 8", type: "Private Placement", stake: "Minority", investmentDate: "2021-04-20", },
            { id: 300, name: "State Bank of India", type: "Term Loan", stake: "Debt", investmentDate: "2020-03-01", },
        ],
    },
    {
        id: 1011,
        name: "NCC Ltd.",
        logo: "/company/ncc.jpg",
        industry: "Infrastructure & Real Estate",
        location: "Hyderabad",
        established: 1978,
        email: "ncc@gmail.com",
        website: "https://www.ncclimited.com",
        ratings: 4.1,
        projects: [
            { id: 1, title: "NCC Urban One", location: "Narsingi, Hyderabad", price: "₹ 1.9 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project1.jpg", projectType: "Apartments", bedrooms: "3, 4 BHK", devSize: "32 Acres", totalUnits: "1200 Units", },
            { id: 2, title: "NCC Nagarjuna Residency", location: "Gachibowli, Hyderabad", price: "₹ 1.4 Cr onwards", status: "ONGOING", image: "/rejobs/project2.jpg", projectType: "Apartments", bedrooms: "2, 3 BHK", devSize: "15 Acres", totalUnits: "1000 Units", },
            { id: 3, title: "NCC Urban Garden", location: "Tellapur, Hyderabad", price: "₹ 1.1 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project3.jpg", projectType: "Apartments", bedrooms: "3 BHK", devSize: "10 Acres", totalUnits: "650 Units", },
            { id: 4, title: "NCC Urban Vistas", location: "Miyapur, Hyderabad", price: "₹ 90 Lakh onwards", status: "UNDER CONSTRUCTION", image: "/rejobs/project4.jpg", projectType: "Apartments", bedrooms: "2 BHK", devSize: "8 Acres", totalUnits: "500 Units", },
            { id: 5, title: "NCC Commercial Complex", location: "Kondapur, Hyderabad", price: "Commercial Lease", status: "READY TO MOVE", image: "/rejobs/project5.jpg", projectType: "Commercial Office", bedrooms: "NA", devSize: "6 Acres", totalUnits: "NA", },
            { id: 6, title: "NCC Urban Towers", location: "Financial District, Hyderabad", price: "₹ 2.5 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project6.jpg", projectType: "Luxury Apartments", bedrooms: "4 BHK", devSize: "12 Acres", totalUnits: "750 Units", },
            { id: 7, title: "NCC Prime", location: "Gachibowli, Hyderabad", price: "₹ 1.8 Cr onwards", status: "ONGOING", image: "/rejobs/project7.jpg", projectType: "Apartments", bedrooms: "3 BHK", devSize: "9 Acres", totalUnits: "550 Units", },
            { id: 8, title: "NCC Grand", location: "Nallagandla, Hyderabad", price: "₹ 95 Lakh onwards", status: "UNDER CONSTRUCTION", image: "/rejobs/project8.jpg", projectType: "Apartments", bedrooms: "2 BHK", devSize: "7 Acres", totalUnits: "400 Units", },
            { id: 9, title: "NCC Retail Mall", location: "Narsingi, Hyderabad", price: "Commercial Retail", status: "READY TO MOVE", image: "/rejobs/project9.jpg", projectType: "Retail Mall", bedrooms: "NA", devSize: "4 Acres", totalUnits: "NA", },
            { id: 10, title: "NCC Signature", location: "Hi-Tech City, Hyderabad", price: "₹ 3.0 Cr onwards", status: "ONGOING", image: "/rejobs/project10.jpg", projectType: "Luxury Apartments", bedrooms: "4 BHK", devSize: "10 Acres", totalUnits: "600 Units", },
        ],
        jobs: [
            { id: 201, title: "Contracts Manager", location: "Hyderabad", experience: "10+ Years", salary: "₹ 20-30 LPA", categorySlug: "construction-and-design", },
            { id: 202, title: "Project Manager (Infrastructure)", location: "Pan India", experience: "15+ Years", salary: "₹ 35-50 LPA", categorySlug: "construction-and-design", },
            { id: 203, title: "Civil Engineer", location: "Hyderabad", experience: "5+ Years", salary: "₹ 8-12 LPA", categorySlug: "construction-and-design", },
            { id: 204, title: "Sales Executive", location: "Hyderabad", experience: "2+ Years", salary: "₹ 5-8 LPA", categorySlug: "real-estate-sales", },
            { id: 205, title: "Legal Counsel", location: "Hyderabad", experience: "8+ Years", salary: "₹ 15-22 LPA", categorySlug: "legal-and-compliance", },
            { id: 206, title: "Finance Analyst", location: "Hyderabad", experience: "5+ Years", salary: "₹ 10-15 LPA", categorySlug: "finance-and-accounting", },
            { id: 207, title: "HR Manager", location: "Hyderabad", experience: "7+ Years", salary: "₹ 10-15 LPA", categorySlug: "human-resources", },
            { id: 208, title: "Marketing Analyst", location: "Hyderabad", experience: "3+ Years", salary: "₹ 6-9 LPA", categorySlug: "marketing-and-pr", },
            { id: 209, title: "Customer Support Executive", location: "Hyderabad", experience: "2+ Years", salary: "₹ 4-7 LPA", categorySlug: "operations-and-management", },
            { id: 210, title: "Site Supervisor", location: "Hyderabad", experience: "4+ Years", salary: "₹ 6-10 LPA", categorySlug: "construction-and-design", },
        ],
        investors: [
            { id: 301, name: "Publicly Listed", type: "Stock Exchange", stake: "NA", investmentDate: "NA", },
            { id: 302, name: "LIC", type: "Institutional Investor", stake: "Public Market Shareholding", investmentDate: "Ongoing", },
            { id: 303, name: "SBI Mutual Fund", type: "Institutional Investor", stake: "Public Market Shareholding", investmentDate: "Ongoing", },
            { id: 304, name: "IDBI Bank", type: "Term Loan", stake: "Debt", investmentDate: "2023-01-01", },
            { id: 305, name: "Axis Bank", type: "Term Loan", stake: "Debt", investmentDate: "2021-08-10", },
            { id: 306, name: "Promoter Family A", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 307, name: "Promoter Family B", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 308, name: "Retail Investor Group 9", type: "Private Placement", stake: "Minority", investmentDate: "2019-10-10", },
            { id: 309, name: "Retail Investor Group 10", type: "Private Placement", stake: "Minority", investmentDate: "2021-04-20", },
            { id: 310, name: "NBFC Partner G", type: "Debt Financing", stake: "Construction Finance", investmentDate: "2022-04-15", },
        ],
    },
    {
        id: 1012,
        name: "Ramkey Group",
        logo: "/company/ramkeygroup.jpg",
        industry: "Real Estate",
        location: "Hyderabad",
        established: 1994,
        email: "ramkey@gmail.com",
        website: "https://www.ramkyestates.com",
        ratings: 3.7,
        projects: [
            { id: 1, title: "Ramky One Galaxia", location: "Nallagandla, Hyderabad", price: "₹ 1.2 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project1.jpg", projectType: "Apartments", bedrooms: "2, 3 BHK", devSize: "8 Acres", totalUnits: "750 Units", },
            { id: 2, title: "Ramky Towers", location: "Gachibowli, Hyderabad", price: "₹ 1.8 Cr onwards", status: "ONGOING", image: "/rejobs/project2.jpg", projectType: "High-Rise", bedrooms: "3 BHK", devSize: "10 Acres", totalUnits: "600 Units", },
            { id: 3, title: "Ramky Prime", location: "Tellapur, Hyderabad", price: "₹ 95 Lakh onwards", status: "READY TO MOVE", image: "/rejobs/project3.jpg", projectType: "Apartments", bedrooms: "2 BHK", devSize: "7 Acres", totalUnits: "500 Units", },
            { id: 4, title: "Ramky Vista", location: "Manikonda, Hyderabad", price: "₹ 1.5 Cr onwards", status: "NEW LAUNCH", image: "/rejobs/project4.jpg", projectType: "Apartments", bedrooms: "3 BHK", devSize: "9 Acres", totalUnits: "450 Units", },
            { id: 5, title: "Ramky Commercial", location: "Financial District, Hyderabad", price: "Commercial Lease", status: "READY TO MOVE", image: "/rejobs/project5.jpg", projectType: "Commercial Office", bedrooms: "NA", devSize: "5 Acres", totalUnits: "NA", },
            { id: 6, title: "Ramky Grand", location: "Miyapur, Hyderabad", price: "₹ 80 Lakh onwards", status: "READY TO MOVE", image: "/rejobs/project6.jpg", projectType: "Apartments", bedrooms: "2 BHK", devSize: "6 Acres", totalUnits: "400 Units", },
            { id: 7, title: "Ramky Signature", location: "Gachibowli, Hyderabad", price: "₹ 2.2 Cr onwards", status: "ONGOING", image: "/rejobs/project7.jpg", projectType: "Luxury Apartments", bedrooms: "4 BHK", devSize: "12 Acres", totalUnits: "650 Units", },
            { id: 8, title: "Ramky Villas", location: "Kompally, Hyderabad", price: "₹ 3 Cr onwards", status: "UNDER CONSTRUCTION", image: "/rejobs/project8.jpg", projectType: "Villas", bedrooms: "4 BHK", devSize: "15 Acres", totalUnits: "100 Units", },
            { id: 9, title: "Ramky Retail", location: "Nallagandla, Hyderabad", price: "Commercial Retail", status: "READY TO MOVE", image: "/rejobs/project9.jpg", projectType: "Retail Mall", bedrooms: "NA", devSize: "4 Acres", totalUnits: "NA", },
            { id: 10, title: "Ramky Heights", location: "Tellapur, Hyderabad", price: "₹ 1.1 Cr onwards", status: "ONGOING", image: "/rejobs/project10.jpg", projectType: "Apartments", bedrooms: "2, 3 BHK", devSize: "8 Acres", totalUnits: "550 Units", },
        ],
        jobs: [
            { id: 211, title: "Legal Advisor", location: "Hyderabad", experience: "8+ Years", salary: "₹ 15-20 LPA", categorySlug: "legal-and-compliance", },
            { id: 212, title: "Sales Executive", location: "Hyderabad", experience: "2+ Years", salary: "₹ 5-8 LPA", categorySlug: "real-estate-sales", },
            { id: 213, title: "Civil Engineer", location: "Hyderabad", experience: "5+ Years", salary: "₹ 8-12 LPA", categorySlug: "construction-and-design", },
            { id: 214, title: "Marketing Analyst", location: "Hyderabad", experience: "3+ Years", salary: "₹ 6-9 LPA", categorySlug: "marketing-and-pr", },
            { id: 215, title: "Finance Analyst", location: "Hyderabad", experience: "5+ Years", salary: "₹ 10-15 LPA", categorySlug: "finance-and-accounting", },
            { id: 216, title: "Project Manager", location: "Hyderabad", experience: "12+ Years", salary: "₹ 25-35 LPA", categorySlug: "construction-and-design", },
            { id: 217, title: "HR Manager", location: "Hyderabad", experience: "7+ Years", salary: "₹ 10-15 LPA", categorySlug: "human-resources", },
            { id: 218, title: "Accounts Executive", location: "Hyderabad", experience: "1+ Years", salary: "₹ 3-5 LPA", categorySlug: "finance-and-accounting", },
            { id: 219, title: "Customer Support Executive", location: "Hyderabad", experience: "2+ Years", salary: "₹ 4-7 LPA", categorySlug: "operations-and-management", },
            { id: 220, title: "Site Supervisor", location: "Hyderabad", experience: "4+ Years", salary: "₹ 6-10 LPA", categorySlug: "construction-and-design", },
        ],
        investors: [
            { id: 311, name: "Institutional Debt", type: "Financial Institution", stake: "NA", investmentDate: "2022-09-01", },
            { id: 312, name: "Private HNI 9", type: "Angel Investment", stake: "Minority", investmentDate: "2020-05-01", },
            { id: 313, name: "Private HNI 10", type: "Angel Investment", stake: "Minority", investmentDate: "2021-12-10", },
            { id: 314, name: "NBFC Partner H", type: "Debt Financing", stake: "Construction Finance", investmentDate: "2022-04-15", },
            { id: 315, name: "NBFC Partner I", type: "Debt Financing", stake: "Construction Finance", investmentDate: "2023-07-28", },
            { id: 316, name: "Promoter Family A", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 317, name: "Promoter Family B", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 318, name: "Retail Investor Group 11", type: "Private Placement", stake: "Minority", investmentDate: "2019-10-10", },
            { id: 319, name: "Retail Investor Group 12", type: "Private Placement", stake: "Minority", investmentDate: "2021-04-20", },
            { id: 320, name: "ICICI Bank", type: "Term Loan", stake: "Debt", investmentDate: "2020-03-01", },
        ],
    },
    {
        id: 1013,
        name: "Lodha Group",
        logo: "/company/lodha.jpg",
        industry: "Real Estate",
        location: "Mumbai",
        established: 1980,
        email: "lodha@gmail.com",
        website: "https://www.lodhagroup.com",
        ratings: 4.2,
        projects: [
            { id: 1, title: "Lodha World Towers", location: "Lower Parel, Mumbai", price: "₹ 5 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project1.jpg", projectType: "Luxury High-Rise", bedrooms: "3, 4 BHK", devSize: "17 Acres", totalUnits: "900 Units", },
            { id: 2, title: "Lodha Amara", location: "Thane, Mumbai", price: "₹ 1 Cr onwards", status: "ONGOING", image: "/rejobs/project2.jpg", projectType: "Apartments", bedrooms: "1, 2, 3 BHK", devSize: "40 Acres", totalUnits: "5000 Units", },
            { id: 3, title: "Lodha Altamount", location: "Altamount Road, Mumbai", price: "₹ 15 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project3.jpg", projectType: "Ultra Luxury", bedrooms: "4 BHK, Duplex", devSize: "1.5 Acres", totalUnits: "40 Units", },
            { id: 4, title: "Lodha Palava City", location: "Dombivli, Mumbai", price: "₹ 40 Lakh onwards", status: "READY TO MOVE", image: "/rejobs/project4.jpg", projectType: "Integrated Township", bedrooms: "1, 2, 3 BHK", devSize: "4500 Acres", totalUnits: "NA", },
            { id: 5, title: "Lodha The Park", location: "Worli, Mumbai", price: "₹ 8 Cr onwards", status: "ONGOING", image: "/rejobs/project5.jpg", projectType: "Luxury High-Rise", bedrooms: "2, 3, 4 BHK", devSize: "17 Acres", totalUnits: "2000 Units", },
            { id: 6, title: "Lodha Belmondo", location: "Pune-Mumbai Expressway", price: "₹ 1.5 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project6.jpg", projectType: "Resort Residences", bedrooms: "2, 3 BHK, Villas", devSize: "100 Acres", totalUnits: "500 Units", },
            { id: 7, title: "Lodha World One", location: "Lower Parel, Mumbai", price: "₹ 12 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project7.jpg", projectType: "Ultra Luxury Tower", bedrooms: "4 BHK, Duplex", devSize: "NA", totalUnits: "NA", },
            { id: 8, title: "Lodha Sterling", location: "Thane, Mumbai", price: "₹ 2.0 Cr onwards", status: "UNDER CONSTRUCTION", image: "/rejobs/project8.jpg", projectType: "Luxury Apartments", bedrooms: "3, 4 BHK", devSize: "10 Acres", totalUnits: "500 Units", },
            { id: 9, title: "Lodha Offices", location: "Andheri, Mumbai", price: "Commercial Lease", status: "READY TO MOVE", image: "/rejobs/project9.jpg", projectType: "Commercial Office", bedrooms: "NA", devSize: "5 Acres", totalUnits: "NA", },
            { id: 10, title: "Lodha Retails", location: "Thane, Mumbai", price: "Commercial Retail", status: "READY TO MOVE", image: "/rejobs/project10.jpg", projectType: "Retail Mall", bedrooms: "NA", devSize: "4 Acres", totalUnits: "NA", },
        ],
        jobs: [
            { id: 221, title: "Architectural Designer", location: "Mumbai", experience: "5+ Years", salary: "₹ 12-18 LPA", categorySlug: "construction-and-design", },
            { id: 222, title: "Senior Sales Manager (Mumbai)", location: "Mumbai", experience: "10+ Years", salary: "₹ 25-35 LPA", categorySlug: "real-estate-sales", },
            { id: 223, title: "Township Manager", location: "Palava City", experience: "15+ Years", salary: "₹ 40-60 LPA", categorySlug: "operations-and-management", },
            { id: 224, title: "VP Finance", location: "Mumbai", experience: "20+ Years", salary: "₹ 70-100 LPA", categorySlug: "finance-and-accounting", },
            { id: 225, title: "Legal Head", location: "Mumbai", experience: "15+ Years", salary: "₹ 50-70 LPA", categorySlug: "legal-and-compliance", },
            { id: 226, title: "Marketing Executive", location: "Mumbai", experience: "3+ Years", salary: "₹ 6-9 LPA", categorySlug: "marketing-and-pr", },
            { id: 227, title: "Project Engineer", location: "Pune", experience: "6+ Years", salary: "₹ 10-16 LPA", categorySlug: "construction-and-design", },
            { id: 228, title: "HR Business Partner", location: "Mumbai", experience: "8+ Years", salary: "₹ 15-20 LPA", categorySlug: "human-resources", },
            { id: 229, title: "CRM Manager", location: "Mumbai", experience: "7+ Years", salary: "₹ 12-18 LPA", categorySlug: "real-estate-sales", },
            { id: 230, title: "Site Supervisor", location: "Mumbai", experience: "4+ Years", salary: "₹ 6-10 LPA", categorySlug: "construction-and-design", },
        ],
        investors: [
            { id: 321, name: "Goldman Sachs", type: "Investment Bank", stake: "Undisclosed", investmentDate: "2017-04-01", },
            { id: 322, name: "JP Morgan", type: "Investment Bank", stake: "Project Specific Debt", investmentDate: "2021-02-20", },
            { id: 323, name: "Piramal Enterprises", type: "Financial Services", stake: "Debt Financing", investmentDate: "2022-09-01", },
            { id: 324, name: "HDFC Mutual Fund", type: "Institutional Investor", stake: "Public Market Shareholding", investmentDate: "Ongoing", },
            { id: 325, name: "ICICI Prudential AMC", type: "Institutional Investor", stake: "Public Market Shareholding", investmentDate: "Ongoing", },
            { id: 326, name: "Promoter Family A", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 327, name: "Promoter Family B", type: "Internal/Private", stake: "NA", investmentDate: "NA", },
            { id: 328, name: "Retail Investor Group 13", type: "Private Placement", stake: "Minority", investmentDate: "2019-10-10", },
            { id: 329, name: "Retail Investor Group 14", type: "Private Placement", stake: "Minority", investmentDate: "2021-04-20", },
            { id: 330, name: "Axis Bank", type: "Term Loan", stake: "Debt", investmentDate: "2020-03-01", },
        ],
    },
    {
        id: 1014,
        name: "Phoenix Mills",
        logo: "/company/images.jpeg",
        industry: "Real Estate & Retail",
        location: "Mumbai",
        established: 1905,
        email: "phoenix@gmail.com",
        website: "https://www.thephoenixmills.com",
        ratings: 4.0,
        projects: [
            { id: 1, title: "Phoenix Marketcity", location: "Kurla, Mumbai", price: "₹ 2 Cr onwards", status: "READY TO MOVE", image: "/rejobs/project1.jpg", projectType: "Retail & Commercial", bedrooms: "NA", devSize: "20 Acres", totalUnits: "500+ Units", },
            { id: 2, title: "Phoenix Palladium", location: "Lower Parel, Mumbai", price: "₹ 3 Cr onwards", status: "ONGOING", image: "/rejobs/project2.jpg", projectType: "Luxury Retail & Offices", bedrooms: "NA", devSize: "15 Acres", totalUnits: "400+ Units", },
            { id: 3, title: "Phoenix Marketcity (Pune)", location: "Viman Nagar, Pune", price: "Retail Lease", status: "READY TO MOVE", image: "/rejobs/project3.jpg", projectType: "Retail Mall", bedrooms: "NA", devSize: "14 Acres", totalUnits: "NA", },
            { id: 4, title: "Phoenix Citadel (Indore)", location: "Indore", price: "Retail Lease", status: "READY TO MOVE", image: "/rejobs/project4.jpg", projectType: "Retail Mall", bedrooms: "NA", devSize: "10 Acres", totalUnits: "NA", },
            { id: 5, title: "Phoenix Marketcity (Bengaluru)", location: "Whitefield, Bengaluru", price: "Retail Lease", status: "READY TO MOVE", image: "/rejobs/project5.jpg", projectType: "Retail Mall", bedrooms: "NA", devSize: "10 Acres", totalUnits: "NA", },
            { id: 6, title: "Phoenix Marketcity (Chennai)", location: "Velachery, Chennai", price: "Retail Lease", status: "READY TO MOVE", image: "/rejobs/project6.jpg", projectType: "Retail Mall", bedrooms: "NA", devSize: "8 Acres", totalUnits: "NA", },
            { id: 7, title: "Phoenix Offices (Mumbai)", location: "Lower Parel, Mumbai", price: "Commercial Lease", status: "READY TO MOVE", image: "/rejobs/project7.jpg", projectType: "Commercial Office", bedrooms: "NA", devSize: "5 Acres", totalUnits: "NA", },
            { id: 8, title: "Phoenix Residences", location: "Lower Parel, Mumbai", price: "₹ 7 Cr onwards", status: "NEW LAUNCH", image: "/rejobs/project8.jpg", projectType: "Luxury Apartments", bedrooms: "3, 4 BHK", devSize: "3 Acres", totalUnits: "150 Units", },
            { id: 9, title: "Phoenix Warehousing", location: "Panvel, Mumbai", price: "Industrial Lease", status: "READY TO MOVE", image: "/rejobs/project9.jpg", projectType: "Logistics", bedrooms: "NA", devSize: "50 Acres", totalUnits: "NA", },
            { id: 10, title: "Phoenix Expansion (Pune)", location: "Viman Nagar, Pune", price: "Retail Lease", status: "UNDER CONSTRUCTION", image: "/rejobs/project10.jpg", projectType: "Retail Mall Expansion", bedrooms: "NA", devSize: "5 Acres", totalUnits: "NA", },
        ],
        jobs: [
            { id: 231, title: "Mall Manager", location: "Mumbai", experience: "8+ Years", salary: "₹ 20-30 LPA", categorySlug: "operations-and-management", },
            { id: 232, title: "Leasing Manager (Retail)", location: "Pune", experience: "7+ Years", salary: "₹ 15-25 LPA", categorySlug: "real-estate-sales", },
            { id: 233, title: "Head of Security (Pan India)", location: "Mumbai", experience: "15+ Years", salary: "₹ 30-45 LPA", categorySlug: "operations-and-management", },
            { id: 234, title: "Property Accountant", location: "Mumbai", experience: "5+ Years", salary: "₹ 10-15 LPA", categorySlug: "finance-and-accounting", },
            { id: 235, title: "Digital Marketing Specialist", location: "Bengaluru", experience: "4+ Years", salary: "₹ 8-12 LPA", categorySlug: "marketing-and-pr", },
            { id: 236, title: "Project Manager (Retail Fitout)", location: "Chennai", experience: "10+ Years", salary: "₹ 25-35 LPA", categorySlug: "construction-and-design", },
            { id: 237, title: "HR Business Partner", location: "Mumbai", experience: "8+ Years", salary: "₹ 15-20 LPA", categorySlug: "human-resources", },
            { id: 238, title: "Tenant Relations Executive", location: "Mumbai", experience: "3+ Years", salary: "₹ 6-10 LPA", categorySlug: "operations-and-management", },
            { id: 239, title: "Legal Counsel (Leasing)", location: "Mumbai", experience: "6+ Years", salary: "₹ 12-18 LPA", categorySlug: "legal-and-compliance", },
            { id: 240, title: "Facilities Manager", location: "Indore", experience: "7+ Years", salary: "₹ 10-15 LPA", categorySlug: "operations-and-management", },
        ],
        investors: [
            { id: 331, name: "CPPIB (Canada Pension Plan)", type: "Institutional Investor", stake: "Joint Venture", investmentDate: "2020-07-01", },
            { id: 332, name: "GIC (Singapore)", type: "Institutional Investor", stake: "Commercial Portfolio", investmentDate: "2018-05-15", },
            { id: 333, name: "APG (Dutch Pension Fund)", type: "Institutional Investor", stake: "Commercial Joint Venture", investmentDate: "2022-11-01", },
            { id: 334, name: "Morgan Stanley Real Estate", type: "Private Equity", stake: "Office Portfolio", investmentDate: "2021-03-20", },
            { id: 335, name: "Standard Chartered Bank", type: "Debt Financing", stake: "Loan", investmentDate: "2023-01-15", },
            { id: 336, name: "Public Shareholders A", type: "Stock Exchange", stake: "Minority", investmentDate: "NA", },
            { id: 337, name: "Public Shareholders B", type: "Stock Exchange", stake: "Minority", investmentDate: "NA", },
            { id: 338, name: "HDFC Mutual Fund", type: "Institutional Investor", stake: "Public Market Shareholding", investmentDate: "Ongoing", },
            { id: 339, name: "ICICI Bank", type: "Term Loan", stake: "Debt", investmentDate: "2020-03-01", },
            { id: 340, name: "Promoter Family Holdings", type: "Internal/Private", stake: "Majority Stake", investmentDate: "NA", },
        ],
    },
];

export const topRecruiters = [
    { id: 1001, name: "DLF Ltd.", logo: "/company/dlf.png" },
    { id: 1002, name: "Honer Properties", logo: "/company/honer.jpg" },
    { id: 1003, name: "Brigade Group", logo: "/company/brigade.jpeg" },
    { id: 1004, name: "Cyber City.", logo: "/company/cybercity.jpg" },
    { id: 1005, name: "Jayabheri Properties", logo: "/company/jayabheri.jpg" },
    { id: 1006, name: "Muppa Group", logo: "/company/muppa.jpeg" },
    { id: 1007, name: "Prestige Group", logo: "/company/prestigegroup.png" },
    { id: 1008, name: "My Home Group.", logo: "/company/myhomegroup.png" },
    { id: 1009, name: "Radhey Properties", logo: "/company/radhey.jpg" },
    { id: 1010, name: "Rajpushpa Group", logo: "/company/rajpushpagroup.jpg" },
    { id: 1011, name: "NCC Ltd.", logo: "/company/ncc.jpg" },
    { id: 1012, name: "Ramkey Group", logo: "/company/ramkeygroup.jpg" },
    { id: 1013, name: "Lodha Group", logo: "/company/lodha.jpg" },
    { id: 1014, name: "Phoenix Mills", logo: "/company/images.jpeg" },
];

function getRandomCompany() {
    const randomIndex = Math.floor(Math.random() * topRecruiters.length);
    return topRecruiters[randomIndex];
}

export const jobCategories = [
    {
        icon: "/icons/cp.png",
        title: "Channel Partners",
        description: "Collaborate & Earn",
        jobs: [
            { title: "Channel Partner Manager", location: "Mumbai", type: "Full-time", salary: "₹8-10 LPA", experience: "3+ Years", company: getRandomCompany() },
            { title: "Business Associate", location: "Delhi NCR", type: "Part-time", salary: "₹4-6 LPA", experience: "2+ Years", company: getRandomCompany() },
            { title: "Franchise Partner", location: "Bangalore", type: "Full-time", salary: "Commission Based", experience: "5+ Years", company: getRandomCompany() },
            { title: "Regional Partner Lead", location: "Hyderabad", type: "Full-time", salary: "₹12-15 LPA", experience: "7+ Years", company: getRandomCompany() },
            { title: "Field Sales Executive", location: "Chennai", type: "Full-time", salary: "₹3-4 LPA", experience: "1+ Year", company: getRandomCompany() },
            { title: "Channel Growth Specialist", location: "Kolkata", type: "Part-time", salary: "₹6-8 LPA", experience: "4+ Years", company: getRandomCompany() },
            { title: "Partnership Associate", location: "Pune", type: "Part-time", salary: "₹15,000/mo", experience: "Fresher", company: getRandomCompany() },
            { title: "Affiliate Manager", location: "Ahmedabad", type: "Full-time", salary: "₹5-7 LPA", experience: "3+ Years", company: getRandomCompany() },
            { title: "Business Development Partner", location: "Jaipur", type: "Full-time", salary: "₹6-9 LPA", experience: "4+ Years", company: getRandomCompany() },
            { title: "Channel Strategy Analyst", location: "Noida", type: "Full-time", salary: "₹8-11 LPA", experience: "5+ Years", company: getRandomCompany() },
        ],
    },
    {
        icon: "/icons/hrandop.png",
        title: "HR & Operations",
        description: "People & Process",
        jobs: [
            { title: "HR Executive", location: "Mumbai", type: "Full-time", salary: "₹3-4 LPA", experience: "1+ Year", company: getRandomCompany() },
            { title: "Operations Manager", location: "Delhi NCR", type: "Full-time", salary: "₹8-10 LPA", experience: "5+ Years", company: getRandomCompany() },
            { title: "Recruitment Specialist", location: "Bangalore", type: "Part-time", salary: "₹4-6 LPA", experience: "2+ Years", company: getRandomCompany() },
            { title: "Training & Development Lead", location: "Hyderabad", type: "Full-time", salary: "₹6-9 LPA", experience: "3+ Years", company: getRandomCompany() },
            { title: "Compensation Analyst", location: "Chennai", type: "Full-time", salary: "₹5-7 LPA", experience: "2+ Years", company: getRandomCompany() },
            { title: "HR Intern", location: "Kolkata", type: "Part-time", salary: "₹12,000/mo", experience: "Fresher", company: getRandomCompany() },
            { title: "Payroll Specialist", location: "Pune", type: "Full-time", salary: "₹4-6 LPA", experience: "3+ Years", company: getRandomCompany() },
            { title: "Employee Relations Officer", location: "Jaipur", type: "Full-time", salary: "₹6-8 LPA", experience: "4+ Years", company: getRandomCompany() },
            { title: "Workforce Planner", location: "Ahmedabad", type: "Full-time", salary: "₹7-9 LPA", experience: "5+ Years", company: getRandomCompany() },
            { title: "HR Business Partner", location: "Noida", type: "Full-time", salary: "₹10-12 LPA", experience: "6+ Years", company: getRandomCompany() },
        ],
    },
    {
        icon: "/icons/realestate.png",
        title: "Real Estate Sales",
        description: "Sell Property Faster",
        jobs: [
            { title: "Sales Executive", location: "Mumbai", type: "Full-time", salary: "₹3-5 LPA", experience: "1+ Year", company: getRandomCompany() },
            { title: "Property Consultant", location: "Delhi NCR", type: "Full-time", salary: "₹4-6 LPA", experience: "2+ Years", company: getRandomCompany() },
            { title: "Real Estate Broker", location: "Bangalore", type: "Part-time", salary: "Commission Based", experience: "3+ Years", company: getRandomCompany() },
            { title: "Business Development Manager", location: "Hyderabad", type: "Full-time", salary: "₹7-9 LPA", experience: "4+ Years", company: getRandomCompany() },
            { title: "Sales Associate", location: "Chennai", type: "Part-time", salary: "₹15,000/mo", experience: "Fresher", company: getRandomCompany() },
            { title: "Luxury Property Advisor", location: "Kolkata", type: "Full-time", salary: "₹8-12 LPA", experience: "5+ Years", company: getRandomCompany() },
            { title: "Channel Sales Executive", location: "Pune", type: "Full-time", salary: "₹5-7 LPA", experience: "3+ Years", company: getRandomCompany() },
            { title: "Lead Conversion Specialist", location: "Jaipur", type: "Full-time", salary: "₹6-8 LPA", experience: "4+ Years", company: getRandomCompany() },
            { title: "Commercial Property Manager", location: "Ahmedabad", type: "Full-time", salary: "₹10-14 LPA", experience: "6+ Years", company: getRandomCompany() },
            { title: "Residential Sales Officer", location: "Noida", type: "Full-time", salary: "₹4-6 LPA", experience: "2+ Years", company: getRandomCompany() },
        ],
    },
    {
        icon: "/icons/tel.png",
        title: "Tele Caller",
        description: "Engage & Convert",
        jobs: [
            { title: "Telecaller Executive", location: "Mumbai", type: "Full-time", salary: "₹2-3 LPA", experience: "Fresher", company: getRandomCompany() },
            { title: "Outbound Calling Agent", location: "Delhi NCR", type: "Part-time", salary: "₹18,000/mo", experience: "1+ Year", company: getRandomCompany() },
            { title: "Customer Service Caller", location: "Bangalore", type: "Full-time", salary: "₹3-4 LPA", experience: "2+ Years", company: getRandomCompany() },
            { title: "Lead Generation Caller", location: "Hyderabad", type: "Full-time", salary: "₹3-4 LPA", experience: "2+ Years", company: getRandomCompany() },
            { title: "Inbound Call Specialist", location: "Chennai", type: "Full-time", salary: "₹2.5-3.5 LPA", experience: "1+ Year", company: getRandomCompany() },
            { title: "Call Center Associate", location: "Kolkata", type: "Part-time", salary: "₹12,000/mo", experience: "Fresher", company: getRandomCompany() },
            { title: "Client Support Caller", location: "Pune", type: "Full-time", salary: "₹3-4 LPA", experience: "2+ Years", company: getRandomCompany() },
            { title: "Tele Sales Executive", location: "Jaipur", type: "Full-time", salary: "₹3-5 LPA", experience: "2+ Years", company: getRandomCompany() },
            { title: "Cold Calling Specialist", location: "Ahmedabad", type: "Full-time", salary: "₹4-5 LPA", experience: "3+ Years", company: getRandomCompany() },
            { title: "Voice Process Agent", location: "Noida", type: "Full-time", salary: "₹2.5-3.5 LPA", experience: "Fresher", company: getRandomCompany() },
        ],
    },
    {
        icon: "/icons/digital.png",
        title: "Digital Marketing",
        description: "Promote & Convert",
        jobs: [
            { title: "SEO Specialist", location: "Mumbai", type: "Full-time", salary: "₹4-6 LPA", experience: "2+ Years", company: getRandomCompany() },
            { title: "Social Media Manager", location: "Delhi NCR", type: "Full-time", salary: "₹6-8 LPA", experience: "3+ Years", company: getRandomCompany() },
            { title: "Content Strategist", location: "Bangalore", type: "Full-time", salary: "₹5-7 LPA", experience: "3+ Years", company: getRandomCompany() },
            { title: "PPC Campaign Manager", location: "Hyderabad", type: "Full-time", salary: "₹7-9 LPA", experience: "4+ Years", company: getRandomCompany() },
            { title: "Email Marketing Executive", location: "Chennai", type: "Full-time", salary: "₹3-5 LPA", experience: "2+ Years", company: getRandomCompany() },
            { title: "Digital Marketing Intern", location: "Kolkata", type: "Part-time", salary: "₹15,000/mo", experience: "Fresher", company: getRandomCompany() },
            { title: "Analytics Specialist", location: "Pune", type: "Full-time", salary: "₹6-8 LPA", experience: "3+ Years", company: getRandomCompany() },
            { title: "Affiliate Marketing Manager", location: "Jaipur", type: "Full-time", salary: "₹8-10 LPA", experience: "4+ Years", company: getRandomCompany() },
            { title: "Performance Marketer", location: "Ahmedabad", type: "Full-time", salary: "₹7-9 LPA", experience: "5+ Years", company: getRandomCompany() },
            { title: "Brand Strategist", location: "Noida", type: "Full-time", salary: "₹9-12 LPA", experience: "6+ Years", company: getRandomCompany() },
        ],
    },
    {
        icon: "/icons/webdev.png",
        title: "Web Development",
        description: "Build Real Estate Tech",
        jobs: [
            { title: "Frontend Developer", location: "Mumbai", type: "Full-time", salary: "₹6-8 LPA", experience: "2+ Years", company: getRandomCompany() },
            { title: "Backend Developer", location: "Delhi NCR", type: "Full-time", salary: "₹7-9 LPA", experience: "3+ Years", company: getRandomCompany() },
            { title: "Full Stack Developer", location: "Bangalore", type: "Full-time", salary: "₹8-10 LPA", experience: "4+ Years", company: getRandomCompany() },
            { title: "UI/UX Designer", location: "Hyderabad", type: "Full-time", salary: "₹5-7 LPA", experience: "2+ Years", company: getRandomCompany() },
            { title: "React Developer", location: "Chennai", type: "Full-time", salary: "₹6-8 LPA", experience: "2+ Years", company: getRandomCompany() },
            { title: "Web Development Intern", location: "Kolkata", type: "Part-time", salary: "₹15,000/mo", experience: "Fresher", company: getRandomCompany() },
            { title: "Node.js Developer", location: "Pune", type: "Full-time", salary: "₹7-9 LPA", experience: "3+ Years", company: getRandomCompany() },
            { title: "DevOps Engineer", location: "Jaipur", type: "Full-time", salary: "₹9-11 LPA", experience: "5+ Years", company: getRandomCompany() },
            { title: "WordPress Developer", location: "Ahmedabad", type: "Full-time", salary: "₹5-7 LPA", experience: "2+ Years", company: getRandomCompany() },
            { title: "Software Architect", location: "Noida", type: "Full-time", salary: "₹12-15 LPA", experience: "7+ Years", company: getRandomCompany() },
        ],
    },
    {
        icon: "/icons/crm.png",
        title: "CRM Executive",
        description: "Manage Client Relations",
        jobs: [
            { title: "CRM Executive", location: "Mumbai", type: "Full-time", salary: "₹4-6 LPA", experience: "2+ Years", company: getRandomCompany() },
            { title: "Client Relationship Manager", location: "Delhi NCR", type: "Full-time", salary: "₹6-8 LPA", experience: "3+ Years", company: getRandomCompany() },
            { title: "Customer Success Associate", location: "Bangalore", type: "Full-time", salary: "₹5-7 LPA", experience: "2+ Years", company: getRandomCompany() },
            { title: "CRM Analyst", location: "Hyderabad", type: "Full-time", salary: "₹6-9 LPA", experience: "4+ Years", company: getRandomCompany() },
            { title: "Customer Support Officer", location: "Chennai", type: "Full-time", salary: "₹3-5 LPA", experience: "1+ Year", company: getRandomCompany() },
            { title: "CRM Intern", location: "Kolkata", type: "Part-time", salary: "₹12,000/mo", experience: "Fresher", company: getRandomCompany() },
            { title: "Account Manager", location: "Pune", type: "Full-time", salary: "₹7-9 LPA", experience: "3+ Years", company: getRandomCompany() },
            { title: "Client Engagement Specialist", location: "Jaipur", type: "Full-time", salary: "₹6-8 LPA", experience: "4+ Years", company: getRandomCompany() },
            { title: "CRM Lead", location: "Ahmedabad", type: "Full-time", salary: "₹8-10 LPA", experience: "5+ Years", company: getRandomCompany() },
            { title: "Relationship Officer", location: "Noida", type: "Full-time", salary: "₹5-7 LPA", experience: "2+ Years", company: getRandomCompany() },
        ],
    },
    {
        icon: "/icons/accounts.png",
        title: "Accounts & Auditing",
        description: "Ensure Financial Clarity",
        jobs: [
            { title: "Accounts Executive", location: "Mumbai", type: "Full-time", salary: "₹3-5 LPA", experience: "1+ Year", company: getRandomCompany() },
            { title: "Auditor", location: "Delhi NCR", type: "Full-time", salary: "₹6-8 LPA", experience: "3+ Years", company: getRandomCompany() },
            { title: "Finance Analyst", location: "Bangalore", type: "Full-time", salary: "₹7-9 LPA", experience: "3+ Years", company: getRandomCompany() },
            { title: "Taxation Officer", location: "Hyderabad", type: "Full-time", salary: "₹6-8 LPA", experience: "2+ Years", company: getRandomCompany() },
            { title: "Accounts Payable Specialist", location: "Chennai", type: "Full-time", salary: "₹4-6 LPA", experience: "2+ Years", company: getRandomCompany() },
            { title: "Accounts Intern", location: "Kolkata", type: "Part-time", salary: "₹12,000/mo", experience: "Fresher", company: getRandomCompany() },
            { title: "Chartered Accountant", location: "Pune", type: "Full-time", salary: "₹10-12 LPA", experience: "5+ Years", company: getRandomCompany() },
            { title: "Internal Auditor", location: "Jaipur", type: "Full-time", salary: "₹8-10 LPA", experience: "4+ Years", company: getRandomCompany() },
            { title: "Cost Accountant", location: "Ahmedabad", type: "Full-time", salary: "₹7-9 LPA", experience: "3+ Years", company: getRandomCompany() },
            { title: "Financial Controller", location: "Noida", type: "Full-time", salary: "₹12-15 LPA", experience: "7+ Years", company: getRandomCompany() },
        ],
    },
    {
        icon: '/icons/architects.png',
        title: 'Architects',
        description: 'Design Smart & Aesthetic Spaces',
        jobs: [],
    },
    {
        icon: '/icons/legal.png',
        title: 'Legal',
        description: 'Safeguard Deals & Compliance',
        description: "Ensure Financial Clarity",
        jobs: [],
    },
];


// Generate dummy candidates
export const candidatesData = [
    {
        "id": 1,
        "name": "Noah Davis",
        "location": "Mumbai",
        "image": "https://randomuser.me/api/portraits/women/93.jpg",
        "category": "Channel Partners",
        "title": "Channel Partners - Mumbai",
        "email": "noah.davis@example.com",
        "ratings": 3.5,
        "summary": "Experienced Channel Partners with proven track record in channel partners and related projects.",
        "ratings": 3.5,
        "projects": [
            {
                "name": "Partner Portal",
                "description": "Worked on Partner Portal for improving business outcomes."
            },
            {
                "name": "Sales Dashboard",
                "description": "Worked on Sales Dashboard for improving business outcomes."
            },
            {
                "name": "Affiliate Tracker",
                "description": "Worked on Affiliate Tracker for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Channel Management",
                "description": "Provides channel management services."
            },
            {
                "name": "Partner Training",
                "description": "Provides partner training services."
            },
            {
                "name": "Marketing Support",
                "description": "Provides marketing support services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Affiliate Campaign",
                "platform": "Facebook",
                "status": "Scheduled",
                "budget": "$7695",
                "impressions": "225073+",
                "clicks": "4530",
                "conversionRate": "8%",
                "startDate": "2024-03-01",
                "endDate": "2024-11-28",
                "description": "Campaign Affiliate Campaign targeting Channel Partners candidates."
            },
            {
                "id": 2,
                "campaignName": "Partner Onboarding Campaign",
                "platform": "YouTube",
                "status": "Scheduled",
                "budget": "$471",
                "impressions": "387140+",
                "clicks": "6405",
                "conversionRate": "2%",
                "startDate": "2024-00-01",
                "endDate": "2024-09-28",
                "description": "Campaign Partner Onboarding Campaign targeting Channel Partners candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "Channel Manager",
                "company": "Amazon",
                "status": "Interview Scheduled"
            },
            {
                "jobTitle": "Partner Executive",
                "company": "Flipkart",
                "status": "Interview Scheduled"
            }
        ],
        "education": [
            {
                "degree": "MBA in Marketing",
                "board": "IIM Bangalore",
                "years": "1 - 5"
            },
            {
                "degree": "BBA",
                "board": "Delhi University",
                "years": "7 - 1"
            }
        ],
        "experience": [
            {
                "company": "SalesForce",
                "location": "Mumbai",
                "role": "Channel Partners",
                "startDate": "4-07",
                "endDate": "5-05",
                "description": "Worked at SalesForce as Channel Partners contributing to projects and growth."
            },
            {
                "company": "HubSpot",
                "location": "Mumbai",
                "role": "Channel Partners",
                "startDate": "1-01",
                "endDate": "6-08",
                "description": "Worked at HubSpot as Channel Partners contributing to projects and growth."
            },
            {
                "company": "Zoho",
                "location": "Mumbai",
                "role": "Channel Partners",
                "startDate": "0-06",
                "endDate": "0-08",
                "description": "Worked at Zoho as Channel Partners contributing to projects and growth."
            }
        ]
    },
    {
        "id": 2,
        "name": "Noah Miller",
        "location": "Hyderabad",
        "image": "https://randomuser.me/api/portraits/men/14.jpg",
        "category": "Channel Partners",
        "title": "Channel Partners - Hyderabad",
        "email": "noah.miller@example.com",
        "summary": "Experienced Channel Partners with proven track record in channel partners and related projects.",
        "ratings": 2.7,
        "projects": [
            {
                "name": "Partner Portal",
                "description": "Worked on Partner Portal for improving business outcomes."
            },
            {
                "name": "Sales Dashboard",
                "description": "Worked on Sales Dashboard for improving business outcomes."
            },
            {
                "name": "Affiliate Tracker",
                "description": "Worked on Affiliate Tracker for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Channel Management",
                "description": "Provides channel management services."
            },
            {
                "name": "Partner Training",
                "description": "Provides partner training services."
            },
            {
                "name": "Marketing Support",
                "description": "Provides marketing support services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Affiliate Campaign",
                "platform": "LinkedIn",
                "status": "Active",
                "budget": "$3311",
                "impressions": "92395+",
                "clicks": "8324",
                "conversionRate": "7%",
                "startDate": "2024-05-01",
                "endDate": "2024-00-28",
                "description": "Campaign Affiliate Campaign targeting Channel Partners candidates."
            },
            {
                "id": 2,
                "campaignName": "Partner Onboarding Campaign",
                "platform": "LinkedIn",
                "status": "Completed",
                "budget": "$7047",
                "impressions": "465416+",
                "clicks": "9616",
                "conversionRate": "7%",
                "startDate": "2024-06-01",
                "endDate": "2024-10-28",
                "description": "Campaign Partner Onboarding Campaign targeting Channel Partners candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "Channel Manager",
                "company": "Amazon",
                "status": "Hired"
            },
            {
                "jobTitle": "Partner Executive",
                "company": "Flipkart",
                "status": "Interview Scheduled"
            }
        ],
        "education": [
            {
                "degree": "MBA in Marketing",
                "board": "IIM Bangalore",
                "years": "6 - 1"
            },
            {
                "degree": "BBA",
                "board": "Delhi University",
                "years": "7 - 4"
            }
        ],
        "experience": [
            {
                "company": "SalesForce",
                "location": "Hyderabad",
                "role": "Channel Partners",
                "startDate": "5-09",
                "endDate": "4-11",
                "description": "Worked at SalesForce as Channel Partners contributing to projects and growth."
            },
            {
                "company": "HubSpot",
                "location": "Hyderabad",
                "role": "Channel Partners",
                "startDate": "4-04",
                "endDate": "4-11",
                "description": "Worked at HubSpot as Channel Partners contributing to projects and growth."
            },
            {
                "company": "Zoho",
                "location": "Hyderabad",
                "role": "Channel Partners",
                "startDate": "6-07",
                "endDate": "3-06",
                "description": "Worked at Zoho as Channel Partners contributing to projects and growth."
            }
        ]
    },
    {
        "id": 3,
        "name": "Emma Smith",
        "location": "Bangalore",
        "image": "https://randomuser.me/api/portraits/women/33.jpg",
        "category": "HR & Operations",
        "title": "HR & Operations - Bangalore",
        "email": "emma.smith@example.com",
        "summary": "Experienced HR & Operations with proven track record in hr & operations and related projects.",
        "ratings": 2.5,
        "projects": [
            {
                "name": "Employee Onboarding Tool",
                "description": "Worked on Employee Onboarding Tool for improving business outcomes."
            },
            {
                "name": "Attendance Tracker",
                "description": "Worked on Attendance Tracker for improving business outcomes."
            },
            {
                "name": "Payroll System",
                "description": "Worked on Payroll System for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "HR Management",
                "description": "Provides hr management services."
            },
            {
                "name": "Recruitment",
                "description": "Provides recruitment services."
            },
            {
                "name": "Process Optimization",
                "description": "Provides process optimization services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "HR Branding Campaign",
                "platform": "Facebook",
                "status": "Active",
                "budget": "$456",
                "impressions": "559746+",
                "clicks": "5919",
                "conversionRate": "4%",
                "startDate": "2024-11-01",
                "endDate": "2024-10-28",
                "description": "Campaign HR Branding Campaign targeting HR & Operations candidates."
            },
            {
                "id": 2,
                "campaignName": "Employee Engagement Campaign",
                "platform": "LinkedIn",
                "status": "Scheduled",
                "budget": "$1250",
                "impressions": "367466+",
                "clicks": "834",
                "conversionRate": "0%",
                "startDate": "2024-07-01",
                "endDate": "2024-10-28",
                "description": "Campaign Employee Engagement Campaign targeting HR & Operations candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "HR Manager",
                "company": "Infosys",
                "status": "Applied"
            },
            {
                "jobTitle": "Operations Lead",
                "company": "TCS",
                "status": "Applied"
            }
        ],
        "education": [
            {
                "degree": "MBA in HR",
                "board": "XLRI",
                "years": "2 - 2"
            },
            {
                "degree": "BBA",
                "board": "Delhi University",
                "years": "8 - 5"
            }
        ],
        "experience": [
            {
                "company": "Infosys",
                "location": "Bangalore",
                "role": "HR & Operations",
                "startDate": "5-03",
                "endDate": "4-10",
                "description": "Worked at Infosys as HR & Operations contributing to projects and growth."
            },
            {
                "company": "TCS",
                "location": "Bangalore",
                "role": "HR & Operations",
                "startDate": "6-11",
                "endDate": "6-07",
                "description": "Worked at TCS as HR & Operations contributing to projects and growth."
            },
            {
                "company": "Wipro",
                "location": "Bangalore",
                "role": "HR & Operations",
                "startDate": "3-10",
                "endDate": "3-01",
                "description": "Worked at Wipro as HR & Operations contributing to projects and growth."
            }
        ]
    },
    {
        "id": 4,
        "name": "Mason Miller",
        "location": "Mumbai",
        "image": "https://randomuser.me/api/portraits/women/30.jpg",
        "category": "HR & Operations",
        "title": "HR & Operations - Mumbai",
        "email": "mason.miller@example.com",
        "summary": "Experienced HR & Operations with proven track record in hr & operations and related projects.",
        "ratings": 3.1,
        "projects": [
            {
                "name": "Employee Onboarding Tool",
                "description": "Worked on Employee Onboarding Tool for improving business outcomes."
            },
            {
                "name": "Attendance Tracker",
                "description": "Worked on Attendance Tracker for improving business outcomes."
            },
            {
                "name": "Payroll System",
                "description": "Worked on Payroll System for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "HR Management",
                "description": "Provides hr management services."
            },
            {
                "name": "Recruitment",
                "description": "Provides recruitment services."
            },
            {
                "name": "Process Optimization",
                "description": "Provides process optimization services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "HR Branding Campaign",
                "platform": "Instagram",
                "status": "Scheduled",
                "budget": "$2721",
                "impressions": "651121+",
                "clicks": "387",
                "conversionRate": "9%",
                "startDate": "2024-08-01",
                "endDate": "2024-05-28",
                "description": "Campaign HR Branding Campaign targeting HR & Operations candidates."
            },
            {
                "id": 2,
                "campaignName": "Employee Engagement Campaign",
                "platform": "LinkedIn",
                "status": "Completed",
                "budget": "$6372",
                "impressions": "470202+",
                "clicks": "8649",
                "conversionRate": "7%",
                "startDate": "2024-10-01",
                "endDate": "2024-07-28",
                "description": "Campaign Employee Engagement Campaign targeting HR & Operations candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "HR Manager",
                "company": "Infosys",
                "status": "Hired"
            },
            {
                "jobTitle": "Operations Lead",
                "company": "TCS",
                "status": "Hired"
            }
        ],
        "education": [
            {
                "degree": "MBA in HR",
                "board": "XLRI",
                "years": "2 - 4"
            },
            {
                "degree": "BBA",
                "board": "Delhi University",
                "years": "1 - 6"
            }
        ],
        "experience": [
            {
                "company": "Infosys",
                "location": "Mumbai",
                "role": "HR & Operations",
                "startDate": "4-08",
                "endDate": "5-05",
                "description": "Worked at Infosys as HR & Operations contributing to projects and growth."
            },
            {
                "company": "TCS",
                "location": "Mumbai",
                "role": "HR & Operations",
                "startDate": "1-04",
                "endDate": "4-04",
                "description": "Worked at TCS as HR & Operations contributing to projects and growth."
            },
            {
                "company": "Wipro",
                "location": "Mumbai",
                "role": "HR & Operations",
                "startDate": "6-01",
                "endDate": "1-04",
                "description": "Worked at Wipro as HR & Operations contributing to projects and growth."
            }
        ]
    },
    {
        "id": 5,
        "name": "Liam Jones",
        "location": "Pune",
        "image": "https://randomuser.me/api/portraits/women/84.jpg",
        "category": "HR & Operations",
        "title": "HR & Operations - Pune",
        "email": "liam.jones@example.com",
        "summary": "Experienced HR & Operations with proven track record in hr & operations and related projects.",
        "ratings": 4.5,
        "projects": [
            {
                "name": "Employee Onboarding Tool",
                "description": "Worked on Employee Onboarding Tool for improving business outcomes."
            },
            {
                "name": "Attendance Tracker",
                "description": "Worked on Attendance Tracker for improving business outcomes."
            },
            {
                "name": "Payroll System",
                "description": "Worked on Payroll System for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "HR Management",
                "description": "Provides hr management services."
            },
            {
                "name": "Recruitment",
                "description": "Provides recruitment services."
            },
            {
                "name": "Process Optimization",
                "description": "Provides process optimization services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "HR Branding Campaign",
                "platform": "YouTube",
                "status": "Scheduled",
                "budget": "$4775",
                "impressions": "781418+",
                "clicks": "1435",
                "conversionRate": "1%",
                "startDate": "2024-11-01",
                "endDate": "2024-02-28",
                "description": "Campaign HR Branding Campaign targeting HR & Operations candidates."
            },
            {
                "id": 2,
                "campaignName": "Employee Engagement Campaign",
                "platform": "Instagram",
                "status": "Scheduled",
                "budget": "$2300",
                "impressions": "589243+",
                "clicks": "9814",
                "conversionRate": "1%",
                "startDate": "2024-09-01",
                "endDate": "2024-02-28",
                "description": "Campaign Employee Engagement Campaign targeting HR & Operations candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "HR Manager",
                "company": "Infosys",
                "status": "Hired"
            },
            {
                "jobTitle": "Operations Lead",
                "company": "TCS",
                "status": "Hired"
            }
        ],
        "education": [
            {
                "degree": "MBA in HR",
                "board": "XLRI",
                "years": "1 - 6"
            },
            {
                "degree": "BBA",
                "board": "Delhi University",
                "years": "5 - 4"
            }
        ],
        "experience": [
            {
                "company": "Infosys",
                "location": "Pune",
                "role": "HR & Operations",
                "startDate": "4-02",
                "endDate": "3-02",
                "description": "Worked at Infosys as HR & Operations contributing to projects and growth."
            },
            {
                "company": "TCS",
                "location": "Pune",
                "role": "HR & Operations",
                "startDate": "6-00",
                "endDate": "5-00",
                "description": "Worked at TCS as HR & Operations contributing to projects and growth."
            },
            {
                "company": "Wipro",
                "location": "Pune",
                "role": "HR & Operations",
                "startDate": "0-10",
                "endDate": "6-06",
                "description": "Worked at Wipro as HR & Operations contributing to projects and growth."
            }
        ]
    },
    {
        "id": 6,
        "name": "Ethan Johnson",
        "location": "Delhi NCR",
        "image": "https://randomuser.me/api/portraits/men/1.jpg",
        "category": "Real Estate Sales",
        "title": "Real Estate Sales - Delhi",
        "email": "ethan.johnson@example.com",
        "summary": "Experienced Real Estate Sales with proven track record in real estate sales and related projects.",
        "ratings": 4.1,
        "projects": [
            {
                "name": "Property Listing Portal",
                "description": "Worked on Property Listing Portal for improving business outcomes."
            },
            {
                "name": "Lead Management System",
                "description": "Worked on Lead Management System for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Property Sales",
                "description": "Provides property sales services."
            },
            {
                "name": "Client Consultation",
                "description": "Provides client consultation services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Property Launch Campaign",
                "platform": "Instagram",
                "status": "Completed",
                "budget": "$1762",
                "impressions": "871112+",
                "clicks": "427",
                "conversionRate": "0%",
                "startDate": "2024-06-01",
                "endDate": "2024-07-28",
                "description": "Campaign Property Launch Campaign targeting Real Estate Sales candidates."
            },
            {
                "id": 2,
                "campaignName": "Open House Campaign",
                "platform": "Instagram",
                "status": "Active",
                "budget": "$8898",
                "impressions": "538735+",
                "clicks": "7844",
                "conversionRate": "0%",
                "startDate": "2024-06-01",
                "endDate": "2024-09-28",
                "description": "Campaign Open House Campaign targeting Real Estate Sales candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "Sales Executive",
                "company": "Housing.com",
                "status": "Applied"
            },
            {
                "jobTitle": "Real Estate Agent",
                "company": "MagicBricks",
                "status": "Applied"
            }
        ],
        "education": [
            {
                "degree": "BBA in Marketing",
                "board": "NMIMS",
                "years": "5 - 1"
            },
            {
                "degree": "Diploma in Real Estate",
                "years": "1 - 2"
            }
        ],
        "experience": [
            {
                "company": "Housing.com",
                "location": "Delhi NCR",
                "role": "Real Estate Sales",
                "startDate": "4-03",
                "endDate": "1-08",
                "description": "Worked at Housing.com as Real Estate Sales contributing to projects and growth."
            },
            {
                "company": "MagicBricks",
                "location": "Delhi NCR",
                "role": "Real Estate Sales",
                "startDate": "5-03",
                "endDate": "5-11",
                "description": "Worked at MagicBricks as Real Estate Sales contributing to projects and growth."
            },
            {
                "company": "99Acres",
                "location": "Delhi NCR",
                "role": "Real Estate Sales",
                "startDate": "3-04",
                "endDate": "2-10",
                "description": "Worked at 99Acres as Real Estate Sales contributing to projects and growth."
            }
        ]
    },
    {
        "id": 7,
        "name": "Liam Robin",
        "location": "Mumbai",
        "image": "https://randomuser.me/api/portraits/men/97.jpg",
        "category": "Tele Caller",
        "title": "Tele Caller - Mumbai",
        "email": "liam.robin@example.com",
        "summary": "Experienced Tele Caller with proven track record in tele caller and related projects.",
        "ratings": 1.5,
        "projects": [
            {
                "name": "Call Tracking System",
                "description": "Worked on Call Tracking System for improving business outcomes."
            },
            {
                "name": "CRM Integration",
                "description": "Worked on CRM Integration for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Lead Generation",
                "description": "Provides lead generation services."
            },
            {
                "name": "Follow-ups",
                "description": "Provides follow-ups services."
            },
            {
                "name": "Client Engagement",
                "description": "Provides client engagement services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Cold Calling Campaign",
                "platform": "LinkedIn",
                "status": "Scheduled",
                "budget": "$3518",
                "impressions": "888760+",
                "clicks": "9689",
                "conversionRate": "5%",
                "startDate": "2024-06-01",
                "endDate": "2024-07-28",
                "description": "Campaign Cold Calling Campaign targeting Tele Caller candidates."
            },
            {
                "id": 2,
                "campaignName": "Customer Retention Campaign",
                "platform": "YouTube",
                "status": "Completed",
                "budget": "$8109",
                "impressions": "504392+",
                "clicks": "646",
                "conversionRate": "8%",
                "startDate": "2024-09-01",
                "endDate": "2024-10-28",
                "description": "Campaign Customer Retention Campaign targeting Tele Caller candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "Tele Caller",
                "company": "HDFC",
                "status": "Applied"
            },
            {
                "jobTitle": "Customer Executive",
                "company": "ICICI",
                "status": "Interview Scheduled"
            }
        ],
        "education": [
            {
                "degree": "BBA",
                "board": "Osmania University",
                "years": "6 - 1"
            },
            {
                "degree": "Diploma in Communication Skills",
                "years": "4 - 4"
            }
        ],
        "experience": [
            {
                "company": "HDFC",
                "location": "Mumbai",
                "role": "Tele Caller",
                "startDate": "1-05",
                "endDate": "5-06",
                "description": "Worked at HDFC as Tele Caller contributing to projects and growth."
            },
            {
                "company": "ICICI",
                "location": "Mumbai",
                "role": "Tele Caller",
                "startDate": "0-11",
                "endDate": "2-09",
                "description": "Worked at ICICI as Tele Caller contributing to projects and growth."
            },
            {
                "company": "Axis Bank",
                "location": "Mumbai",
                "role": "Tele Caller",
                "startDate": "2-08",
                "endDate": "5-10",
                "description": "Worked at Axis Bank as Tele Caller contributing to projects and growth."
            }
        ]
    },
    {
        "id": 8,
        "name": "Ethan Brown",
        "location": "Bangalore",
        "image": "https://randomuser.me/api/portraits/women/65.jpg",
        "category": "Tele Caller",
        "title": "Tele Caller - Bangalore",
        "email": "ethan.brown@example.com",
        "summary": "Experienced Tele Caller with proven track record in tele caller and related projects.",
        "ratings": 3.8,
        "projects": [
            {
                "name": "Call Tracking System",
                "description": "Worked on Call Tracking System for improving business outcomes."
            },
            {
                "name": "CRM Integration",
                "description": "Worked on CRM Integration for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Lead Generation",
                "description": "Provides lead generation services."
            },
            {
                "name": "Follow-ups",
                "description": "Provides follow-ups services."
            },
            {
                "name": "Client Engagement",
                "description": "Provides client engagement services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Cold Calling Campaign",
                "platform": "LinkedIn",
                "status": "Scheduled",
                "budget": "$1997",
                "impressions": "548663+",
                "clicks": "1677",
                "conversionRate": "5%",
                "startDate": "2024-10-01",
                "endDate": "2024-05-28",
                "description": "Campaign Cold Calling Campaign targeting Tele Caller candidates."
            },
            {
                "id": 2,
                "campaignName": "Customer Retention Campaign",
                "platform": "YouTube",
                "status": "Completed",
                "budget": "$8460",
                "impressions": "646535+",
                "clicks": "4789",
                "conversionRate": "6%",
                "startDate": "2024-03-01",
                "endDate": "2024-10-28",
                "description": "Campaign Customer Retention Campaign targeting Tele Caller candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "Tele Caller",
                "company": "HDFC",
                "status": "Hired"
            },
            {
                "jobTitle": "Customer Executive",
                "company": "ICICI",
                "status": "Hired"
            }
        ],
        "education": [
            {
                "degree": "BBA",
                "board": "Osmania University",
                "years": "9 - 4"
            },
            {
                "degree": "Diploma in Communication Skills",
                "years": "4 - 6"
            }
        ],
        "experience": [
            {
                "company": "HDFC",
                "location": "Bangalore",
                "role": "Tele Caller",
                "startDate": "2-05",
                "endDate": "7-11",
                "description": "Worked at HDFC as Tele Caller contributing to projects and growth."
            },
            {
                "company": "ICICI",
                "location": "Bangalore",
                "role": "Tele Caller",
                "startDate": "6-06",
                "endDate": "4-09",
                "description": "Worked at ICICI as Tele Caller contributing to projects and growth."
            },
            {
                "company": "Axis Bank",
                "location": "Bangalore",
                "role": "Tele Caller",
                "startDate": "1-10",
                "endDate": "2-05",
                "description": "Worked at Axis Bank as Tele Caller contributing to projects and growth."
            }
        ]
    },
    {
        "id": 9,
        "name": "Olivia Brown",
        "location": "Chennai",
        "image": "https://randomuser.me/api/portraits/women/78.jpg",
        "category": "Digital Marketing",
        "title": "Digital Marketing - Chennai",
        "email": "olivia.brown@example.com",
        "summary": "Experienced Digital Marketing with proven track record in digital marketing and related projects.",
        "ratings": 4.6,
        "projects": [
            {
                "name": "SEO Campaign",
                "description": "Worked on SEO Campaign for improving business outcomes."
            },
            {
                "name": "Social Media Marketing",
                "description": "Worked on Social Media Marketing for improving business outcomes."
            },
            {
                "name": "PPC Ads",
                "description": "Worked on PPC Ads for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Content Creation",
                "description": "Provides content creation services."
            },
            {
                "name": "SEO Optimization",
                "description": "Provides seo optimization services."
            },
            {
                "name": "Ad Campaign Management",
                "description": "Provides ad campaign management services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Product Launch Campaign",
                "platform": "Instagram",
                "status": "Scheduled",
                "budget": "$7838",
                "impressions": "237123+",
                "clicks": "1855",
                "conversionRate": "2%",
                "startDate": "2024-05-01",
                "endDate": "2024-07-28",
                "description": "Campaign Product Launch Campaign targeting Digital Marketing candidates."
            },
            {
                "id": 2,
                "campaignName": "Brand Awareness Campaign",
                "platform": "Facebook",
                "status": "Completed",
                "budget": "$2880",
                "impressions": "867032+",
                "clicks": "8112",
                "conversionRate": "8%",
                "startDate": "2024-11-01",
                "endDate": "2024-06-28",
                "description": "Campaign Brand Awareness Campaign targeting Digital Marketing candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "Digital Marketing Manager",
                "company": "Zomato",
                "status": "Interview Scheduled"
            },
            {
                "jobTitle": "Marketing Executive",
                "company": "Swiggy",
                "status": "Applied"
            }
        ],
        "education": [
            {
                "degree": "MBA in Marketing",
                "board": "ISB",
                "years": "1 - 5"
            },
            {
                "degree": "BBA",
                "board": "Delhi University",
                "years": "10 - 5"
            }
        ],
        "experience": [
            {
                "company": "Zomato",
                "location": "Chennai",
                "role": "Digital Marketing",
                "startDate": "5-11",
                "endDate": "2-00",
                "description": "Worked at Zomato as Digital Marketing contributing to projects and growth."
            },
            {
                "company": "Swiggy",
                "location": "Chennai",
                "role": "Digital Marketing",
                "startDate": "0-01",
                "endDate": "1-09",
                "description": "Worked at Swiggy as Digital Marketing contributing to projects and growth."
            },
            {
                "company": "OYO",
                "location": "Chennai",
                "role": "Digital Marketing",
                "startDate": "3-08",
                "endDate": "6-09",
                "description": "Worked at OYO as Digital Marketing contributing to projects and growth."
            }
        ]
    },
    {
        "id": 10,
        "name": "Noah Miller",
        "location": "Delhi NCR",
        "image": "https://randomuser.me/api/portraits/women/15.jpg",
        "category": "Digital Marketing",
        "title": "Digital Marketing - Delhi",
        "email": "noah.miller@example.com",
        "summary": "Experienced Digital Marketing with proven track record in digital marketing and related projects.",
        "ratings": 2.6,
        "projects": [
            {
                "name": "SEO Campaign",
                "description": "Worked on SEO Campaign for improving business outcomes."
            },
            {
                "name": "Social Media Marketing",
                "description": "Worked on Social Media Marketing for improving business outcomes."
            },
            {
                "name": "PPC Ads",
                "description": "Worked on PPC Ads for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Content Creation",
                "description": "Provides content creation services."
            },
            {
                "name": "SEO Optimization",
                "description": "Provides seo optimization services."
            },
            {
                "name": "Ad Campaign Management",
                "description": "Provides ad campaign management services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Product Launch Campaign",
                "platform": "Instagram",
                "status": "Completed",
                "budget": "$6629",
                "impressions": "281314+",
                "clicks": "9737",
                "conversionRate": "7%",
                "startDate": "2024-04-01",
                "endDate": "2024-09-28",
                "description": "Campaign Product Launch Campaign targeting Digital Marketing candidates."
            },
            {
                "id": 2,
                "campaignName": "Brand Awareness Campaign",
                "platform": "Facebook",
                "status": "Scheduled",
                "budget": "$2116",
                "impressions": "926321+",
                "clicks": "3957",
                "conversionRate": "4%",
                "startDate": "2024-07-01",
                "endDate": "2024-02-28",
                "description": "Campaign Brand Awareness Campaign targeting Digital Marketing candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "Digital Marketing Manager",
                "company": "Zomato",
                "status": "Interview Scheduled"
            },
            {
                "jobTitle": "Marketing Executive",
                "company": "Swiggy",
                "status": "Applied"
            }
        ],
        "education": [
            {
                "degree": "MBA in Marketing",
                "board": "ISB",
                "years": "8 - 5"
            },
            {
                "degree": "BBA",
                "board": "Delhi University",
                "years": "5 - 2"
            }
        ],
        "experience": [
            {
                "company": "Zomato",
                "location": "Delhi NCR",
                "role": "Digital Marketing",
                "startDate": "0-10",
                "endDate": "6-06",
                "description": "Worked at Zomato as Digital Marketing contributing to projects and growth."
            },
            {
                "company": "Swiggy",
                "location": "Delhi NCR",
                "role": "Digital Marketing",
                "startDate": "3-09",
                "endDate": "5-08",
                "description": "Worked at Swiggy as Digital Marketing contributing to projects and growth."
            },
            {
                "company": "OYO",
                "location": "Delhi NCR",
                "role": "Digital Marketing",
                "startDate": "0-03",
                "endDate": "0-00",
                "description": "Worked at OYO as Digital Marketing contributing to projects and growth."
            }
        ]
    },
    {
        "id": 11,
        "name": "Ava Davis",
        "location": "Bangalore",
        "image": "https://randomuser.me/api/portraits/men/50.jpg",
        "category": "Digital Marketing",
        "title": "Digital Marketing - Bangalore",
        "email": "ava.davis@example.com",
        "summary": "Experienced Digital Marketing with proven track record in digital marketing and related projects.",
        "ratings": 1.9,
        "projects": [
            {
                "name": "SEO Campaign",
                "description": "Worked on SEO Campaign for improving business outcomes."
            },
            {
                "name": "Social Media Marketing",
                "description": "Worked on Social Media Marketing for improving business outcomes."
            },
            {
                "name": "PPC Ads",
                "description": "Worked on PPC Ads for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Content Creation",
                "description": "Provides content creation services."
            },
            {
                "name": "SEO Optimization",
                "description": "Provides seo optimization services."
            },
            {
                "name": "Ad Campaign Management",
                "description": "Provides ad campaign management services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Product Launch Campaign",
                "platform": "YouTube",
                "status": "Active",
                "budget": "$3117",
                "impressions": "346496+",
                "clicks": "7129",
                "conversionRate": "6%",
                "startDate": "2024-11-01",
                "endDate": "2024-01-28",
                "description": "Campaign Product Launch Campaign targeting Digital Marketing candidates."
            },
            {
                "id": 2,
                "campaignName": "Brand Awareness Campaign",
                "platform": "LinkedIn",
                "status": "Completed",
                "budget": "$96",
                "impressions": "613627+",
                "clicks": "4774",
                "conversionRate": "9%",
                "startDate": "2024-10-01",
                "endDate": "2024-04-28",
                "description": "Campaign Brand Awareness Campaign targeting Digital Marketing candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "Digital Marketing Manager",
                "company": "Zomato",
                "status": "Applied"
            },
            {
                "jobTitle": "Marketing Executive",
                "company": "Swiggy",
                "status": "Applied"
            }
        ],
        "education": [
            {
                "degree": "MBA in Marketing",
                "board": "ISB",
                "years": "7 - 5"
            },
            {
                "degree": "BBA",
                "board": "Delhi University",
                "years": "8 - 3"
            }
        ],
        "experience": [
            {
                "company": "Zomato",
                "location": "Bangalore",
                "role": "Digital Marketing",
                "startDate": "6-00",
                "endDate": "4-10",
                "description": "Worked at Zomato as Digital Marketing contributing to projects and growth."
            },
            {
                "company": "Swiggy",
                "location": "Bangalore",
                "role": "Digital Marketing",
                "startDate": "4-08",
                "endDate": "3-06",
                "description": "Worked at Swiggy as Digital Marketing contributing to projects and growth."
            },
            {
                "company": "OYO",
                "location": "Bangalore",
                "role": "Digital Marketing",
                "startDate": "1-02",
                "endDate": "6-02",
                "description": "Worked at OYO as Digital Marketing contributing to projects and growth."
            }
        ]
    },
    {
        "id": 12,
        "name": "Noah Miller",
        "location": "Mumbai",
        "image": "https://randomuser.me/api/portraits/women/7.jpg",
        "category": "Digital Marketing",
        "title": "Digital Marketing - Mumbai",
        "email": "noah.miller@example.com",
        "summary": "Experienced Digital Marketing with proven track record in digital marketing and related projects.",
        "ratings": 4.0,
        "projects": [
            {
                "name": "SEO Campaign",
                "description": "Worked on SEO Campaign for improving business outcomes."
            },
            {
                "name": "Social Media Marketing",
                "description": "Worked on Social Media Marketing for improving business outcomes."
            },
            {
                "name": "PPC Ads",
                "description": "Worked on PPC Ads for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Content Creation",
                "description": "Provides content creation services."
            },
            {
                "name": "SEO Optimization",
                "description": "Provides seo optimization services."
            },
            {
                "name": "Ad Campaign Management",
                "description": "Provides ad campaign management services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Product Launch Campaign",
                "platform": "LinkedIn",
                "status": "Completed",
                "budget": "$3287",
                "impressions": "944829+",
                "clicks": "3153",
                "conversionRate": "1%",
                "startDate": "2024-07-01",
                "endDate": "2024-00-28",
                "description": "Campaign Product Launch Campaign targeting Digital Marketing candidates."
            },
            {
                "id": 2,
                "campaignName": "Brand Awareness Campaign",
                "platform": "Instagram",
                "status": "Completed",
                "budget": "$1037",
                "impressions": "576258+",
                "clicks": "8637",
                "conversionRate": "6%",
                "startDate": "2024-07-01",
                "endDate": "2024-00-28",
                "description": "Campaign Brand Awareness Campaign targeting Digital Marketing candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "Digital Marketing Manager",
                "company": "Zomato",
                "status": "Hired"
            },
            {
                "jobTitle": "Marketing Executive",
                "company": "Swiggy",
                "status": "Applied"
            }
        ],
        "education": [
            {
                "degree": "MBA in Marketing",
                "board": "ISB",
                "years": "8 - 6"
            },
            {
                "degree": "BBA",
                "board": "Delhi University",
                "years": "10 - 0"
            }
        ],
        "experience": [
            {
                "company": "Zomato",
                "location": "Mumbai",
                "role": "Digital Marketing",
                "startDate": "6-11",
                "endDate": "6-11",
                "description": "Worked at Zomato as Digital Marketing contributing to projects and growth."
            },
            {
                "company": "Swiggy",
                "location": "Mumbai",
                "role": "Digital Marketing",
                "startDate": "1-02",
                "endDate": "0-02",
                "description": "Worked at Swiggy as Digital Marketing contributing to projects and growth."
            },
            {
                "company": "OYO",
                "location": "Mumbai",
                "role": "Digital Marketing",
                "startDate": "1-03",
                "endDate": "3-06",
                "description": "Worked at OYO as Digital Marketing contributing to projects and growth."
            }
        ]
    },
    {
        "id": 13,
        "name": "Ava Davis",
        "location": "Delhi NCR",
        "image": "https://randomuser.me/api/portraits/men/58.jpg",
        "category": "Digital Marketing",
        "title": "Digital Marketing - Delhi",
        "email": "ava.davis@example.com",
        "summary": "Experienced Digital Marketing with proven track record in digital marketing and related projects.",
        "ratings": 5.0,
        "projects": [
            {
                "name": "SEO Campaign",
                "description": "Worked on SEO Campaign for improving business outcomes."
            },
            {
                "name": "Social Media Marketing",
                "description": "Worked on Social Media Marketing for improving business outcomes."
            },
            {
                "name": "PPC Ads",
                "description": "Worked on PPC Ads for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Content Creation",
                "description": "Provides content creation services."
            },
            {
                "name": "SEO Optimization",
                "description": "Provides seo optimization services."
            },
            {
                "name": "Ad Campaign Management",
                "description": "Provides ad campaign management services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Product Launch Campaign",
                "platform": "Instagram",
                "status": "Active",
                "budget": "$5701",
                "impressions": "25224+",
                "clicks": "7663",
                "conversionRate": "2%",
                "startDate": "2024-03-01",
                "endDate": "2024-06-28",
                "description": "Campaign Product Launch Campaign targeting Digital Marketing candidates."
            },
            {
                "id": 2,
                "campaignName": "Brand Awareness Campaign",
                "platform": "YouTube",
                "status": "Scheduled",
                "budget": "$7420",
                "impressions": "172171+",
                "clicks": "4810",
                "conversionRate": "8%",
                "startDate": "2024-06-01",
                "endDate": "2024-07-28",
                "description": "Campaign Brand Awareness Campaign targeting Digital Marketing candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "Digital Marketing Manager",
                "company": "Zomato",
                "status": "Hired"
            },
            {
                "jobTitle": "Marketing Executive",
                "company": "Swiggy",
                "status": "Interview Scheduled"
            }
        ],
        "education": [
            {
                "degree": "MBA in Marketing",
                "board": "ISB",
                "years": "2 - 4"
            },
            {
                "degree": "BBA",
                "board": "Delhi University",
                "years": "3 - 0"
            }
        ],
        "experience": [
            {
                "company": "Zomato",
                "location": "Delhi NCR",
                "role": "Digital Marketing",
                "startDate": "1-07",
                "endDate": "5-05",
                "description": "Worked at Zomato as Digital Marketing contributing to projects and growth."
            },
            {
                "company": "Swiggy",
                "location": "Delhi NCR",
                "role": "Digital Marketing",
                "startDate": "5-03",
                "endDate": "5-09",
                "description": "Worked at Swiggy as Digital Marketing contributing to projects and growth."
            },
            {
                "company": "OYO",
                "location": "Delhi NCR",
                "role": "Digital Marketing",
                "startDate": "5-05",
                "endDate": "4-01",
                "description": "Worked at OYO as Digital Marketing contributing to projects and growth."
            }
        ]
    },
    {
        "id": 14,
        "name": "Mason Johnson",
        "location": "Hyderabad",
        "image": "https://randomuser.me/api/portraits/men/77.jpg",
        "category": "Web Development",
        "title": "Web Development - Hyderabad",
        "email": "mason.johnson@example.com",
        "summary": "Experienced Web Development with proven track record in web development and related projects.",
        "ratings": 3.9,
        "projects": [
            {
                "name": "E-Commerce Platform",
                "description": "Worked on E-Commerce Platform for improving business outcomes."
            },
            {
                "name": "Company Website",
                "description": "Worked on Company Website for improving business outcomes."
            },
            {
                "name": "CRM Dashboard",
                "description": "Worked on CRM Dashboard for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Web App Development",
                "description": "Provides web app development services."
            },
            {
                "name": "Code Review",
                "description": "Provides code review services."
            },
            {
                "name": "API Integration",
                "description": "Provides api integration services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Tech Hiring Campaign",
                "platform": "Instagram",
                "status": "Active",
                "budget": "$5161",
                "impressions": "555096+",
                "clicks": "7251",
                "conversionRate": "2%",
                "startDate": "2024-10-01",
                "endDate": "2024-06-28",
                "description": "Campaign Tech Hiring Campaign targeting Web Development candidates."
            },
            {
                "id": 2,
                "campaignName": "Product Launch Campaign",
                "platform": "Facebook",
                "status": "Scheduled",
                "budget": "$2601",
                "impressions": "248263+",
                "clicks": "6410",
                "conversionRate": "1%",
                "startDate": "2024-07-01",
                "endDate": "2024-08-28",
                "description": "Campaign Product Launch Campaign targeting Web Development candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "Full Stack Developer",
                "company": "Infosys",
                "status": "Hired"
            },
            {
                "jobTitle": "Frontend Developer",
                "company": "TCS",
                "status": "Applied"
            }
        ],
        "education": [
            {
                "degree": "B.Tech in CS",
                "board": "NIT Warangal",
                "years": "10 - 0"
            },
            {
                "degree": "M.Tech in Software Engineering",
                "board": "JNTU Hyderabad",
                "years": "10 - 4"
            }
        ],
        "experience": [
            {
                "company": "Infosys",
                "location": "Hyderabad",
                "role": "Web Development",
                "startDate": "5-01",
                "endDate": "2-04",
                "description": "Worked at Infosys as Web Development contributing to projects and growth."
            },
            {
                "company": "TCS",
                "location": "Hyderabad",
                "role": "Web Development",
                "startDate": "2-05",
                "endDate": "2-05",
                "description": "Worked at TCS as Web Development contributing to projects and growth."
            },
            {
                "company": "TechMinds",
                "location": "Hyderabad",
                "role": "Web Development",
                "startDate": "2-08",
                "endDate": "4-11",
                "description": "Worked at TechMinds as Web Development contributing to projects and growth."
            }
        ]
    },
    {
        "id": 15,
        "name": "Ava Robin",
        "location": "Mumbai",
        "image": "https://randomuser.me/api/portraits/men/82.jpg",
        "category": "Web Development",
        "title": "Web Development - Mumbai",
        "email": "ava.robin@example.com",
        "summary": "Experienced Web Development with proven track record in web development and related projects.",
        "ratings": 2.7,
        "projects": [
            {
                "name": "E-Commerce Platform",
                "description": "Worked on E-Commerce Platform for improving business outcomes."
            },
            {
                "name": "Company Website",
                "description": "Worked on Company Website for improving business outcomes."
            },
            {
                "name": "CRM Dashboard",
                "description": "Worked on CRM Dashboard for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Web App Development",
                "description": "Provides web app development services."
            },
            {
                "name": "Code Review",
                "description": "Provides code review services."
            },
            {
                "name": "API Integration",
                "description": "Provides api integration services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Tech Hiring Campaign",
                "platform": "LinkedIn",
                "status": "Completed",
                "budget": "$5520",
                "impressions": "888588+",
                "clicks": "1543",
                "conversionRate": "5%",
                "startDate": "2024-11-01",
                "endDate": "2024-05-28",
                "description": "Campaign Tech Hiring Campaign targeting Web Development candidates."
            },
            {
                "id": 2,
                "campaignName": "Product Launch Campaign",
                "platform": "YouTube",
                "status": "Scheduled",
                "budget": "$658",
                "impressions": "99688+",
                "clicks": "4226",
                "conversionRate": "3%",
                "startDate": "2024-07-01",
                "endDate": "2024-10-28",
                "description": "Campaign Product Launch Campaign targeting Web Development candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "Full Stack Developer",
                "company": "Infosys",
                "status": "Applied"
            },
            {
                "jobTitle": "Frontend Developer",
                "company": "TCS",
                "status": "Applied"
            }
        ],
        "education": [
            {
                "degree": "B.Tech in CS",
                "board": "NIT Warangal",
                "years": "0 - 5"
            },
            {
                "degree": "M.Tech in Software Engineering",
                "board": "JNTU Hyderabad",
                "years": "5 - 3"
            }
        ],
        "experience": [
            {
                "company": "Infosys",
                "location": "Mumbai",
                "role": "Web Development",
                "startDate": "4-00",
                "endDate": "1-07",
                "description": "Worked at Infosys as Web Development contributing to projects and growth."
            },
            {
                "company": "TCS",
                "location": "Mumbai",
                "role": "Web Development",
                "startDate": "3-06",
                "endDate": "1-01",
                "description": "Worked at TCS as Web Development contributing to projects and growth."
            },
            {
                "company": "TechMinds",
                "location": "Mumbai",
                "role": "Web Development",
                "startDate": "3-11",
                "endDate": "6-11",
                "description": "Worked at TechMinds as Web Development contributing to projects and growth."
            }
        ]
    },
    {
        "id": 16,
        "name": "Mason Williams",
        "location": "Hyderabad",
        "image": "https://randomuser.me/api/portraits/men/50.jpg",
        "category": "Web Development",
        "title": "Web Development - Hyderabad",
        "email": "mason.williams@example.com",
        "summary": "Experienced Web Development with proven track record in web development and related projects.",
        "ratings": 4.9,
        "projects": [
            {
                "name": "E-Commerce Platform",
                "description": "Worked on E-Commerce Platform for improving business outcomes."
            },
            {
                "name": "Company Website",
                "description": "Worked on Company Website for improving business outcomes."
            },
            {
                "name": "CRM Dashboard",
                "description": "Worked on CRM Dashboard for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Web App Development",
                "description": "Provides web app development services."
            },
            {
                "name": "Code Review",
                "description": "Provides code review services."
            },
            {
                "name": "API Integration",
                "description": "Provides api integration services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Tech Hiring Campaign",
                "platform": "Instagram",
                "status": "Completed",
                "budget": "$6900",
                "impressions": "404719+",
                "clicks": "9667",
                "conversionRate": "4%",
                "startDate": "2024-00-01",
                "endDate": "2024-02-28",
                "description": "Campaign Tech Hiring Campaign targeting Web Development candidates."
            },
            {
                "id": 2,
                "campaignName": "Product Launch Campaign",
                "platform": "YouTube",
                "status": "Completed",
                "budget": "$4570",
                "impressions": "694900+",
                "clicks": "2137",
                "conversionRate": "0%",
                "startDate": "2024-06-01",
                "endDate": "2024-10-28",
                "description": "Campaign Product Launch Campaign targeting Web Development candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "Full Stack Developer",
                "company": "Infosys",
                "status": "Hired"
            },
            {
                "jobTitle": "Frontend Developer",
                "company": "TCS",
                "status": "Applied"
            }
        ],
        "education": [
            {
                "degree": "B.Tech in CS",
                "board": "NIT Warangal",
                "years": "1 - 4"
            },
            {
                "degree": "M.Tech in Software Engineering",
                "board": "JNTU Hyderabad",
                "years": "2 - 5"
            }
        ],
        "experience": [
            {
                "company": "Infosys",
                "location": "Hyderabad",
                "role": "Web Development",
                "startDate": "6-07",
                "endDate": "6-07",
                "description": "Worked at Infosys as Web Development contributing to projects and growth."
            },
            {
                "company": "TCS",
                "location": "Hyderabad",
                "role": "Web Development",
                "startDate": "4-01",
                "endDate": "2-05",
                "description": "Worked at TCS as Web Development contributing to projects and growth."
            },
            {
                "company": "TechMinds",
                "location": "Hyderabad",
                "role": "Web Development",
                "startDate": "6-01",
                "endDate": "7-05",
                "description": "Worked at TechMinds as Web Development contributing to projects and growth."
            }
        ]
    },
    {
        "id": 17,
        "name": "Noah Johnson",
        "location": "Pune",
        "image": "https://randomuser.me/api/portraits/women/67.jpg",
        "category": "Web Development",
        "title": "Web Development - Pune",
        "email": "noah.johnson@example.com",
        "summary": "Experienced Web Development with proven track record in web development and related projects.",
        "ratings": 3.8,
        "projects": [
            {
                "name": "E-Commerce Platform",
                "description": "Worked on E-Commerce Platform for improving business outcomes."
            },
            {
                "name": "Company Website",
                "description": "Worked on Company Website for improving business outcomes."
            },
            {
                "name": "CRM Dashboard",
                "description": "Worked on CRM Dashboard for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Web App Development",
                "description": "Provides web app development services."
            },
            {
                "name": "Code Review",
                "description": "Provides code review services."
            },
            {
                "name": "API Integration",
                "description": "Provides api integration services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Tech Hiring Campaign",
                "platform": "Instagram",
                "status": "Scheduled",
                "budget": "$5860",
                "impressions": "198483+",
                "clicks": "9081",
                "conversionRate": "1%",
                "startDate": "2024-06-01",
                "endDate": "2024-08-28",
                "description": "Campaign Tech Hiring Campaign targeting Web Development candidates."
            },
            {
                "id": 2,
                "campaignName": "Product Launch Campaign",
                "platform": "YouTube",
                "status": "Scheduled",
                "budget": "$4120",
                "impressions": "788855+",
                "clicks": "4871",
                "conversionRate": "2%",
                "startDate": "2024-08-01",
                "endDate": "2024-03-28",
                "description": "Campaign Product Launch Campaign targeting Web Development candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "Full Stack Developer",
                "company": "Infosys",
                "status": "Hired"
            },
            {
                "jobTitle": "Frontend Developer",
                "company": "TCS",
                "status": "Applied"
            }
        ],
        "education": [
            {
                "degree": "B.Tech in CS",
                "board": "NIT Warangal",
                "years": "3 - 6"
            },
            {
                "degree": "M.Tech in Software Engineering",
                "board": "JNTU Hyderabad",
                "years": "6 - 1"
            }
        ],
        "experience": [
            {
                "company": "Infosys",
                "location": "Pune",
                "role": "Web Development",
                "startDate": "3-10",
                "endDate": "5-05",
                "description": "Worked at Infosys as Web Development contributing to projects and growth."
            },
            {
                "company": "TCS",
                "location": "Pune",
                "role": "Web Development",
                "startDate": "2-10",
                "endDate": "1-11",
                "description": "Worked at TCS as Web Development contributing to projects and growth."
            },
            {
                "company": "TechMinds",
                "location": "Pune",
                "role": "Web Development",
                "startDate": "4-01",
                "endDate": "3-09",
                "description": "Worked at TechMinds as Web Development contributing to projects and growth."
            }
        ]
    },
    {
        "id": 18,
        "name": "Ethan Williams",
        "location": "Delhi NCR",
        "image": "https://randomuser.me/api/portraits/men/78.jpg",
        "category": "CRM Executive",
        "title": "CRM Executive - Delhi",
        "email": "ethan.williams@example.com",
        "summary": "Experienced CRM Executive with proven track record in crm executive and related projects.",
        "ratings": 3.3,
        "projects": [
            {
                "name": "CRM Integration",
                "description": "Worked on CRM Integration for improving business outcomes."
            },
            {
                "name": "Customer Dashboard",
                "description": "Worked on Customer Dashboard for improving business outcomes."
            },
            {
                "name": "Data Analytics",
                "description": "Worked on Data Analytics for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Client Management",
                "description": "Provides client management services."
            },
            {
                "name": "Data Entry",
                "description": "Provides data entry services."
            },
            {
                "name": "Customer Support",
                "description": "Provides customer support services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Client Retention Campaign",
                "platform": "Facebook",
                "status": "Active",
                "budget": "$6049",
                "impressions": "776606+",
                "clicks": "5410",
                "conversionRate": "2%",
                "startDate": "2024-09-01",
                "endDate": "2024-00-28",
                "description": "Campaign Client Retention Campaign targeting CRM Executive candidates."
            },
            {
                "id": 2,
                "campaignName": "Upsell Campaign",
                "platform": "YouTube",
                "status": "Active",
                "budget": "$1546",
                "impressions": "748481+",
                "clicks": "9723",
                "conversionRate": "8%",
                "startDate": "2024-04-01",
                "endDate": "2024-06-28",
                "description": "Campaign Upsell Campaign targeting CRM Executive candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "CRM Executive",
                "company": "Zoho",
                "status": "Interview Scheduled"
            },
            {
                "jobTitle": "CRM Manager",
                "company": "Salesforce",
                "status": "Hired"
            }
        ],
        "education": [
            {
                "degree": "BBA",
                "board": "Delhi University",
                "years": "0 - 5"
            },
            {
                "degree": "Diploma in Customer Relationship Management",
                "years": "2 - 6"
            }
        ],
        "experience": [
            {
                "company": "Zoho",
                "location": "Delhi NCR",
                "role": "CRM Executive",
                "startDate": "4-02",
                "endDate": "5-05",
                "description": "Worked at Zoho as CRM Executive contributing to projects and growth."
            },
            {
                "company": "Salesforce",
                "location": "Delhi NCR",
                "role": "CRM Executive",
                "startDate": "5-06",
                "endDate": "0-11",
                "description": "Worked at Salesforce as CRM Executive contributing to projects and growth."
            },
            {
                "company": "HubSpot",
                "location": "Delhi NCR",
                "role": "CRM Executive",
                "startDate": "3-08",
                "endDate": "2-07",
                "description": "Worked at HubSpot as CRM Executive contributing to projects and growth."
            }
        ]
    },
    {
        "id": 19,
        "name": "Ava Jones",
        "location": "Chennai",
        "image": "https://randomuser.me/api/portraits/men/15.jpg",
        "category": "CRM Executive",
        "title": "CRM Executive - Chennai",
        "email": "ava.jones@example.com",
        "summary": "Experienced CRM Executive with proven track record in crm executive and related projects.",
        "ratings": 3.4,
        "projects": [
            {
                "name": "CRM Integration",
                "description": "Worked on CRM Integration for improving business outcomes."
            },
            {
                "name": "Customer Dashboard",
                "description": "Worked on Customer Dashboard for improving business outcomes."
            },
            {
                "name": "Data Analytics",
                "description": "Worked on Data Analytics for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Client Management",
                "description": "Provides client management services."
            },
            {
                "name": "Data Entry",
                "description": "Provides data entry services."
            },
            {
                "name": "Customer Support",
                "description": "Provides customer support services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Client Retention Campaign",
                "platform": "Facebook",
                "status": "Completed",
                "budget": "$5615",
                "impressions": "735758+",
                "clicks": "2299",
                "conversionRate": "3%",
                "startDate": "2024-07-01",
                "endDate": "2024-10-28",
                "description": "Campaign Client Retention Campaign targeting CRM Executive candidates."
            },
            {
                "id": 2,
                "campaignName": "Upsell Campaign",
                "platform": "Instagram",
                "status": "Scheduled",
                "budget": "$6565",
                "impressions": "433104+",
                "clicks": "2150",
                "conversionRate": "5%",
                "startDate": "2024-10-01",
                "endDate": "2024-02-28",
                "description": "Campaign Upsell Campaign targeting CRM Executive candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "CRM Executive",
                "company": "Zoho",
                "status": "Hired"
            },
            {
                "jobTitle": "CRM Manager",
                "company": "Salesforce",
                "status": "Applied"
            }
        ],
        "education": [
            {
                "degree": "BBA",
                "board": "Delhi University",
                "years": "7 - 1"
            },
            {
                "degree": "Diploma in Customer Relationship Management",
                "years": "4 - 6"
            }
        ],
        "experience": [
            {
                "company": "Zoho",
                "location": "Chennai",
                "role": "CRM Executive",
                "startDate": "5-11",
                "endDate": "3-05",
                "description": "Worked at Zoho as CRM Executive contributing to projects and growth."
            },
            {
                "company": "Salesforce",
                "location": "Chennai",
                "role": "CRM Executive",
                "startDate": "4-11",
                "endDate": "6-00",
                "description": "Worked at Salesforce as CRM Executive contributing to projects and growth."
            },
            {
                "company": "HubSpot",
                "location": "Chennai",
                "role": "CRM Executive",
                "startDate": "5-02",
                "endDate": "2-04",
                "description": "Worked at HubSpot as CRM Executive contributing to projects and growth."
            }
        ]
    },
    {
        "id": 20,
        "name": "Ava Davis",
        "location": "Pune",
        "image": "https://randomuser.me/api/portraits/women/26.jpg",
        "category": "Accounts & Auditing",
        "title": "Accounts & Auditing - Pune",
        "email": "ava.davis@example.com",
        "summary": "Experienced Accounts & Auditing with proven track record in accounts & auditing and related projects.",
        "ratings": 3.7,
        "projects": [
            {
                "name": "Accounting Software Integration",
                "description": "Worked on Accounting Software Integration for improving business outcomes."
            },
            {
                "name": "Audit Reports Automation",
                "description": "Worked on Audit Reports Automation for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Financial Reporting",
                "description": "Provides financial reporting services."
            },
            {
                "name": "Auditing",
                "description": "Provides auditing services."
            },
            {
                "name": "Tax Filing",
                "description": "Provides tax filing services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Finance Awareness Campaign",
                "platform": "YouTube",
                "status": "Active",
                "budget": "$4085",
                "impressions": "428234+",
                "clicks": "2431",
                "conversionRate": "9%",
                "startDate": "2024-07-01",
                "endDate": "2024-00-28",
                "description": "Campaign Finance Awareness Campaign targeting Accounts & Auditing candidates."
            },
            {
                "id": 2,
                "campaignName": "Internal Audit Campaign",
                "platform": "Instagram",
                "status": "Scheduled",
                "budget": "$5717",
                "impressions": "877340+",
                "clicks": "1047",
                "conversionRate": "8%",
                "startDate": "2024-09-01",
                "endDate": "2024-06-28",
                "description": "Campaign Internal Audit Campaign targeting Accounts & Auditing candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "Accounts Executive",
                "company": "Deloitte",
                "status": "Applied"
            },
            {
                "jobTitle": "Auditor",
                "company": "PwC",
                "status": "Hired"
            }
        ],
        "education": [
            {
                "degree": "B.Com",
                "board": "Delhi University",
                "years": "10 - 1"
            },
            {
                "degree": "MBA in Finance",
                "board": "IIM Bangalore",
                "years": "6 - 6"
            }
        ],
        "experience": [
            {
                "company": "Deloitte",
                "location": "Pune",
                "role": "Accounts & Auditing",
                "startDate": "3-08",
                "endDate": "5-02",
                "description": "Worked at Deloitte as Accounts & Auditing contributing to projects and growth."
            },
            {
                "company": "PwC",
                "location": "Pune",
                "role": "Accounts & Auditing",
                "startDate": "5-10",
                "endDate": "7-00",
                "description": "Worked at PwC as Accounts & Auditing contributing to projects and growth."
            },
            {
                "company": "KPMG",
                "location": "Pune",
                "role": "Accounts & Auditing",
                "startDate": "6-00",
                "endDate": "5-01",
                "description": "Worked at KPMG as Accounts & Auditing contributing to projects and growth."
            }
        ]
    },
    {
        "id": 21,
        "name": "Noah Robin",
        "location": "Chennai",
        "image": "https://randomuser.me/api/portraits/women/3.jpg",
        "category": "Accounts & Auditing",
        "title": "Accounts & Auditing - Chennai",
        "email": "noah.robin@example.com",
        "summary": "Experienced Accounts & Auditing with proven track record in accounts & auditing and related projects.",
        "ratings": 3.2,
        "projects": [
            {
                "name": "Accounting Software Integration",
                "description": "Worked on Accounting Software Integration for improving business outcomes."
            },
            {
                "name": "Audit Reports Automation",
                "description": "Worked on Audit Reports Automation for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Financial Reporting",
                "description": "Provides financial reporting services."
            },
            {
                "name": "Auditing",
                "description": "Provides auditing services."
            },
            {
                "name": "Tax Filing",
                "description": "Provides tax filing services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Finance Awareness Campaign",
                "platform": "LinkedIn",
                "status": "Scheduled",
                "budget": "$709",
                "impressions": "439466+",
                "clicks": "7132",
                "conversionRate": "1%",
                "startDate": "2024-00-01",
                "endDate": "2024-01-28",
                "description": "Campaign Finance Awareness Campaign targeting Accounts & Auditing candidates."
            },
            {
                "id": 2,
                "campaignName": "Internal Audit Campaign",
                "platform": "Instagram",
                "status": "Completed",
                "budget": "$2844",
                "impressions": "85873+",
                "clicks": "9570",
                "conversionRate": "9%",
                "startDate": "2024-00-01",
                "endDate": "2024-10-28",
                "description": "Campaign Internal Audit Campaign targeting Accounts & Auditing candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "Accounts Executive",
                "company": "Deloitte",
                "status": "Applied"
            },
            {
                "jobTitle": "Auditor",
                "company": "PwC",
                "status": "Hired"
            }
        ],
        "education": [
            {
                "degree": "B.Com",
                "board": "Delhi University",
                "years": "5 - 5"
            },
            {
                "degree": "MBA in Finance",
                "board": "IIM Bangalore",
                "years": "7 - 4"
            }
        ],
        "experience": [
            {
                "company": "Deloitte",
                "location": "Chennai",
                "role": "Accounts & Auditing",
                "startDate": "4-08",
                "endDate": "1-00",
                "description": "Worked at Deloitte as Accounts & Auditing contributing to projects and growth."
            },
            {
                "company": "PwC",
                "location": "Chennai",
                "role": "Accounts & Auditing",
                "startDate": "0-08",
                "endDate": "5-10",
                "description": "Worked at PwC as Accounts & Auditing contributing to projects and growth."
            },
            {
                "company": "KPMG",
                "location": "Chennai",
                "role": "Accounts & Auditing",
                "startDate": "5-01",
                "endDate": "0-10",
                "description": "Worked at KPMG as Accounts & Auditing contributing to projects and growth."
            }
        ]
    },
    {
        "id": 22,
        "name": "Bheema Guguloth",
        "location": "Hyderabad",
        "image": "https://randomuser.me/api/portraits/men/64.jpg",
        "category": "Web Development",
        "title": "Web Development - Hyderabad",
        "email": "bheema@gmail.com",
        "summary": "Experienced Web Development with proven track record in web development and related projects.",
        "ratings": 1.6,
        "projects": [
            {
                "name": "E-Commerce Platform",
                "description": "Worked on E-Commerce Platform for improving business outcomes."
            },
            {
                "name": "Company Website",
                "description": "Worked on Company Website for improving business outcomes."
            },
            {
                "name": "CRM Dashboard",
                "description": "Worked on CRM Dashboard for improving business outcomes."
            }
        ],
        "services": [
            {
                "name": "Web App Development",
                "description": "Provides web app development services."
            },
            {
                "name": "Code Review",
                "description": "Provides code review services."
            },
            {
                "name": "API Integration",
                "description": "Provides api integration services."
            }
        ],
        "marketing": [
            {
                "id": 1,
                "campaignName": "Tech Hiring Campaign",
                "platform": "Instagram",
                "status": "Scheduled",
                "budget": "$5860",
                "impressions": "198483+",
                "clicks": "9081",
                "conversionRate": "1%",
                "startDate": "2024-06-01",
                "endDate": "2024-08-28",
                "description": "Campaign Tech Hiring Campaign targeting Web Development candidates."
            },
            {
                "id": 2,
                "campaignName": "Product Launch Campaign",
                "platform": "YouTube",
                "status": "Scheduled",
                "budget": "$4120",
                "impressions": "788855+",
                "clicks": "4871",
                "conversionRate": "2%",
                "startDate": "2024-08-01",
                "endDate": "2024-03-28",
                "description": "Campaign Product Launch Campaign targeting Web Development candidates."
            }
        ],
        "applications": [
            {
                "jobTitle": "Full Stack Developer",
                "company": "Infosys",
                "status": "Hired"
            },
            {
                "jobTitle": "Frontend Developer",
                "company": "TCS",
                "status": "Applied"
            }
        ],
        "education": [
            {
                "degree": "B.Tech in CS",
                "board": "NIT Warangal",
                "years": "3 - 6"
            },
            {
                "degree": "M.Tech in Software Engineering",
                "board": "JNTU Hyderabad",
                "years": "6 - 1"
            }
        ],
        "experience": [
            {
                "company": "Infosys",
                "location": "Pune",
                "role": "Web Development",
                "startDate": "3-10",
                "endDate": "5-05",
                "description": "Worked at Infosys as Web Development contributing to projects and growth."
            },
            {
                "company": "TCS",
                "location": "Pune",
                "role": "Web Development",
                "startDate": "2-10",
                "endDate": "1-11",
                "description": "Worked at TCS as Web Development contributing to projects and growth."
            },
            {
                "company": "TechMinds",
                "location": "Pune",
                "role": "Web Development",
                "startDate": "4-01",
                "endDate": "3-09",
                "description": "Worked at TechMinds as Web Development contributing to projects and growth."
            }
        ]
    }
]

