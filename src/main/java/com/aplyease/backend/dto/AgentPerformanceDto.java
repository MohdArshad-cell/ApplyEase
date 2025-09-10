package com.aplyease.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AgentPerformanceDto {
    private String agentName;
    private long totalSubmissions;
    private double successRate;
}