package com.doctor.appointment.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Doctor Entity - represents a doctor in the system.
 * Admins can add, edit, and delete doctors.
 * Patients can view and book appointments with doctors.
 */
@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Doctor's full name */
    @Column(nullable = false)
    private String name;

    /** Medical specialization (e.g., Cardiologist, Dermatologist) */
    @Column(nullable = false)
    private String specialization;

    /** Years of professional experience */
    private int experience;

    /** Consultation fee in INR */
    private double fee;

    /** URL to doctor's profile image */
    private String imageUrl;

    /**
     * Available time slots stored as comma-separated string.
     * Example: "09:00,10:00,11:00,14:00,15:00"
     */
    @Column(columnDefinition = "TEXT")
    private String availableSlots;

    /** Whether doctor is currently accepting appointments */
    @Builder.Default
    private boolean available = true;

    /** Doctor's qualification (e.g., MBBS, MD, MS) */
    private String qualification;

    /** Hospital or clinic where the doctor practices */
    private String hospital;
}
