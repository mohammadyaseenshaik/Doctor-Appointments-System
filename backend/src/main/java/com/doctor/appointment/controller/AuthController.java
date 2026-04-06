package com.doctor.appointment.controller;

import com.doctor.appointment.dto.ApiResponse;
import com.doctor.appointment.dto.AuthRequest;
import com.doctor.appointment.dto.AuthResponse;
import com.doctor.appointment.dto.RegisterRequest;
import com.doctor.appointment.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController - handles user registration and login.
 *
 * Public endpoints — no authentication required.
 * POST /auth/register → Register new user (Patient/Admin)
 * POST /auth/login    → Login and receive JWT token
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Register a new user.
     *
     * Request body: { "name": "John Doe", "email": "john@example.com",
     *                 "password": "pass123", "role": "PATIENT" }
     *
     * Response: { "success": true, "data": { "token": "...", "userId": 1, ... } }
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful", response));
    }

    /**
     * Login and get JWT token.
     *
     * Request body: { "email": "john@example.com", "password": "pass123" }
     *
     * Response: { "success": true, "data": { "token": "eyJ...", "role": "PATIENT", ... } }
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
}
