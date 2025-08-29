package com.aplyease.backend.service.impl;

import com.aplyease.backend.dto.AgentDashboardStatsDto;
import com.aplyease.backend.dto.JobApplicationDto;
import com.aplyease.backend.dto.JobApplicationResponseDto;
import com.aplyease.backend.exception.ResourceNotFoundException;
import com.aplyease.backend.model.JobApplication;
import com.aplyease.backend.model.User;
import com.aplyease.backend.repository.JobApplicationRepository;
import com.aplyease.backend.repository.UserRepository;
import com.aplyease.backend.service.JobApplicationService;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;


    public JobApplicationServiceImpl(JobApplicationRepository jobApplicationRepository, UserRepository userRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<JobApplicationResponseDto> findApplicationsByCriteria(Long clientId, String ownership, String status, String search, String agentEmail) {
        User agent = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with email: " + agentEmail));

        Specification<JobApplication> spec = Specification.where(null);

        if ("mine".equalsIgnoreCase(ownership)) {
            spec = spec.and(hasAgentId(agent.getId()));
        }
        if (clientId != null) {
            spec = spec.and(hasClientId(clientId));
        }
        if (status != null && !status.isEmpty()) {
            spec = spec.and(hasStatus(status));
        }
        if (search != null && !search.isEmpty()) {
            spec = spec.and(containsSearchTerm(search));
        }

        return jobApplicationRepository.findAll(spec).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AgentDashboardStatsDto getAgentDashboardStats(String agentEmail) {
        User agent = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with email: " + agentEmail));

        long totalApps = jobApplicationRepository.countByAgentId(agent.getId());
     // BEFORE
        List<String> inProgressStatuses = List.of("Applied", "Interviewing");
        long inProgressApps = jobApplicationRepository.countByAgentIdAndStatusIn(agent.getId(), inProgressStatuses);
        long successfulApps = jobApplicationRepository.countByAgentIdAndStatus(agent.getId(), "Offer");
        long rejectedApps = jobApplicationRepository.countByAgentIdAndStatus(agent.getId(), "Rejected");
        
     // AFTER
        long completedApps = successfulApps + rejectedApps;
        double successRate = (completedApps == 0) ? 0 : ((double) successfulApps / completedApps) * 100;
        BigDecimal earnings = new BigDecimal("0.20").multiply(BigDecimal.valueOf(totalApps));

        AgentDashboardStatsDto stats = new AgentDashboardStatsDto();
        stats.setTotalApplications(totalApps);
        stats.setInProgressCount(inProgressApps);
        stats.setSuccessRate(successRate);
        stats.setTotalEarnings(earnings);
        
        return stats;
    }

    @Override
    @Transactional
    public JobApplicationResponseDto createApplication(JobApplicationDto dto, String agentEmail) {
        User agent = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with email: " + agentEmail));
        User client = userRepository.findById(dto.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with ID: " + dto.getClientId()));

        JobApplication application = new JobApplication();
        application.setAgent(agent);
        application.setClient(client);
        application.setApplicationDate(dto.getApplicationDate());
        application.setJobTitle(dto.getJobTitle());
        application.setCompanyName(dto.getCompanyName());
        application.setLocation(dto.getLocation());
        application.setJobPortal(dto.getJobPortal());
        application.setJobLink(dto.getJobLink());
        application.setResumeLink(dto.getResumeLink());
        application.setNotes(dto.getNotes());
        application.setMailSent(dto.isMailSent());
        application.setStatus("Applied");
        application.setJobPageUrl(dto.getJobPageUrl());
        application.setAdditionalLink(dto.getAdditionalLink());
        
        JobApplication savedApplication = jobApplicationRepository.save(application);
        return mapToDto(savedApplication);
    }

    @Override
    public JobApplicationResponseDto getApplicationById(Long id) {
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + id));
        return mapToDto(application);
    }

    @Override
    @Transactional
    public JobApplicationResponseDto updateApplication(Long id, JobApplicationDto dto, String agentEmail) {
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + id));
        
        application.setApplicationDate(dto.getApplicationDate());
        application.setJobTitle(dto.getJobTitle());
        application.setCompanyName(dto.getCompanyName());
        application.setLocation(dto.getLocation());
        application.setJobLink(dto.getJobLink());
        application.setNotes(dto.getNotes());
        application.setMailSent(dto.isMailSent());
        application.setJobPageUrl(dto.getJobPageUrl());
        application.setAdditionalLink(dto.getAdditionalLink());

        JobApplication updatedApplication = jobApplicationRepository.save(application);
        return mapToDto(updatedApplication);
    }

    @Override
    @Transactional
    public void deleteApplication(Long id, String agentEmail) {
        JobApplication application = jobApplicationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + id));
        jobApplicationRepository.delete(application);
    }

    @Override
    public List<JobApplicationResponseDto> getApplicationsForClient(String clientEmail) {
        User client = userRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with email: " + clientEmail));
        
        return findApplicationsByCriteria(client.getId(), "all", null, null, clientEmail);
    }
     


    private JobApplicationResponseDto mapToDto(JobApplication app) {
        JobApplicationResponseDto dto = new JobApplicationResponseDto();
        dto.setId(app.getApplicationId());
        dto.setApplicationDate(app.getApplicationDate().toString());
        dto.setJobTitle(app.getJobTitle());
        dto.setCompanyName(app.getCompanyName());
        dto.setLocation(app.getLocation());
        dto.setJobPortal(app.getJobPortal());
        dto.setStatus(app.getStatus());
        dto.setMailSent(app.isMailSent());
        dto.setJobLink(app.getJobLink());
        dto.setResumeLink(app.getResumeLink());
        dto.setJobPageUrl(app.getJobPageUrl());
        dto.setAdditionalLink(app.getAdditionalLink());
        dto.setClientRemark(app.getClientRemark());
        JobApplicationResponseDto.ClientInfoDTO clientDto = new JobApplicationResponseDto.ClientInfoDTO();
        clientDto.setFirstName(app.getClient().getFirstName());
        clientDto.setLastName(app.getClient().getLastName());
        dto.setClientUser(clientDto);
        
        JobApplicationResponseDto.AgentInfoDTO agentDto = new JobApplicationResponseDto.AgentInfoDTO();
        agentDto.setFirstName(app.getAgent().getFirstName());
        agentDto.setLastName(app.getAgent().getLastName());
        dto.setAgentUser(agentDto);

        return dto;
    }
 // In JobApplicationServiceImpl.java

    @Override
    @Transactional
    public void addClientRemark(Long applicationId, String remark, String clientEmail) {
        User client = userRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with email: " + clientEmail));

        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        // Security Check: Ensure the application belongs to the client making the request
        if (!application.getClient().getId().equals(client.getId())) {
            throw new SecurityException("Client is not authorized to add a remark to this application.");
        }

        application.setClientRemark(remark);
        jobApplicationRepository.save(application);
    }
    
 // In JobApplicationServiceImpl.java
    @Override
    @Transactional
    public JobApplicationResponseDto updateApplicationStatus(Long applicationId, String status, String agentEmail) {
        User agent = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found: " + agentEmail));

        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + applicationId));

        // Optional but recommended: Security check
        if (!application.getAgent().getId().equals(agent.getId())) {
            // You can add more complex logic here, e.g., check if the agent manages the client
            throw new SecurityException("Agent is not authorized to update this application.");
        }

        application.setStatus(status);
        JobApplication updatedApplication = jobApplicationRepository.save(application);
        return mapToDto(updatedApplication);
    }
    
    // --- Private Helper Methods for Specifications ---
    private Specification<JobApplication> hasAgentId(Long agentId) {
        return (root, query, cb) -> cb.equal(root.get("agent").get("id"), agentId);
    }

    private Specification<JobApplication> hasClientId(Long clientId) {
        return (root, query, cb) -> cb.equal(root.get("client").get("id"), clientId);
    }

    private Specification<JobApplication> hasStatus(String status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    private Specification<JobApplication> containsSearchTerm(String searchTerm) {
        String likePattern = "%" + searchTerm.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("jobTitle")), likePattern),
                cb.like(cb.lower(root.get("companyName")), likePattern)
        );
    }
}