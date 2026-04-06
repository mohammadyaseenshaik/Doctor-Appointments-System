package com.doctor.appointment.controller;

import com.doctor.appointment.dto.ApiResponse;
import com.doctor.appointment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * PaymentController - handles (simulated) payment processing.
 *
 * In production, this would integrate with Razorpay/Stripe/PayU.
 * For this demo, payments are simulated with an 80% success rate.
 */
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Simulate payment for an appointment.
     *
     * POST /payments/simulate
     * Body: {
     *   "appointmentId": 1,
     *   "cardNumber": "4111111111111111",
     *   "cardHolder": "John Doe",
     *   "expiry": "12/25",
     *   "cvv": "123"
     * }
     *
     * Response: { "success": true/false, "transactionId": "TXN...", "message": "..." }
     */
    @PostMapping("/simulate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> simulatePayment(
            @RequestBody Map<String, Object> paymentRequest) {

        Long appointmentId = Long.parseLong(paymentRequest.get("appointmentId").toString());
        String cardNumber = paymentRequest.getOrDefault("cardNumber", "****").toString();

        Map<String, Object> result = paymentService.simulatePayment(appointmentId, cardNumber);

        boolean success = (boolean) result.get("success");
        String message = (String) result.get("message");

        return ResponseEntity.ok(ApiResponse.success(message, result));
    }
}
