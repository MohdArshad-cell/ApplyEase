package com.aplyease.backend.repository;

import com.aplyease.backend.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

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
}