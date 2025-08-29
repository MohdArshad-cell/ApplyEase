package com.aplyease.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority; // <-- Add this import
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Collection; // <-- Add this import
import java.util.Date;
import java.util.List; // <-- Add this import
import java.util.stream.Collectors; // <-- Add this import

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-milliseconds}")
    private long jwtExpirationDate;

    // Generates a JWT token for a user
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + jwtExpirationDate);

        // === START: ADDED CODE ===
        // Get the roles from the Authentication object
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        
        // Convert the authorities into a list of strings
        List<String> roles = authorities.stream()
                                        .map(GrantedAuthority::getAuthority)
                                        .collect(Collectors.toList());
        // === END: ADDED CODE ===


        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles) // <-- THIS IS THE NEW LINE THAT ADDS ROLES
                .setIssuedAt(new Date())
                .setExpiration(expireDate)
                .signWith(key())
                .compact();
    }

    // Creates the secret key for signing from the Base64 secret
 // In JwtTokenProvider.java
    public SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    // Gets the username from a JWT token
    public String getUsername(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    // Validates the JWT token
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key())
                    .build()
                    .parse(token);
            return true;
        } catch (Exception ex) {
            // Log the exception for debugging purposes
            return false;
        }
    }
}