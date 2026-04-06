package com.doctor.appointment.service;

import com.doctor.appointment.dto.AuthRequest;
import com.doctor.appointment.dto.AuthResponse;
import com.doctor.appointment.dto.RegisterRequest;
import com.doctor.appointment.entity.User;
import com.doctor.appointment.exception.DuplicateEmailException;
import com.doctor.appointment.repository.UserRepository;
import com.doctor.appointment.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * AuthService - handles user registration and login business logic.
 *
 * Registration flow:
 * 1. Check email uniqueness
 * 2. Encode password with BCrypt
 * 3. Save user to DB
 * 4. Generate JWT token
 * 5. Return AuthResponse
 *
 * Login flow:
 * 1. Authenticate with Spring Security (validates credentials)
 * 2. Load UserDetails
 * 3. Generate JWT token
 * 4. Return AuthResponse
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    /**
     * Register a new user (Patient or Admin).
     *
     * @param request registration details
     * @return AuthResponse with JWT token and user info
     */
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(request.getEmail());
        }

        // Parse role — default to PATIENT if invalid
        User.Role role;
        try {
            role = User.Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            role = User.Role.PATIENT;
        }

        // Create and save the user with BCrypt-encoded password
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        User savedUser = userRepository.save(user);
        log.info("New user registered: {} ({})", savedUser.getEmail(), savedUser.getRole());

        // Generate JWT token for immediate login after registration
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .userId(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .build();
    }

    /**
     * Authenticate an existing user.
     *
     * @param request login credentials
     * @return AuthResponse with JWT token and user info
     */
    public AuthResponse login(AuthRequest request) {
        // Delegate to Spring Security — throws BadCredentialsException if invalid
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Load user from DB for response data
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate fresh JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        log.info("User logged in: {}", user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
