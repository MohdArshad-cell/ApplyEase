package com.aplyease.backend.controller;

import com.aplyease.backend.dto.JobApplicationDto;
import com.aplyease.backend.model.JobApplication;
import com.aplyease.backend.service.JobApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    // Endpoint for a USER or ADMIN to create a new application for a client
    @PostMapping
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<JobApplication> createApplication(@RequestBody JobApplicationDto jobApplicationDto, Principal principal) {
        // 'principal.getName()' will give us the email of the currently logged-in user
        JobApplication createdApplication = jobApplicationService.createApplication(jobApplicationDto, principal.getName());
        return new ResponseEntity<>(createdApplication, HttpStatus.CREATED);
    }

    // Endpoint for a CLIENT to view their own applications
    @GetMapping("/my-applications")
    @PreAuthorize("hasAnyRole('CLIENT', 'AGENT')")
    public ResponseEntity<List<JobApplication>> getMyApplications(Principal principal) {
        List<JobApplication> applications = jobApplicationService.getApplicationsForClient(principal.getName());
        return ResponseEntity.ok(applications);
    }
}