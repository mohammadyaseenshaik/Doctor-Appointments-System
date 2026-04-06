package com.doctor.appointment.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * User Entity - represents both Patients and Admins in the system.
 * Role determines access level: PATIENT = book appointments, ADMIN = manage all.
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Full name of the user */
    @Column(nullable = false)
    private String name;

    /** Unique email used for login */
    @Column(nullable = false, unique = true)
    private String email;

    /** BCrypt-hashed password — never store plain text */
    @Column(nullable = false)
    private String password;

    /** Role determines what actions the user can perform */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    /** Supported roles in the system */
    public enum Role {
        PATIENT,  // Can book appointments, view history
        ADMIN     // Can manage doctors, view/update all appointments
    }
}
