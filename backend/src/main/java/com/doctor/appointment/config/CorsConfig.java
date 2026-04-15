package com.doctor.appointment.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

/**
 * CorsConfig - Cross-Origin Resource Sharing configuration.
 * Allows the React frontend (localhost:5173 / localhost:3000) to make API calls
 * to the Spring Boot backend (https://doctor-appointmentbackend.onrender.com).
 *
 * In production: replace allowed origins with your actual domain.
 */
@Configuration
public class CorsConfig {

    @Value("${cors.allowed.origins:http://localhost:5173,http://localhost:3000,http://localhost:4173}")
    private String allowedOrigins;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow specific origins (from environment variable or defaults)
        config.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));

        // Allow all standard HTTP methods
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Allow all headers (especially Authorization for JWT)
        config.setAllowedHeaders(List.of("*"));

        // Allow credentials (cookies, auth headers)
        config.setAllowCredentials(true);

        // Cache preflight responses for 1 hour
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
