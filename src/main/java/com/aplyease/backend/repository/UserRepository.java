package com.aplyease.backend.repository;

import com.aplyease.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // <-- Make sure to import List
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    /**
     * ADD THIS METHOD.
     * Spring Data JPA will automatically create a query to find all users
     * who are linked to a role with the specified name (e.g., "ROLE_CLIENT").
     */
    List<User> findByRoles_Name(String roleName);
}