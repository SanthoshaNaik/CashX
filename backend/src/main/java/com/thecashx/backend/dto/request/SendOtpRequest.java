package com.thecashx.backend.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SendOtpRequest {
    @NotBlank
    @Pattern(regexp = "^[6-9]\\d{9}$")
    private String phone;
}
