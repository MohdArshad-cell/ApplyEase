package com.aplyease.backend.service;

import com.aplyease.backend.dto.ClientDto; // You may need to create this DTO
import com.aplyease.backend.dto.UserDto;

import java.util.List;

public interface UserService {
    List<ClientDto> getAllClients();
    UserDto getUserByEmail(String email);
}