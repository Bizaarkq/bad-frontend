const url = "localhost:5000/api"

export const endpoints = {
    auth: {
        login: `http://${url}/auth/login`,
        me: `http://${url}/auth/me`,
        logout: `http://${url}/auth/logout`
    }    
}