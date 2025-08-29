// src/main/java/com/aplyease/backend/dto/AgentDashboardStatsDto.java
package com.aplyease.backend.dto;

import java.math.BigDecimal;

public class AgentDashboardStatsDto {
    private long totalApplications;
    private long applicationsThisWeek;
    private long inProgressCount;
    private double successRate;
    private BigDecimal totalEarnings;

  
    

    // --- GETTERS AND SETTERS START HERE ---

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getApplicationsThisWeek() {
        return applicationsThisWeek;
    }

    public void setApplicationsThisWeek(long applicationsThisWeek) {
        this.applicationsThisWeek = applicationsThisWeek;
    }

    public long getInProgressCount() {
        return inProgressCount;
    }

    public void setInProgressCount(long inProgressCount) {
        this.inProgressCount = inProgressCount;
    }

    public double getSuccessRate() {
        return successRate;
    }

    public void setSuccessRate(double successRate) {
        this.successRate = successRate;
    }

    public BigDecimal getTotalEarnings() {
        return totalEarnings;
    }

    public void setTotalEarnings(BigDecimal earnings) {
        this.totalEarnings = earnings;
    }
}