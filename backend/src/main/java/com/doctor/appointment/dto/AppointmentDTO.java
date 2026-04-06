package com.doctor.appointment.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

/**
 * DTO for Appointment booking request from patient.
 */
@Data
public class AppointmentDTO {

    /** ID of the doctor to book with */
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    /** Appointment date — must be in the future */
    @NotNull(message = "Appointment date is required")
    @Future(message = "Appointment date must be in the future")
    private LocalDate date;

    /** Selected time slot (e.g., "10:00") */
    @NotBlank(message = "Appointment time is required")
    private String time;

    /** Optional notes/symptoms from patient */
    private String notes;
}
