package com.aplyease.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminDashboardStatsDto {
    private long totalApplications;
    private long totalClients;
    private long totalAgents;
    private long successfulPlacements;
}