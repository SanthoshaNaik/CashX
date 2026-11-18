package com.thecashx.backend.dto.request;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CreateFieldAgentRequest {
    @NotBlank private String name;
    @NotBlank private String phone;
    @NotBlank @Email private String email;
    @NotBlank private String city;
    @NotBlank private String hub;
    private String specialization;
    @NotBlank @Size(min = 6) private String password;
}
