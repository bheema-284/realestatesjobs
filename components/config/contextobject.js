// components/config/contextobject.js
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
        role: "",
        id: ""
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
    jobs: [],
    notification: false,
    tasksColumns: [],
    schedule: [],
    // Add notifications structure
    notifications: {
        items: [],
        unreadCount: 0,
        isDropdownOpen: false,
        lastChecked: new Date().toISOString(),
        isLoading: false,
        error: null
    }
};