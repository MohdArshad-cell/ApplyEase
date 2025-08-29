package com.aplyease.backend.service;

import com.aplyease.backend.dto.LoginDto;
import com.aplyease.backend.dto.LoginResponseDto; // Make sure this is imported
import com.aplyease.backend.dto.SignUpDto;

public interface AuthService {
    // Change the return type from String to LoginResponseDto
    LoginResponseDto login(LoginDto loginDto);
    
    String register(SignUpDto signUpDto);
}