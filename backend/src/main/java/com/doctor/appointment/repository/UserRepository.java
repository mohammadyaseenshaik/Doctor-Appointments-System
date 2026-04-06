package com.doctor.appointment.repository;

import com.doctor.appointment.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * UserRepository - Data access layer for User entity.
 * Spring Data JPA auto-implements all CRUD operations.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** Find user by email — used for authentication */
    Optional<User> findByEmail(String email);

    /** Check if email is already registered */
    boolean existsByEmail(String email);
}
