package com.aplyease.backend.service.impl;

import com.aplyease.backend.dto.LoginDto;
import com.aplyease.backend.dto.LoginResponseDto;
import com.aplyease.backend.dto.SignUpDto;
import com.aplyease.backend.model.Role;
import com.aplyease.backend.model.User;
import com.aplyease.backend.repository.RoleRepository;
import com.aplyease.backend.repository.UserRepository;
import com.aplyease.backend.security.JwtTokenProvider;
import com.aplyease.backend.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class AuthServiceImpl implements AuthService {
	private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthServiceImpl(AuthenticationManager authenticationManager, UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public LoginResponseDto login(LoginDto loginDto) {
        // Step 1: Authenticate
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Step 2: Generate Token
        String token = jwtTokenProvider.generateToken(authentication);

        // Step 3: Get User Details
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));
        
        String role = user.getRoles().stream().findFirst().map(Role::getName).orElse(null);

        // Step 4: Build and return the DTO
        LoginResponseDto loginResponse = new LoginResponseDto();
        loginResponse.setAccessToken(token);
        loginResponse.setUserFirstName(user.getFirstName());
        loginResponse.setUserRole(role);
        
        return loginResponse;
    }

    @Override
    public String register(SignUpDto signUpDto) {
        log.info("Attempting to register new user with email: {}", signUpDto.getEmail());
        if (userRepository.existsByEmail(signUpDto.getEmail())) {
            log.warn("Registration failed: Email already exists - {}", signUpDto.getEmail());
            throw new RuntimeException("Error: Email is already taken!");
        }

        // --- START OF NEW DEBUGGING CODE ---
        log.info("Searching for default role 'ROLE_GUEST'.");
        List<Role> allRolesInDb = roleRepository.findAll();
        // This line creates a string of all role names found, e.g., "ROLE_ADMIN, ROLE_GUEST"
        String availableRoles = allRolesInDb.stream()
                                            .map(Role::getName)
                                            .collect(Collectors.joining(", "));
        log.info("Available roles found in database: [{}]", availableRoles);
        // --- END OF NEW DEBUGGING CODE ---

        User user = new User();
        user.setFirstName(signUpDto.getFirstName());
        user.setLastName(signUpDto.getLastName());
        user.setEmail(signUpDto.getEmail());
        user.setPassword(passwordEncoder.encode(signUpDto.getPassword()));

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName("ROLE_GUEST")
                .orElseThrow(() -> new RuntimeException("Error: Default role not found."));
        roles.add(userRole);
        user.setRoles(roles);

        userRepository.save(user);
        log.info("Successfully registered user: {}", signUpDto.getEmail());
        return "User registered successfully!";
    }
}