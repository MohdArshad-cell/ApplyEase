package com.aplyease.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aplyease.backend.model.Client;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    // Basic CRUD operations like findAll(), findById(), save(), etc.
    // are automatically provided by JpaRepository.
}