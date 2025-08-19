package com.aplyease.backend.repository;

import com.aplyease.backend.model.JobApplication;
import com.aplyease.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    // Custom method to find all applications for a specific client
    List<JobApplication> findByClient(User client);
    
}