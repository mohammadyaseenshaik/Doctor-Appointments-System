package com.doctor.appointment.controller;

import com.doctor.appointment.dto.ApiResponse;
import com.doctor.appointment.dto.AppointmentDTO;
import com.doctor.appointment.dto.AppointmentStatusDTO;
import com.doctor.appointment.entity.Appointment;
import com.doctor.appointment.repository.UserRepository;
import com.doctor.appointment.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AppointmentController - REST API for appointment booking and management.
 *
 * PATIENT:  POST /appointments (book), GET /appointments/user/{id} (own history)
 * ADMIN:    GET /appointments/admin (all), PUT /appointments/{id}/status (update status)
 */
@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    /**
     * Book a new appointment.
     * Authenticates the user via JWT and books under their account.
     *
     * Request body: { "doctorId": 1, "date": "2024-07-15", "time": "10:00", "notes": "Fever" }
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Appointment>> bookAppointment(
            @Valid @RequestBody AppointmentDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Get user ID from authenticated JWT principal
        Long userId = getUserId(userDetails.getUsername());

        Appointment appointment = appointmentService.bookAppointment(userId, dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Appointment booked successfully", appointment));
    }

    /**
     * Get appointments for a specific user (patient view).
     * Patients should only request their own userId.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Appointment>>> getUserAppointments(
            @PathVariable Long userId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Appointments fetched successfully", appointments));
    }

    /**
     * Get ALL appointments — ADMIN only.
     * Returns every appointment in the system, ordered by newest first.
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Appointment>>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(ApiResponse.success("All appointments fetched", appointments));
    }

    /**
     * Update appointment status — ADMIN only.
     * Used to approve, reject, or complete appointments.
     *
     * PUT /appointments/{id}/status
     * Body: { "status": "APPROVED" }
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Appointment>> updateAppointmentStatus(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentStatusDTO dto) {
        Appointment appointment = appointmentService.updateStatus(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Appointment status updated", appointment));
    }

    /**
     * Helper to resolve email → User ID from DB.
     */
    private Long getUserId(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
