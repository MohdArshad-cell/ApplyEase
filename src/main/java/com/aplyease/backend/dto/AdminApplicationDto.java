package com.aplyease.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AdminApplicationDto {

    private Long id;
    private String jobTitle;
    private String company;
    private String location;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateApplied;
    
    private String status;
    private String clientName;
    private String agentName;
    private Long clientId;
    private Long agentId;

    // --- ADD ALL THESE MISSING FIELDS ---
    private String jobPortal;
    private String jobLink;
    private String jobPageUrl;
    private String resumeLink;
    private String additionalLink;
    private String clientRemark;
    private String notes;
    private boolean mailSent;
}