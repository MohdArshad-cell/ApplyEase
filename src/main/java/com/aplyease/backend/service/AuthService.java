package com.aplyease.backend.service;

import com.aplyease.backend.dto.LoginDto;
import com.aplyease.backend.dto.SignUpDto;

public interface AuthService {
    String registerUser(SignUpDto signUpDto);
    
    String login(LoginDto loginDto);
}