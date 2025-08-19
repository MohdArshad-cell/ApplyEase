package com.aplyease.backend.controller;

import com.aplyease.backend.dto.UserDto;
import com.aplyease.backend.model.User;
import com.aplyease.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()") // Ensures only logged-in users can access this
    public ResponseEntity<UserDto> getCurrentUser(Principal principal) {
        // Find the full user object from the database using the email from the token
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found: " + principal.getName()));

        // Create a DTO to safely transfer user data
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());

        // Get the names of the roles and add them to the DTO
        Set<String> roles = user.getRoles().stream()
                            .map(role -> role.getName())
                            .collect(Collectors.toSet());
        userDto.setRoles(roles);

        return ResponseEntity.ok(userDto);
    }
 // Add this method inside your UserController.java class

    @GetMapping("/clients")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<List<UserDto>> getAllClients() {
        // We'll find all users that have the "ROLE_CLIENT"
        List<UserDto> clients = userRepository.findAll().stream()
                .filter(user -> user.getRoles().stream()
                        .anyMatch(role -> role.getName().equals("ROLE_CLIENT")))
                .map(user -> { // Convert each client User to a UserDto
                    UserDto userDto = new UserDto();
                    userDto.setId(user.getId());
                    userDto.setFirstName(user.getFirstName());
                    userDto.setLastName(user.getLastName());
                    userDto.setEmail(user.getEmail());
                    return userDto;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(clients);
    }
}

