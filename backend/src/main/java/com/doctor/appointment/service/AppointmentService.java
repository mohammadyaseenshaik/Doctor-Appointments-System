package com.doctor.appointment.service;

import com.doctor.appointment.dto.AppointmentDTO;
import com.doctor.appointment.dto.AppointmentStatusDTO;
import com.doctor.appointment.entity.Appointment;
import com.doctor.appointment.entity.Doctor;
import com.doctor.appointment.entity.User;
import com.doctor.appointment.exception.ResourceNotFoundException;
import com.doctor.appointment.repository.AppointmentRepository;
import com.doctor.appointment.repository.DoctorRepository;
import com.doctor.appointment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * AppointmentService - core business logic for booking and managing appointments.
 *
 * Key business rules:
 * - A time slot can only be booked once per doctor per day
 * - Patients can only view their own appointments
 * - Admins can view and update status of all appointments
 * - Status transitions: PENDING → APPROVED/REJECTED → COMPLETED
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    /**
     * Book a new appointment.
     *
     * Flow:
     * 1. Validate user and doctor exist
     * 2. Check slot availability (prevent double booking)
     * 3. Create appointment with PENDING status
     *
     * @param userId the ID of the patient booking
     * @param dto    appointment details
     * @return the created Appointment
     */
    public Appointment bookAppointment(Long userId, AppointmentDTO dto) {
        // Validate patient exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        // Validate doctor exists and is available
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", dto.getDoctorId()));

        if (!doctor.isAvailable()) {
            throw new IllegalStateException("Doctor is not accepting appointments at this time");
        }

        // Check if the time slot is already booked (prevent double booking)
        boolean slotTaken = appointmentRepository
                .existsByDoctorIdAndDateAndTime(dto.getDoctorId(), dto.getDate(), dto.getTime());
        if (slotTaken) {
            throw new IllegalStateException(
                    "Time slot " + dto.getTime() + " on " + dto.getDate() + " is already booked");
        }

        // Create and save the appointment
        Appointment appointment = Appointment.builder()
                .user(user)
                .doctor(doctor)
                .date(dto.getDate())
                .time(dto.getTime())
                .notes(dto.getNotes())
                .status(Appointment.Status.PENDING)
                .paymentStatus(Appointment.PaymentStatus.PENDING)
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        log.info("Appointment booked: User {} with Doctor {} on {} at {}",
                userId, dto.getDoctorId(), dto.getDate(), dto.getTime());

        return saved;
    }

    /**
     * Get all appointments for a specific patient.
     * Returns most recent first.
     */
    public List<Appointment> getAppointmentsByUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", userId);
        }
        return appointmentRepository.findByUserId(userId);
    }

    /**
     * Get ALL appointments — Admin only.
     * Returns all appointments ordered by creation date.
     */
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Update appointment status — Admin only.
     * Validates the status value and updates the appointment.
     *
     * @param appointmentId the appointment to update
     * @param dto           contains the new status
     * @return updated Appointment
     */
    public Appointment updateStatus(Long appointmentId, AppointmentStatusDTO dto) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", appointmentId));

        // Validate status value
        try {
            Appointment.Status newStatus = Appointment.Status.valueOf(dto.getStatus().toUpperCase());
            appointment.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException("Invalid status: " + dto.getStatus() +
                    ". Valid values: PENDING, APPROVED, REJECTED, COMPLETED");
        }

        Appointment updated = appointmentRepository.save(appointment);
        log.info("Appointment {} status updated to {}", appointmentId, dto.getStatus());
        return updated;
    }

    /**
     * Update payment status for an appointment (called after payment).
     */
    public Appointment updatePaymentStatus(Long appointmentId, String paymentStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", appointmentId));

        appointment.setPaymentStatus(Appointment.PaymentStatus.valueOf(paymentStatus));
        return appointmentRepository.save(appointment);
    }

    /** Get single appointment by ID */
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", id));
    }
}
