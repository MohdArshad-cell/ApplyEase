package com.aplyease.backend.dto;

import java.util.List;
import lombok.Data;

@Data
public class AgentDetailAnalyticsDto {
    private Long agentId;
    private String agentName;
    private long totalApplications;
    private long totalOffers;
    private double successRate;
    private List<ApplicationSummaryDto> recentApplications;
}