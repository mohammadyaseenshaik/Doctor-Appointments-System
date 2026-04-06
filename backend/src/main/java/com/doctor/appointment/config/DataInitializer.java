package com.doctor.appointment.config;

import com.doctor.appointment.entity.Appointment;
import com.doctor.appointment.entity.Doctor;
import com.doctor.appointment.entity.User;
import com.doctor.appointment.repository.AppointmentRepository;
import com.doctor.appointment.repository.DoctorRepository;
import com.doctor.appointment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * DataInitializer - Seeds demo data on application startup.
 *
 * Creates:
 * - 1 Admin user:   admin@hospital.com / admin123
 * - 1 Patient user: patient@example.com / patient123
 * - 8 Sample doctors across various specializations
 * - 2 Sample appointments for demo
 *
 * This runs only in development (H2) mode.
 * In production with MySQL, use Flyway or Liquibase migrations instead.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Only seed if DB is empty (avoid duplicate data on restart)
        if (userRepository.count() > 0) {
            log.info("Database already has data — skipping seed");
            return;
        }

        log.info("Seeding demo data...");
        seedUsers();
        seedDoctors();
        seedAppointments();
        log.info("Demo data seeded successfully!");
        log.info("==============================================");
        log.info("Admin login:   admin@hospital.com / admin123");
        log.info("Patient login: patient@example.com / patient123");
        log.info("==============================================");
    }

    private void seedUsers() {
        // Admin account
        User admin = User.builder()
                .name("Dr. Admin")
                .email("admin@hospital.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.Role.ADMIN)
                .build();
        userRepository.save(admin);

        // Patient account
        User patient = User.builder()
                .name("Rahul Sharma")
                .email("patient@example.com")
                .password(passwordEncoder.encode("patient123"))
                .role(User.Role.PATIENT)
                .build();
        userRepository.save(patient);
    }

    private void seedDoctors() {
        String defaultSlots = "09:00,10:00,11:00,12:00,14:00,15:00,16:00,17:00";

        Doctor[] doctors = {
            Doctor.builder()
                .name("Dr. Priya Sharma")
                .specialization("Cardiologist")
                .experience(12)
                .fee(800.0)
                .qualification("MBBS, MD (Cardiology)")
                .hospital("City Heart Hospital")
                .imageUrl("https://randomuser.me/api/portraits/women/44.jpg")
                .availableSlots(defaultSlots)
                .available(true)
                .build(),

            Doctor.builder()
                .name("Dr. Arjun Mehta")
                .specialization("Neurologist")
                .experience(8)
                .fee(1000.0)
                .qualification("MBBS, MD (Neurology), DM")
                .hospital("Brain & Spine Institute")
                .imageUrl("https://randomuser.me/api/portraits/men/32.jpg")
                .availableSlots("10:00,11:00,14:00,15:00,16:00")
                .available(true)
                .build(),

            Doctor.builder()
                .name("Dr. Sneha Patel")
                .specialization("Dermatologist")
                .experience(6)
                .fee(600.0)
                .qualification("MBBS, MD (Dermatology)")
                .hospital("Skin Care Clinic")
                .imageUrl("https://randomuser.me/api/portraits/women/65.jpg")
                .availableSlots("09:00,10:00,11:00,15:00,16:00,17:00")
                .available(true)
                .build(),

            Doctor.builder()
                .name("Dr. Vikram Singh")
                .specialization("Orthopedic")
                .experience(15)
                .fee(900.0)
                .qualification("MBBS, MS (Orthopaedics)")
                .hospital("Bone & Joint Hospital")
                .imageUrl("https://randomuser.me/api/portraits/men/51.jpg")
                .availableSlots("09:00,10:00,11:00,14:00,15:00")
                .available(true)
                .build(),

            Doctor.builder()
                .name("Dr. Ananya Gupta")
                .specialization("Gynecologist")
                .experience(10)
                .fee(700.0)
                .qualification("MBBS, MD (OBGYN)")
                .hospital("Women's Health Center")
                .imageUrl("https://randomuser.me/api/portraits/women/33.jpg")
                .availableSlots("10:00,11:00,12:00,14:00,15:00,16:00")
                .available(true)
                .build(),

            Doctor.builder()
                .name("Dr. Rajesh Kumar")
                .specialization("Pediatrician")
                .experience(9)
                .fee(500.0)
                .qualification("MBBS, MD (Pediatrics)")
                .hospital("Children's Medical Center")
                .imageUrl("https://randomuser.me/api/portraits/men/28.jpg")
                .availableSlots(defaultSlots)
                .available(true)
                .build(),

            Doctor.builder()
                .name("Dr. Meera Nair")
                .specialization("Psychiatrist")
                .experience(7)
                .fee(750.0)
                .qualification("MBBS, MD (Psychiatry)")
                .hospital("Mind Wellness Center")
                .imageUrl("https://randomuser.me/api/portraits/women/18.jpg")
                .availableSlots("11:00,12:00,14:00,15:00,16:00")
                .available(true)
                .build(),

            Doctor.builder()
                .name("Dr. Sanjay Reddy")
                .specialization("General Physician")
                .experience(20)
                .fee(400.0)
                .qualification("MBBS, MRCP")
                .hospital("Apollo General Hospital")
                .imageUrl("https://randomuser.me/api/portraits/men/76.jpg")
                .availableSlots(defaultSlots)
                .available(true)
                .build()
        };

        for (Doctor doctor : doctors) {
            doctorRepository.save(doctor);
        }
    }

    private void seedAppointments() {
        User patient = userRepository.findByEmail("patient@example.com").orElse(null);
        Doctor doctor = doctorRepository.findAll().get(0);

        if (patient != null && doctor != null) {
            // A past completed appointment
            Appointment past = Appointment.builder()
                    .user(patient)
                    .doctor(doctor)
                    .date(LocalDate.now().minusDays(5))
                    .time("10:00")
                    .notes("Regular checkup")
                    .status(Appointment.Status.COMPLETED)
                    .paymentStatus(Appointment.PaymentStatus.PAID)
                    .build();
            appointmentRepository.save(past);

            // An upcoming pending appointment
            Appointment upcoming = Appointment.builder()
                    .user(patient)
                    .doctor(doctorRepository.findAll().get(1))
                    .date(LocalDate.now().plusDays(3))
                    .time("14:00")
                    .notes("Headache for 2 weeks")
                    .status(Appointment.Status.APPROVED)
                    .paymentStatus(Appointment.PaymentStatus.PAID)
                    .build();
            appointmentRepository.save(upcoming);
        }
    }
}
