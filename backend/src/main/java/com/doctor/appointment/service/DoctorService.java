package com.doctor.appointment.service;

import com.doctor.appointment.dto.DoctorDTO;
import com.doctor.appointment.entity.Doctor;
import com.doctor.appointment.exception.ResourceNotFoundException;
import com.doctor.appointment.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * DoctorService - business logic for doctor management.
 *
 * Admin operations: add, update, delete doctors
 * Public operations: list all doctors, search, get by ID
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DoctorService {

    private final DoctorRepository doctorRepository;

    /** Get all doctors (public endpoint) */
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    /** Get a single doctor by ID — throws 404 if not found */
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", id));
    }

    /**
     * Add a new doctor (Admin only).
     * Maps DoctorDTO to Doctor entity and saves to DB.
     */
    public Doctor addDoctor(DoctorDTO dto) {
        Doctor doctor = Doctor.builder()
                .name(dto.getName())
                .specialization(dto.getSpecialization())
                .experience(dto.getExperience())
                .fee(dto.getFee())
                .imageUrl(dto.getImageUrl())
                .qualification(dto.getQualification())
                .hospital(dto.getHospital())
                .availableSlots(dto.getAvailableSlots())
                .available(dto.isAvailable())
                .build();

        Doctor saved = doctorRepository.save(doctor);
        log.info("New doctor added: {} ({})", saved.getName(), saved.getSpecialization());
        return saved;
    }

    /**
     * Update an existing doctor's details (Admin only).
     * Only updates provided fields; preserves existing data otherwise.
     */
    public Doctor updateDoctor(Long id, DoctorDTO dto) {
        Doctor doctor = getDoctorById(id);

        // Update all fields from DTO
        doctor.setName(dto.getName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setExperience(dto.getExperience());
        doctor.setFee(dto.getFee());
        doctor.setAvailableSlots(dto.getAvailableSlots());
        doctor.setAvailable(dto.isAvailable());

        if (dto.getImageUrl() != null) doctor.setImageUrl(dto.getImageUrl());
        if (dto.getQualification() != null) doctor.setQualification(dto.getQualification());
        if (dto.getHospital() != null) doctor.setHospital(dto.getHospital());

        Doctor updated = doctorRepository.save(doctor);
        log.info("Doctor updated: {}", updated.getId());
        return updated;
    }

    /**
     * Delete a doctor (Admin only).
     * Note: In production, consider soft delete or checking existing appointments.
     */
    public void deleteDoctor(Long id) {
        Doctor doctor = getDoctorById(id);
        doctorRepository.delete(doctor);
        log.info("Doctor deleted: {}", id);
    }

    /** Get available time slots for a specific doctor */
    public String[] getAvailableSlots(Long doctorId) {
        Doctor doctor = getDoctorById(doctorId);
        if (doctor.getAvailableSlots() == null || doctor.getAvailableSlots().isBlank()) {
            return new String[0];
        }
        return doctor.getAvailableSlots().split(",");
    }
}
