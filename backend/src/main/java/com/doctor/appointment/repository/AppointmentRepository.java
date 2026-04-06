package com.doctor.appointment.repository;

import com.doctor.appointment.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

/**
 * AppointmentRepository - Data access layer for Appointment entity.
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    /** Get all appointments for a specific patient */
    List<Appointment> findByUserId(Long userId);

    /** Get all appointments for a specific doctor */
    List<Appointment> findByDoctorId(Long doctorId);

    /** Check if a time slot is already booked for a doctor on a given date */
    boolean existsByDoctorIdAndDateAndTime(Long doctorId, LocalDate date, String time);

    /** Get appointments for a doctor on a specific date (for availability check) */
    List<Appointment> findByDoctorIdAndDate(Long doctorId, LocalDate date);

    /** Get all appointments ordered by creation date descending */
    List<Appointment> findAllByOrderByCreatedAtDesc();
}
