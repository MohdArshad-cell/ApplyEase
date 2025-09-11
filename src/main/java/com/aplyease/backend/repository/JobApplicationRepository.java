package com.aplyease.backend.repository;

import com.aplyease.backend.dto.ClientAnalyticsDto; // <-- Add this import
import com.aplyease.backend.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query; // <-- Add this import
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long>, JpaSpecificationExecutor<JobApplication> {

    // Methods to find applications
    List<JobApplication> findByClientId(Long clientId);
    List<JobApplication> findByAgentId(Long agentId);

    // Method for the "Total Applications" stat
    long countByAgentId(Long agentId);

    // Method for counting by a SINGLE status ("Offer", "Rejected")
    long countByAgentIdAndStatus(Long agentId, String status);

    // Method for counting by a LIST of statuses ("In Progress")
    long countByAgentIdAndStatusIn(Long agentId, List<String> statuses);
    long countByStatus(String status);
    
    // Counts total applications for an agent after a certain date
    long countByAgentIdAndApplicationDateAfter(Long agentId, LocalDate startDate);

    // Counts applications with a specific status for an agent after a certain date
    long countByAgentIdAndStatusAndApplicationDateAfter(Long agentId, String status, LocalDate startDate);
    List<JobApplication> findTop10ByAgentIdOrderByApplicationDateDesc(Long agentId);
 
    long countByApplicationDateAfter(LocalDate startDate);

    // --- NEW METHOD FOR CLIENT ANALYTICS ---
    /**
     * Custom query to aggregate application data for client analytics.
     * It groups applications by client and calculates the total applications and successful placements.
     * Includes dynamic WHERE clauses to filter by date and assigned agent.
     */
    @Query("SELECT new com.aplyease.backend.dto.ClientAnalyticsDto(" +
           "app.client.id, " +
           "CONCAT(app.client.firstName, ' ', app.client.lastName), " +
           "COUNT(app.id), " +
           "SUM(CASE WHEN app.status = 'Offer' THEN 1 ELSE 0 END)) " +
           "FROM JobApplication app WHERE app.client IS NOT NULL " +
           "AND (:startDate IS NULL OR app.applicationDate >= :startDate) " + // Using your 'applicationDate' field
           "AND (:agentId IS NULL OR app.agent.id = :agentId) " +
           "GROUP BY app.client.id, app.client.firstName, app.client.lastName")
    List<ClientAnalyticsDto> getClientAnalytics(LocalDate startDate, Long agentId);
}