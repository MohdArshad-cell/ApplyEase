package com.aplyease.backend.service;


import com.aplyease.backend.dto.UserDto;

import java.util.List;

public interface UserService {
    
    UserDto getUserByEmail(String email);
    List<UserDto> getAllClients();
}