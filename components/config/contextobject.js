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
    jobs: []
}