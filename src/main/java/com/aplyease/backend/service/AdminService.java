package com.aplyease.backend.service;

import com.aplyease.backend.dto.AdminApplicationDto;
import com.aplyease.backend.dto.AdminDashboardStatsDto;
import com.aplyease.backend.dto.ApplicationUpdateRequestDto;
import com.aplyease.backend.dto.UserCreateRequestDto;
import com.aplyease.backend.dto.UserDto;
import com.aplyease.backend.dto.UserUpdateRequestDto;

import java.util.List;

public interface AdminService {
    AdminDashboardStatsDto getDashboardStats();
    List<AdminApplicationDto> getAllApplications();
    List<UserDto> getAllUsers();
    AdminApplicationDto updateApplication(Long id, ApplicationUpdateRequestDto requestDto);
    void deleteApplication(Long id);
    UserDto createUser(UserCreateRequestDto requestDto);
    UserDto updateUser(Long userId, UserUpdateRequestDto requestDto);
    void toggleUserStatus(Long userId, boolean isActive);
}