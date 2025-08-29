package com.aplyease.backend.controller;

import com.aplyease.backend.dto.ClientDto;
import com.aplyease.backend.dto.UserDto;
import com.aplyease.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // A single constructor to inject the service
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(Principal principal) {
        // Delegate the logic to the service layer
        UserDto userDto = userService.getUserByEmail(principal.getName());
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/clients")
    @PreAuthorize("hasRole('AGENT')") 
    public ResponseEntity<List<ClientDto>> getAllClients() {
        List<ClientDto> clients = userService.getAllClients();
        return ResponseEntity.ok(clients);
    }
 // In UserController.java

 // ... other methods


}