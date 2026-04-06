import axiosInstance from './axiosInstance'

/** Register a new user */
export const register = (data) => axiosInstance.post('/auth/register', data)

/** Login with email + password */
export const login = (data) => axiosInstance.post('/auth/login', data)
