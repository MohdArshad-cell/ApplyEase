package com.aplyease.backend.dto;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor  // 👈 add this
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Set<String> roles;
    private boolean active;
}
