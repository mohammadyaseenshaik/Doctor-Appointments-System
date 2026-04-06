package com.doctor.appointment.repository;

import com.doctor.appointment.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * DoctorRepository - Data access layer for Doctor entity.
 */
@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    /** Find all doctors by specialization */
    List<Doctor> findBySpecialization(String specialization);

    /** Find all available doctors */
    List<Doctor> findByAvailableTrue();

    /** Search doctors by name (case-insensitive) */
    List<Doctor> findByNameContainingIgnoreCase(String name);
}
