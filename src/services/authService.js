import { endpoints } from './endpoints';
import axios from 'axios';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
}

export const login = async (data) => {
    const response = await axios.post(endpoints.auth.login, data);
    return response.data;
}

export const me = async () => {
    const response = await axios.get(endpoints.auth.me, headers);
    return response.data;
}

export const logout = async () => {
    const response = await axios.post(endpoints.auth.logout, {}, headers);
    return response.data;
}

export default {
    login,
    me,
    logout
}
