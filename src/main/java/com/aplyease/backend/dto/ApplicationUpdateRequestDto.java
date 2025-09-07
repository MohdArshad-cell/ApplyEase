package com.aplyease.backend.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class ApplicationUpdateRequestDto {
    private String jobTitle;
    private String companyName;
    private String location;
    private String status;
    private LocalDate applicationDate;
    private String jobPortal;
    private String jobLink;
    private String jobPageUrl;
    private String resumeLink;
    private String additionalLink;
    private String clientRemark;
    private String notes;
    private boolean mailSent;
 
}