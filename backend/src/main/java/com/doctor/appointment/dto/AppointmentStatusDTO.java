package com.doctor.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for admin updating appointment status.
 * Example request body: { "status": "APPROVED" }
 */
@Data
public class AppointmentStatusDTO {

    /**
     * New status to set.
     * Allowed values: PENDING, APPROVED, REJECTED, COMPLETED
     */
    @NotBlank(message = "Status is required")
    private String status;
}
