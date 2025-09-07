package com.aplyease.backend.dto;

public class StatusUpdateDto {
    private boolean isActive;

    // Getter (Corrected Name)
    public boolean isActive() {
        return isActive;
    }

    // Setter
    public void setIsActive(boolean active) {
        this.isActive = active;
    }
}