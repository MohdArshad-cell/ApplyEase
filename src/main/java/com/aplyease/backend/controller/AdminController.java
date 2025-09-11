package com.aplyease.backend.controller;

import com.aplyease.backend.dto.AdminApplicationDto;
import com.aplyease.backend.dto.AdminDashboardStatsDto;
import com.aplyease.backend.dto.AgentAnalyticsDto;
import com.aplyease.backend.dto.AgentDetailAnalyticsDto;
import com.aplyease.backend.dto.ApplicationUpdateRequestDto;
import com.aplyease.backend.dto.ClientAnalyticsDto;
import com.aplyease.backend.dto.EmployeeDashboardDto;
import com.aplyease.backend.dto.StatusUpdateDto;
import com.aplyease.backend.dto.UserCreateRequestDto;
import com.aplyease.backend.dto.UserDto;
import com.aplyease.backend.dto.UserUpdateRequestDto;
import com.aplyease.backend.exception.ResourceNotFoundException;
import com.aplyease.backend.service.AdminService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')") 
@CrossOrigin(origins = "*")// Secures all endpoints in this controller for Admins only
public class AdminController {

    private final AdminService adminService;
 


    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }
    

    /**
     * ENDPOINT 1: Fetches the statistics for the dashboard cards.
     * Corresponds to the loadDashboardStats() function in JavaScript.
     * GET http://localhost:8080/api/admin/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStatsDto> getDashboardStats() {
        AdminDashboardStatsDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * ENDPOINT 2: Fetches all applications for the main table.
     * Corresponds to the loadAllApplications() function in JavaScript.
     * GET http://localhost:8080/api/admin/applications/all
     */
    @GetMapping("/applications/all")
    public ResponseEntity<List<AdminApplicationDto>> getAllApplications() {
        List<AdminApplicationDto> applications = adminService.getAllApplications();
        return ResponseEntity.ok(applications);
    }
    

    @GetMapping("/users/all")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    @PutMapping("/applications/{id}")
    public ResponseEntity<AdminApplicationDto> updateApplication(
            @PathVariable Long id, 
            @RequestBody ApplicationUpdateRequestDto requestDto) {
                
        AdminApplicationDto updatedApplication = adminService.updateApplication(id, requestDto);
        return new ResponseEntity<>(updatedApplication, HttpStatus.OK);
    }
    
    @DeleteMapping("/applications/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        // 1. The controller calls the service layer.
        adminService.deleteApplication(id);
        
        // 2. Return a 204 No Content response, which is the standard for a successful delete.
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/users")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserCreateRequestDto requestDto) {
        UserDto newUser = adminService.createUser(requestDto);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequestDto requestDto) {
        UserDto updatedUser = adminService.updateUser(id, requestDto);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<Void> toggleUserStatus(@PathVariable Long id, @RequestBody StatusUpdateDto statusUpdate) {
        adminService.toggleUserStatus(id, statusUpdate.isActive());
        return ResponseEntity.ok().build();
    }
    @GetMapping("/analytics/agents")
    public ResponseEntity<List<AgentAnalyticsDto>> getAgentAnalytics(
            @RequestParam(name = "period", defaultValue = "ALL_TIME") String period) {
                
        List<AgentAnalyticsDto> analytics = adminService.getAgentAnalytics(period);
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/analytics/agent/{id}")
    public ResponseEntity<AgentDetailAnalyticsDto> getAgentDetailAnalytics(@PathVariable Long id) {
        AgentDetailAnalyticsDto analytics = adminService.getAgentDetailAnalytics(id);
        return ResponseEntity.ok(analytics);
    }
    

 @GetMapping("/analytics/employee-dashboard")
 public ResponseEntity<EmployeeDashboardDto> getEmployeeDashboard() {
     return ResponseEntity.ok(adminService.getEmployeeDashboardAnalytics());
 }
 
 @GetMapping("/analytics/clients")
 public ResponseEntity<List<ClientAnalyticsDto>> getClientAnalytics(
         @RequestParam(required = false) String period,
         @RequestParam(required = false) Long agentId) {
     List<ClientAnalyticsDto> analytics = adminService.getClientAnalytics(period, agentId);
     return ResponseEntity.ok(analytics);
 }
}