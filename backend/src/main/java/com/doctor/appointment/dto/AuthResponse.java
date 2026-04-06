package com.doctor.appointment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for successful authentication response.
 * Contains JWT token + user info needed by frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    /** JWT Bearer token — include in Authorization header for subsequent requests */
    private String token;

    /** User's database ID */
    private Long userId;

    /** User's display name */
    private String name;

    /** User's email */
    private String email;

    /** User's role: "PATIENT" or "ADMIN" */
    private String role;
}
