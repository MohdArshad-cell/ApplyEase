package com.aplyease.backend.dto;

import java.util.List;
import lombok.Data;

@Data
public class EmployeeDashboardDto {
    private double totalPayout;
    private long thisWeekSubmissions;
    private long todaySubmissions;
    private double dailyAverage;
    private long activeEmployees;
    private List<AgentPerformanceDto> performanceList;
}