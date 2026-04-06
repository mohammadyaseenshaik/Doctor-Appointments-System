import axiosInstance from './axiosInstance'

/** Simulate a payment for an appointment */
export const simulatePayment = (data) => axiosInstance.post('/payments/simulate', data)
