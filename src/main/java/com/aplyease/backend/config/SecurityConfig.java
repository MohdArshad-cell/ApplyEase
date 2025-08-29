package com.aplyease.backend.config;

import com.aplyease.backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(authorize -> authorize
                // Explicitly list all public HTML pages and asset folders
                .requestMatchers(
                    "/", 
                    "/index.html", 
                    "/favicon.ico",
                    "/login.html", 
                    "/register.html", 
                    "/contact.html", 
                    "/dashboard.html", 
                    "/dashboard-agent.html", 
                    "/features.html", 
                    "/pricing.html", 
                    "/profile.html",
                    "/application-guest.html",
                    "/css/**", 
                    "/js/**", 
                    "/partials/**", 
                    "/images/**"
                ).permitAll()
                // Allow access to login/register APIs
                .requestMatchers("/api/auth/**").permitAll()
                // All other requests must be authenticated
             // Updated version using hasAnyAuthority
                .requestMatchers("/api/clients").permitAll()
                .requestMatchers("/api/applications/client/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_AGENT")
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
