package com.doctor.appointment.service;

import com.doctor.appointment.entity.Appointment;
import com.doctor.appointment.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/**
 * PaymentService - simulates a payment gateway integration.
 *
 * In a real application, this would:
 * - Integrate with Razorpay / Stripe / PayU
 * - Create payment orders
 * - Verify payment signatures
 * - Handle webhooks for async confirmation
 *
 * For this demo: 80% success rate simulation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final AppointmentRepository appointmentRepository;
    private final Random random = new Random();

    /**
     * Simulate payment processing for an appointment.
     *
     * @param appointmentId the appointment to pay for
     * @param cardNumber    last 4 digits of card (for display)
     * @return payment result with transaction details
     */
    public Map<String, Object> simulatePayment(Long appointmentId, String cardNumber) {
        Map<String, Object> result = new HashMap<>();

        // Find the appointment
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Simulate 80% payment success rate
        boolean paymentSuccess = random.nextInt(10) < 8;

        // Generate mock transaction ID
        String transactionId = "TXN" + System.currentTimeMillis();

        if (paymentSuccess) {
            // Update appointment payment status to PAID
            appointment.setPaymentStatus(Appointment.PaymentStatus.PAID);
            appointmentRepository.save(appointment);

            result.put("success", true);
            result.put("transactionId", transactionId);
            result.put("message", "Payment successful!");
            result.put("amount", appointment.getDoctor().getFee());
            result.put("appointmentId", appointmentId);
            result.put("cardLastFour", cardNumber.length() >= 4
                    ? cardNumber.substring(cardNumber.length() - 4) : "****");

            log.info("Payment SUCCESS for appointment {}: TXN {}", appointmentId, transactionId);
        } else {
            // Payment failed — keep status as PENDING
            appointment.setPaymentStatus(Appointment.PaymentStatus.FAILED);
            appointmentRepository.save(appointment);

            result.put("success", false);
            result.put("transactionId", transactionId);
            result.put("message", "Payment failed. Please try again.");
            result.put("appointmentId", appointmentId);

            log.warn("Payment FAILED for appointment {}", appointmentId);
        }

        return result;
    }
}
