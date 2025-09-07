package com.aplyease.backend.service.impl;

import com.aplyease.backend.dto.UserDto;
import com.aplyease.backend.model.Role;
import com.aplyease.backend.model.User;
import com.aplyease.backend.repository.UserRepository;
import com.aplyease.backend.service.UserService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<UserDto> getAllClients() {
        // This finds all users with the "ROLE_CLIENT" and converts them to DTOs
        return userRepository.findByRoles_Name("ROLE_CLIENT")
                .stream()
                .map(this::mapToUserDto) // Correctly calls the single helper method
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        // Correctly calls the single helper method
        return mapToUserDto(user);
    }

    // --- Helper Method ---
    // This is the single, correct method for converting a User entity to a UserDto
    private UserDto mapToUserDto(User user) {
        return new UserDto(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet()),
            user.isActive()
        );
    }
    
    // The incorrect "convertToClientDto" method has been removed.
}