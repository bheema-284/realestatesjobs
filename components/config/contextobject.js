export const contextObject = {
    authenticated: false,
    loader: true,
    user: {
        name: "",
        email: "",
        mobile: "",
        password: "",
        token: "",
        isAdmin: "",
    },
    accessToken: '',
    remember: false,
    toast: {
        show: false,
        dismiss: true,
        type: '',
        title: '',
        message: ''
    },
    jobs: [
        {
            "id": "job-1752833777976-m3joa98",
            "jobTitle": "Real Estate Sales",
            "jobDescription": "Drive property sales and meet targets.",
            "employmentTypes": [
                "full-time",
                "negotiable"
            ],
            "workingSchedule": {
                "dayShift": false,
                "nightShift": true,
                "weekendAvailability": true,
                "custom": "Night shift only"
            },
            "salaryType": "monthly",
            "salaryAmount": "85,000 + Bonus",
            "salaryFrequency": "Yearly",
            "hiringMultiple": true,
            "location": "Hyderabad",
            "postedOn": "2025-07-18"
        }
    ],
    notification: false
}