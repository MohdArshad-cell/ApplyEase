package com.aplyease.backend.service.impl;

import com.aplyease.backend.dto.AdminApplicationDto;
import com.aplyease.backend.dto.AdminDashboardStatsDto;
import com.aplyease.backend.dto.ApplicationUpdateRequestDto;
import com.aplyease.backend.dto.UserCreateRequestDto;
import com.aplyease.backend.dto.UserDto;
import com.aplyease.backend.dto.UserUpdateRequestDto;
import com.aplyease.backend.exception.ResourceNotFoundException;
import com.aplyease.backend.model.JobApplication;
import com.aplyease.backend.model.Role;
import com.aplyease.backend.model.User;
import com.aplyease.backend.repository.JobApplicationRepository;
import com.aplyease.backend.repository.RoleRepository;
import com.aplyease.backend.repository.UserRepository;
import com.aplyease.backend.service.AdminService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminServiceImpl(UserRepository userRepository, 
            JobApplicationRepository jobApplicationRepository, 
            RoleRepository roleRepository, 
            PasswordEncoder passwordEncoder) {
this.userRepository = userRepository;
this.jobApplicationRepository = jobApplicationRepository;
this.roleRepository = roleRepository;
this.passwordEncoder = passwordEncoder;
}
    @Override
    public AdminDashboardStatsDto getDashboardStats() {
        long totalApplications = jobApplicationRepository.count();
        long totalClients = userRepository.findByRoles_Name("ROLE_CLIENT").size();
        long totalAgents = userRepository.findByRoles_Name("ROLE_AGENT").size();
        long successfulPlacements = jobApplicationRepository.countByStatus("Offer");
        
        return new AdminDashboardStatsDto(totalApplications, totalClients, totalAgents, successfulPlacements);
    }

    

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
            .stream()
            .map(this::mapToUserDto)
            .collect(Collectors.toList());
    }
    
    // MODIFIED: This method now saves all fields from the new modal form
    @Override
    public AdminApplicationDto updateApplication(Long id, ApplicationUpdateRequestDto requestDto) {
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        // Update all fields from the request
        application.setJobTitle(requestDto.getJobTitle());
        application.setCompanyName(requestDto.getCompanyName());
        application.setLocation(requestDto.getLocation());
        application.setStatus(requestDto.getStatus());
        application.setApplicationDate(requestDto.getApplicationDate());
        application.setJobPortal(requestDto.getJobPortal());
        application.setJobLink(requestDto.getJobLink());
        application.setJobPageUrl(requestDto.getJobPageUrl());
        application.setResumeLink(requestDto.getResumeLink());
        application.setAdditionalLink(requestDto.getAdditionalLink());
        application.setClientRemark(requestDto.getClientRemark());
        application.setNotes(requestDto.getNotes());
        application.setMailSent(requestDto.isMailSent());

        JobApplication savedApplication = jobApplicationRepository.save(application);

        return mapToAdminApplicationDto(savedApplication);
    }
    
    @Override
    public void deleteApplication(Long id) {
        if (!jobApplicationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Application not found with id: " + id);
        }
        jobApplicationRepository.deleteById(id);
    }
    @Override
    public List<AdminApplicationDto> getAllApplications() {
        // MODIFIED: Added sorting to the database query
        List<JobApplication> sortedApplications = jobApplicationRepository.findAll(
            Sort.by(Sort.Direction.DESC, "applicationDate")
        );

        return sortedApplications.stream()
                .map(this::mapToAdminApplicationDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public UserDto createUser(UserCreateRequestDto requestDto) {
        if (userRepository.existsByEmail(requestDto.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }
        User user = new User();
        user.setFirstName(requestDto.getFirstName());
        user.setLastName(requestDto.getLastName());
        user.setEmail(requestDto.getEmail());
        user.setPassword(passwordEncoder.encode(requestDto.getPassword()));
        
        Role userRole = roleRepository.findByName(requestDto.getRole())
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        user.setRoles(Set.of(userRole));
        
        User savedUser = userRepository.save(user);
        return mapToUserDto(savedUser);
    }

 // In AdminServiceImpl.java
    @Override
    public UserDto updateUser(Long userId, UserUpdateRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check if the new email is already taken by another user
        userRepository.findByEmail(requestDto.getEmail()).ifPresent(existingUser -> {
            if (!existingUser.getId().equals(userId)) {
                throw new RuntimeException("Error: Email is already in use by another account!");
            }
        });
                
        user.setFirstName(requestDto.getFirstName());
        user.setLastName(requestDto.getLastName());
        user.setEmail(requestDto.getEmail());

        Role userRole = roleRepository.findByName(requestDto.getRole())
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        // SAFER WAY to update the role collection
        user.getRoles().clear();
        user.getRoles().add(userRole);

        User updatedUser = userRepository.save(user);
        return mapToUserDto(updatedUser);
    }

    @Override
    public void toggleUserStatus(Long userId, boolean isActive) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setActive(isActive);
        userRepository.save(user);
    }
 // In AdminServiceImpl.java

    // --- Helper Methods ---

    // MODIFIED: This method now sends all fields to the frontend
    private AdminApplicationDto mapToAdminApplicationDto(JobApplication app) {
        AdminApplicationDto dto = new AdminApplicationDto();
        dto.setId(app.getApplicationId());
        dto.setJobTitle(app.getJobTitle());
        dto.setCompany(app.getCompanyName());
        dto.setLocation(app.getLocation());
        dto.setDateApplied(app.getApplicationDate());
        dto.setStatus(app.getStatus());
        dto.setJobPortal(app.getJobPortal());
        dto.setJobLink(app.getJobLink());
        dto.setJobPageUrl(app.getJobPageUrl());
        dto.setResumeLink(app.getResumeLink());
        dto.setAdditionalLink(app.getAdditionalLink());
        dto.setClientRemark(app.getClientRemark());
        dto.setNotes(app.getNotes());
        dto.setMailSent(app.isMailSent());
        
        if (app.getClient() != null) {
            dto.setClientName(app.getClient().getFirstName() + " " + app.getClient().getLastName());
            dto.setClientId(app.getClient().getId());
        }
        if (app.getAgent() != null) {
            dto.setAgentName(app.getAgent().getFirstName() + " " + app.getAgent().getLastName());
            dto.setAgentId(app.getAgent().getId());
        }
        
        return dto;
    }

    private UserDto mapToUserDto(User user) {
        return new UserDto(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()),
            user.isActive()
        );
    }
}