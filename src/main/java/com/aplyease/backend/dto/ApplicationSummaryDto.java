package com.aplyease.backend.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApplicationSummaryDto {
    private Long id;
    private String jobTitle;
    private String companyName;
    private String status;
    private LocalDate applicationDate;
}