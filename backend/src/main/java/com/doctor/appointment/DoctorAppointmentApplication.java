package com.doctor.appointment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Doctor Appointment System - Main Application Entry Point
 * Full-stack Spring Boot 3 + React 18 application
 * Features: JWT Auth, Role-based access, Doctor management, Appointment booking
 */
@SpringBootApplication
public class DoctorAppointmentApplication {

    public static void main(String[] args) {
        SpringApplication.run(DoctorAppointmentApplication.class, args);
    }
}
