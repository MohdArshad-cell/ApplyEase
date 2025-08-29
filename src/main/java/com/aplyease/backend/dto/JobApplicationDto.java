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
    
    // ADD THIS FIELD
    private String jobPageUrl; 

    private String resumeLink;
    
    // ADD THIS FIELD
    private String additionalLink; 

    private String notes;
    private boolean mailSent;
    
    private Long clientId; 
}