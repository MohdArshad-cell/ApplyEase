package com.aplyease.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aplyease.backend.model.Role;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    // A custom method to find a role by its name (e.g., "ROLE_AGENT")
    Optional<Role> findByName(String name);
}