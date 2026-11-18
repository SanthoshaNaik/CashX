package com.thecashx.backend.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class GoogleLoginRequest {
    @NotBlank
    private String credential;
    
    private String email;
    private String name;
    private String picture;
}
