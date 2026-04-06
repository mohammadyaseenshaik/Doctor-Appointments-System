package com.doctor.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

/**
 * DTO for Doctor create/update requests.
 * Used by Admin when adding or editing doctors.
 */
@Data
public class DoctorDTO {

    /** Doctor's full name */
    @NotBlank(message = "Doctor name is required")
    private String name;

    /** Medical specialization */
    @NotBlank(message = "Specialization is required")
    private String specialization;

    /** Years of experience */
    @NotNull(message = "Experience is required")
    @Positive(message = "Experience must be positive")
    private Integer experience;

    /** Consultation fee */
    @NotNull(message = "Fee is required")
    @Positive(message = "Fee must be positive")
    private Double fee;

    /** Profile image URL (optional) */
    private String imageUrl;

    /** Degree/qualification (e.g., MBBS, MD) */
    private String qualification;

    /** Hospital/clinic name */
    private String hospital;

    /**
     * Comma-separated time slots.
     * Example: "09:00,10:00,11:00,14:00,15:00,16:00"
     */
    private String availableSlots;

    /** Whether doctor is accepting appointments */
    private boolean available = true;
}
