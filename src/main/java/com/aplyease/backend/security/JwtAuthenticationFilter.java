// src/main/java/com/aplyease/backend/security/JwtAuthenticationFilter.java

package com.aplyease.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // Setup a logger for this class
    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        log.info("AplyEase Auth: Intercepting request for {}", request.getRequestURI());

        String token = getJWTFromRequest(request);

        if (StringUtils.hasText(token)) {
            try {
                // We wrap the logic in a try-catch to find validation errors
                if (tokenProvider.validateToken(token)) {
                    log.info("AplyEase Auth: JWT validation successful.");
                    
                    String username = tokenProvider.getUsername(token);
                    
                    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        log.info("AplyEase Auth: Authenticating user '{}'.", username);
                        
                        UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                        );
                        
                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

                        log.info("AplyEase Auth: Authentication successful. User '{}' has been set in SecurityContext.", username);
                    }
                }
            } catch (ExpiredJwtException e) {
                log.error("AplyEase Auth Error: JWT token is expired: {}", e.getMessage());
            } catch (JwtException e) {
                log.error("AplyEase Auth Error: JWT validation failed: {}", e.getMessage());
            } catch (Exception e) {
                log.error("AplyEase Auth Error: An unexpected error occurred during JWT processing.", e);
            }
        } else {
            log.warn("AplyEase Auth: Request to {} did not contain a JWT Bearer token.", request.getRequestURI());
        }

        filterChain.doFilter(request, response);
    }

    private String getJWTFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}