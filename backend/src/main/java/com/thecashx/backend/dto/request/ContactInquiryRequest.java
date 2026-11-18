package com.thecashx.backend.dto.request;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ContactInquiryRequest {
    @NotBlank private String name;
    @NotBlank @Email private String email;
    @NotBlank private String phone;
    @NotBlank private String message;
}
