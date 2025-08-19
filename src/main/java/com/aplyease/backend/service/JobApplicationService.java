package com.aplyease.backend.service;

import com.aplyease.backend.dto.JobApplicationDto;
import com.aplyease.backend.model.JobApplication;

import java.util.List;

public interface JobApplicationService {
    JobApplication createApplication(JobApplicationDto jobApplicationDto, String applicatorEmail);
    
    List<JobApplication> getApplicationsForClient(String clientEmail);
}