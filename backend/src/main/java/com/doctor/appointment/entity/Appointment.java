package com.doctor.appointment.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Appointment Entity - core booking record linking Patient ↔ Doctor.
 * Tracks status through lifecycle: PENDING → APPROVED/REJECTED → COMPLETED
 */
@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The patient who booked the appointment */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** The doctor for the appointment */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    /** Appointment date (e.g., 2024-06-15) */
    @Column(nullable = false)
    private LocalDate date;

    /** Appointment time slot (e.g., "10:00") */
    @Column(nullable = false)
    private String time;

    /** Current status of the appointment */
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.PENDING;

    /** Payment status for the consultation fee */
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    /** Optional notes from patient or admin */
    @Column(columnDefinition = "TEXT")
    private String notes;

    /** Timestamp when appointment was booked */
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    /** Appointment lifecycle statuses */
    public enum Status {
        PENDING,    // Just booked, awaiting admin approval
        APPROVED,   // Confirmed by admin
        REJECTED,   // Declined by admin
        COMPLETED   // Appointment done
    }

    /** Payment statuses */
    public enum PaymentStatus {
        PENDING,    // Payment not yet processed
        PAID,       // Payment successful
        FAILED      // Payment failed/refunded
    }
}
