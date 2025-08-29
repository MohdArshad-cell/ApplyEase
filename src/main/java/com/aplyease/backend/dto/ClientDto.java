package com.aplyease.backend.dto;

import lombok.Data;

@Data
public class ClientDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
}