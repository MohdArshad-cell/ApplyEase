package com.aplyease.backend.dto;

import lombok.Data;

@Data
public class LoginResponseDto {
    private String accessToken;
    private String tokenType = "Bearer";
    private String userFirstName;
    private String userRole;
}