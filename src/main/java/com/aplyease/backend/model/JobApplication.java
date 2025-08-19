package com.aplyease.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String jobTitle;
    private String jobCategory;
    private String location;
    private String status;
    private LocalDate applicationDate;
    private String jobPortal;

    @Lob // For longer text fields that can hold URLs or long notes
    private String jobLink;

    @Lob
    private String resumeLink;
    
    @Lob // Added this field to handle "JOB PAGE" and other notes
    private String notes; 
    
    private boolean mailSent;

    @Lob
    private String clientRemark;

    // Link to the Client (the user the application is FOR)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_user_id", nullable = false)
    private User client;

    // Link to the User/Admin (the user who APPLIED)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applied_by_user_id", nullable = false)
    private User appliedBy;
}