package com.doctor.appointment.security;

import com.doctor.appointment.entity.User;
import com.doctor.appointment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Collections;

/**
 * UserDetailsServiceImpl - loads user-specific data for Spring Security authentication.
 * Bridges between our User entity and Spring Security's UserDetails model.
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Loads user by email (we use email as the username).
     * Spring Security calls this during authentication.
     *
     * @param email the user's email address
     * @return UserDetails object for Spring Security
     * @throws UsernameNotFoundException if user not found
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with email: " + email));

        // Convert our Role enum to Spring Security GrantedAuthority
        // "ROLE_" prefix is required by Spring Security for role-based auth
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
