package com.aplyease.backend.dto;

/**
 * Data Transfer Object for carrying client analytics data from the backend to the frontend.
 */
public class ClientAnalyticsDto {

    private Long clientId;
    private String clientName;
    private long totalApplications;
    private long successfulPlacements;
    private double successRate;

    // --- NEW FIELDS ---
    private Double avgTimeToInterview;
    private Double avgTimeToPlacement;

    /**
     * This constructor is specifically used by the JPQL query in the repository.
     * It allows creating the DTO directly from the query results.
     */
    public ClientAnalyticsDto(Long clientId, String clientName, long totalApplications, long successfulPlacements) {
        this.clientId = clientId;
        this.clientName = clientName;
        this.totalApplications = totalApplications;
        this.successfulPlacements = successfulPlacements;
    }

    // Getters and Setters for all fields

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getSuccessfulPlacements() {
        return successfulPlacements;
    }

    public void setSuccessfulPlacements(long successfulPlacements) {
        this.successfulPlacements = successfulPlacements;
    }

    public double getSuccessRate() {
        return successRate;
    }

    public void setSuccessRate(double successRate) {
        this.successRate = successRate;
    }

    // --- GETTERS AND SETTERS FOR NEW FIELDS ---

    public Double getAvgTimeToInterview() {
        return avgTimeToInterview;
    }

    public void setAvgTimeToInterview(Double avgTimeToInterview) {
        this.avgTimeToInterview = avgTimeToInterview;
    }

    public Double getAvgTimeToPlacement() {
        return avgTimeToPlacement;
    }

    public void setAvgTimeToPlacement(Double avgTimeToPlacement) {
        this.avgTimeToPlacement = avgTimeToPlacement;
    }
}