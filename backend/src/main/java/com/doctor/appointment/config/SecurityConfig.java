package com.doctor.appointment.config;

import com.doctor.appointment.security.JwtAuthFilter;
import com.doctor.appointment.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * SecurityConfig - Main Spring Security configuration.
 *
 * Key decisions:
 * - STATELESS sessions (JWT-based, no server-side sessions)
 * - BCrypt password encoding (strength 10)
 * - Public routes: /auth/**, GET /doctors, H2 console
 * - PATIENT routes: POST /appointments, GET /appointments/user/**
 * - ADMIN routes: POST/PUT/DELETE /doctors, GET /appointments/admin
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;

    /**
     * Main security filter chain.
     * Defines URL-level access rules and session management.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF — not needed for stateless JWT REST APIs
            .csrf(AbstractHttpConfigurer::disable)

            // Configure authorization rules
            .authorizeHttpRequests(auth -> auth
                // ===== Public endpoints =====
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/doctors", "/doctors/**").permitAll()

                // Allow H2 console access (development only)
                .requestMatchers("/h2-console/**").permitAll()

                // ===== Admin-only endpoints =====
                .requestMatchers(HttpMethod.POST, "/doctors").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/doctors/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/doctors/**").hasRole("ADMIN")
                .requestMatchers("/appointments/admin").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/appointments/*/status").hasRole("ADMIN")

                // ===== Authenticated user endpoints =====
                .requestMatchers("/appointments/**").authenticated()
                .requestMatchers("/payments/**").authenticated()

                // Everything else requires authentication
                .anyRequest().authenticated()
            )

            // Stateless session — no cookies, no sessions
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Use our custom authentication provider
            .authenticationProvider(authenticationProvider())

            // Add JWT filter before the default username/password filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

            // Allow frames for H2 console (development only)
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

        return http.build();
    }

    /**
     * BCrypt password encoder — industry standard for password hashing.
     * Strength 10 = 2^10 iterations (good balance of security and performance).
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    /**
     * DAO Authentication Provider — connects Spring Security with our UserDetailsService.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * Authentication Manager — used by AuthService for programmatic authentication.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}
