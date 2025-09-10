package com.aplyease.backend.dto;

import lombok.Data;

@Data
public class AgentAnalyticsDto {
    private Long agentId;
    private String agentName;
    private long totalApplications;
    private long totalOffers;
    private double successRate; // e.g., 0.65 for 65%

    public AgentAnalyticsDto(Long agentId, String agentName, long totalApplications, long totalOffers) {
        this.agentId = agentId;
        this.agentName = agentName;
        this.totalApplications = totalApplications;
        this.totalOffers = totalOffers;
        // Calculate success rate, avoiding division by zero
        this.successRate = (totalApplications > 0) ? ((double) totalOffers / totalApplications) * 100 : 0.0;
    }
}