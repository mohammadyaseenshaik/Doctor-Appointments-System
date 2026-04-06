import axiosInstance from './axiosInstance'

/** Get all doctors (public) */
export const getAllDoctors = () => axiosInstance.get('/doctors')

/** Get a specific doctor by ID */
export const getDoctorById = (id) => axiosInstance.get(`/doctors/${id}`)

/** Add a new doctor (Admin only) */
export const addDoctor = (data) => axiosInstance.post('/doctors', data)

/** Update a doctor (Admin only) */
export const updateDoctor = (id, data) => axiosInstance.put(`/doctors/${id}`, data)

/** Delete a doctor (Admin only) */
export const deleteDoctor = (id) => axiosInstance.delete(`/doctors/${id}`)
