package com.aplyease.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationResponseDto {

    private Long id;
    private String applicationDate;
    private String jobTitle;
    private String companyName;
    private String location;
    private String jobPortal;
    private String status;
    private boolean mailSent;
    private String jobLink;
    private String resumeLink;
    
    // --- ADD THESE MISSING FIELDS ---
    private String jobPageUrl;
    private String additionalLink;
    // ---------------------------------
    private String clientRemark;
    private ClientInfoDTO clientUser;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClientInfoDTO {
        private String firstName;
        private String lastName;
    }
    private AgentInfoDTO agentUser;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AgentInfoDTO {
        private String firstName;
        private String lastName;
    }
}