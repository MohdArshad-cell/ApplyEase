package com.aplyease.backend.controller;

import com.aplyease.backend.dto.AgentDashboardStatsDto;
import com.aplyease.backend.dto.JobApplicationDto;
import com.aplyease.backend.dto.JobApplicationResponseDto;
import com.aplyease.backend.service.JobApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://127.0.0.1:5500") // This is a good addition for local dev
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    /**
     * NEW: Flexible endpoint to get applications based on multiple filter criteria.
     * This replaces the old getApplicationsByClientId method.
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_AGENT', 'ROLE_ADMIN')")
    public ResponseEntity<List<JobApplicationResponseDto>> getApplications(
            @RequestParam(required = false) Long clientId,
            @RequestParam(required = false, defaultValue = "mine") String ownership,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            Principal principal) {
        
        List<JobApplicationResponseDto> applications = jobApplicationService.findApplicationsByCriteria(
                clientId, ownership, status, search, principal.getName());
        return ResponseEntity.ok(applications);
    }

    /**
     * NEW: Endpoint to get stats for the agent dashboard cards.
     */
    @GetMapping("/agent-stats")
    @PreAuthorize("hasAnyAuthority('ROLE_AGENT', 'ROLE_ADMIN')")
    public ResponseEntity<AgentDashboardStatsDto> getAgentDashboardStats(Principal principal) {
        AgentDashboardStatsDto stats = jobApplicationService.getAgentDashboardStats(principal.getName());
        return ResponseEntity.ok(stats);
    }
    
    // --- The rest of your CRUD and client-specific endpoints are great and remain the same ---

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_AGENT', 'ROLE_ADMIN')")
    public ResponseEntity<JobApplicationResponseDto> createApplication(@RequestBody JobApplicationDto jobApplicationDto, Principal principal) {
        JobApplicationResponseDto createdApplication = jobApplicationService.createApplication(jobApplicationDto, principal.getName());
        return new ResponseEntity<>(createdApplication, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_AGENT', 'ROLE_ADMIN')")
    public ResponseEntity<JobApplicationResponseDto> getApplicationById(@PathVariable Long id) {
        JobApplicationResponseDto application = jobApplicationService.getApplicationById(id);
        return ResponseEntity.ok(application);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_AGENT', 'ROLE_ADMIN')")
    public ResponseEntity<JobApplicationResponseDto> updateApplication(@PathVariable Long id, @RequestBody JobApplicationDto jobApplicationDto, Principal principal) {
        JobApplicationResponseDto updatedApplication = jobApplicationService.updateApplication(id, jobApplicationDto, principal.getName());
        return ResponseEntity.ok(updatedApplication);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_AGENT', 'ROLE_ADMIN')")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id, Principal principal) {
        jobApplicationService.deleteApplication(id, principal.getName());
        return ResponseEntity.noContent().build(); 
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<List<JobApplicationResponseDto>> getMyApplications(Principal principal) {
        List<JobApplicationResponseDto> applications = jobApplicationService.getApplicationsForClient(principal.getName());
        return ResponseEntity.ok(applications);
    }
    @PutMapping("/{id}/remark")
    @PreAuthorize("hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<?> addClientRemark(@PathVariable Long id, @RequestBody Map<String, String> payload, Principal principal) {
        String remark = payload.get("remark");
        jobApplicationService.addClientRemark(id, remark, principal.getName());
        return ResponseEntity.ok().build();
    }
 // In JobApplicationController.java


    // ... inside the class

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_AGENT')")
    public ResponseEntity<JobApplicationResponseDto> updateStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> payload, 
            Principal principal) {
                
        String newStatus = payload.get("status");
        JobApplicationResponseDto updatedApplication = jobApplicationService.updateApplicationStatus(id, newStatus, principal.getName());
        return ResponseEntity.ok(updatedApplication);
    }

}