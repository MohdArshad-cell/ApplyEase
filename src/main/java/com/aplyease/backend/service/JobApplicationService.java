package com.aplyease.backend.service;

import com.aplyease.backend.dto.AgentDashboardStatsDto;

import com.aplyease.backend.dto.JobApplicationDto;
import com.aplyease.backend.dto.JobApplicationResponseDto;

import java.util.List;

public interface JobApplicationService {
    JobApplicationResponseDto createApplication(JobApplicationDto jobApplicationDto, String agentEmail);
    
    JobApplicationResponseDto getApplicationById(Long id);
    JobApplicationResponseDto updateApplication(Long id, JobApplicationDto jobApplicationDto, String agentEmail);
    void deleteApplication(Long id, String agentEmail);
    List<JobApplicationResponseDto> getApplicationsForClient(String clientEmail);
 // In JobApplicationService.java interface
    AgentDashboardStatsDto getAgentDashboardStats(String agentEmail);
    List<JobApplicationResponseDto> findApplicationsByCriteria(Long clientId, String ownership, String status, String search, String agentEmail);
    void addClientRemark(Long applicationId, String remark, String clientEmail);
    JobApplicationResponseDto updateApplicationStatus(Long applicationId, String status, String agentEmail);
   
}