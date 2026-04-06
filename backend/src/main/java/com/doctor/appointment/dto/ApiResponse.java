package com.doctor.appointment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic API Response wrapper — ensures consistent response format across all endpoints.
 * Example: { "success": true, "message": "Login successful", "data": { ... } }
 *
 * @param <T> Type of data payload
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    /** Whether the operation was successful */
    private boolean success;

    /** Human-readable status message */
    private String message;

    /** Response payload — null for void operations */
    private T data;

    /** Convenience factory for success responses */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    /** Convenience factory for success responses without data */
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null);
    }

    /** Convenience factory for error responses */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
}
