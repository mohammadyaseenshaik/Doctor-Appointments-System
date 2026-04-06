package com.doctor.appointment.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JwtUtil - Handles all JWT token operations.
 * - Generates tokens on login/register
 * - Validates tokens on each protected request
 * - Extracts claims (email, expiry, etc.) from tokens
 *
 * Algorithm: HMAC-SHA256 (HS256)
 * Token lifetime: Configurable via jwt.expiration (default 24h)
 */
@Component
public class JwtUtil {

    /** Secret key from application.properties */
    @Value("${jwt.secret}")
    private String secret;

    /** Token expiration in milliseconds (default: 24 hours = 86400000ms) */
    @Value("${jwt.expiration}")
    private long expiration;

    /**
     * Generate a JWT token for a successfully authenticated user.
     *
     * @param userDetails the authenticated user
     * @return signed JWT token string
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }

    /**
     * Create and sign the JWT token with HS256 algorithm.
     *
     * @param claims   additional payload claims
     * @param subject  the email/username of the user
     * @return signed JWT string
     */
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Validate a token against the UserDetails.
     * Checks: username matches AND token not expired.
     *
     * @param token       the JWT token from Authorization header
     * @param userDetails the user to validate against
     * @return true if token is valid
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /** Extract email (subject) from token */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /** Extract expiration date from token */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /** Generic claim extractor */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /** Parse and return all claims from the token */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /** Check if token has expired */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /** Build the HMAC signing key from the secret string */
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
