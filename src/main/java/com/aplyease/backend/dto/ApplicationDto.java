package com.aplyease.backend.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor // Generates a constructor with all fields
public class ApplicationDto {
    private Long id;
    private String jobTitle;
    private String companyName;
    private LocalDate applicationDate;
    private String status;
    private String clientName; // More useful for the admin view than clientId
}