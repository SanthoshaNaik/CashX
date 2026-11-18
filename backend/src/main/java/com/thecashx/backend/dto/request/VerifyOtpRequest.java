package com.thecashx.backend.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class VerifyOtpRequest {
    @NotBlank
    private String phone;
    @NotBlank
    @Pattern(regexp = "^\\d{6}$")
    private String otp;
    @NotBlank
    @Size(max = 100)
    private String fullName;
}
