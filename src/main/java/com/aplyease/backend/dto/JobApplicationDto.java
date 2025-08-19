package com.aplyease.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class JobApplicationDto {
    private String companyName;
    private String jobTitle;
    private String jobCategory;
    private String location;
    private String status;
    private LocalDate applicationDate;
    private String jobPortal;
    private String jobLink;
    private String resumeLink;
    private String notes;
    private boolean mailSent;
    
    // The ID of the Client this application is FOR
    private Long clientId; 
}