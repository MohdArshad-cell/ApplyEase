package com.aplyease.backend.service.impl;

import com.aplyease.backend.dto.JobApplicationDto;
import com.aplyease.backend.model.JobApplication;
import com.aplyease.backend.model.User;
import com.aplyease.backend.repository.JobApplicationRepository;
import com.aplyease.backend.repository.UserRepository;
import com.aplyease.backend.service.JobApplicationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;

    public JobApplicationServiceImpl(JobApplicationRepository jobApplicationRepository, UserRepository userRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.userRepository = userRepository;
    }

    @Override
    public JobApplication createApplication(JobApplicationDto dto, String applicatorEmail) {
        // Find the user who is creating the application
        User applicator = userRepository.findByEmail(applicatorEmail)
                .orElseThrow(() -> new RuntimeException("Applicator not found"));

        // Find the client this application is for
        User client = userRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        // Create and save the new application
        JobApplication newApp = new JobApplication();
        newApp.setCompanyName(dto.getCompanyName());
        newApp.setJobTitle(dto.getJobTitle());
        newApp.setJobCategory(dto.getJobCategory());
        newApp.setLocation(dto.getLocation());
        newApp.setStatus(dto.getStatus());
        newApp.setApplicationDate(dto.getApplicationDate());
        newApp.setJobPortal(dto.getJobPortal());
        newApp.setJobLink(dto.getJobLink());
        newApp.setResumeLink(dto.getResumeLink());
        newApp.setNotes(dto.getNotes());
        newApp.setMailSent(dto.isMailSent());
        
        newApp.setClient(client); // Link to the client
        newApp.setAppliedBy(applicator); // Link to the user who applied

        return jobApplicationRepository.save(newApp);
    }

    @Override
    public List<JobApplication> getApplicationsForClient(String clientEmail) {
        User client = userRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        return jobApplicationRepository.findByClient(client);
    }
}