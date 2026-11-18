package com.thecashx.backend.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AdminLoginRequest {
    @NotBlank
    private String email;
    @NotBlank
    private String password;
}
