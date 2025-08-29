package com.aplyease.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private User agent;

    @Column(nullable = false)
    private LocalDate applicationDate;

    @Column(nullable = false)
    private String jobTitle;

    @Column(nullable = false)
    private String companyName;

    @Column(name = "location")
    private String location;

    @Column(name = "job_portal")
    private String jobPortal;

    @Lob
    private String jobLink;

    // --- ADD THESE TWO FIELDS ---
    @Lob // Use @Lob for potentially long URLs
    private String jobPageUrl;
    
    @Lob // Use @Lob for potentially long URLs
    private String additionalLink;
    // ----------------------------

    @Lob
    private String resumeLink;

    @Lob
    private String notes;

    @Column(name = "status")
    private String status;
    
    @Column(name = "mail_sent")
    private boolean mailSent;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @Column(name = "client_remark", columnDefinition = "TEXT")
    private String clientRemark;

    // ADD GETTERS AND SETTERS for clientRemark
    public String getClientRemark() {
        return clientRemark;
    }

    public void setClientRemark(String clientRemark) {
        this.clientRemark = clientRemark;
    }
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}