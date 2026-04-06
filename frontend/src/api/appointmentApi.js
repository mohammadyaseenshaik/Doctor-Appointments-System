import axiosInstance from './axiosInstance'

/** Book a new appointment (Patient) */
export const bookAppointment = (data) => axiosInstance.post('/appointments', data)

/** Get appointments for a specific user */
export const getUserAppointments = (userId) =>
  axiosInstance.get(`/appointments/user/${userId}`)

/** Get all appointments (Admin) */
export const getAllAppointments = () => axiosInstance.get('/appointments/admin')

/** Update appointment status (Admin) */
export const updateAppointmentStatus = (id, status) =>
  axiosInstance.put(`/appointments/${id}/status`, { status })
