package com.doctor.appointment.controller;

import com.doctor.appointment.dto.ApiResponse;
import com.doctor.appointment.dto.DoctorDTO;
import com.doctor.appointment.entity.Doctor;
import com.doctor.appointment.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * DoctorController - REST API for doctor management.
 *
 * Public:  GET /doctors, GET /doctors/{id}
 * Admin:   POST /doctors, PUT /doctors/{id}, DELETE /doctors/{id}
 */
@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    /**
     * Get all doctors — public endpoint.
     * Response: list of all doctors with their details and slots.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Doctor>>> getAllDoctors() {
        List<Doctor> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(ApiResponse.success("Doctors fetched successfully", doctors));
    }

    /**
     * Get single doctor by ID — public endpoint.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Doctor>> getDoctorById(@PathVariable Long id) {
        Doctor doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor fetched successfully", doctor));
    }

    /**
     * Add a new doctor — ADMIN only.
     * Requires: Authorization: Bearer <admin_jwt_token>
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Doctor>> addDoctor(@Valid @RequestBody DoctorDTO dto) {
        Doctor doctor = doctorService.addDoctor(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Doctor added successfully", doctor));
    }

    /**
     * Update doctor details — ADMIN only.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Doctor>> updateDoctor(
            @PathVariable Long id,
            @Valid @RequestBody DoctorDTO dto) {
        Doctor doctor = doctorService.updateDoctor(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Doctor updated successfully", doctor));
    }

    /**
     * Delete a doctor — ADMIN only.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor deleted successfully"));
    }
}
