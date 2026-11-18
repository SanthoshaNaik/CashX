package com.thecashx.backend.dto.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserProfileDto user;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UserProfileDto {
        private String id;
        private String email;
        private String phone;
        private String fullName;
        private String role;
        private String authProvider;
        private String agentId;
    }
}
