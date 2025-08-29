package com.aplyease.backend.controller;

import com.aplyease.backend.dto.JobApplicationResponseDto;
import com.aplyease.backend.model.JobApplication;
import com.aplyease.backend.service.JobApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/me")
public class MeController {

    private final JobApplicationService jobApplicationService;

    public MeController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    @GetMapping("/applications")
    public ResponseEntity<List<JobApplicationResponseDto>> getMyApplications(Principal principal) {
        // ...
            // Spring Security provides the 'Principal' object, which contains the logged-in user's name (email)
    	String userEmail = principal.getName();
    	// Use the correct method name from the service
    	List<JobApplicationResponseDto> applications = jobApplicationService.getApplicationsForClient(userEmail);
        return ResponseEntity.ok(applications);
    }
}
