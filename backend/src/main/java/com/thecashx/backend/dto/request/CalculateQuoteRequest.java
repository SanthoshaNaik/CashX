package com.thecashx.backend.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CalculateQuoteRequest {
    @NotBlank
    private String deviceType;
    @NotBlank
    private String brand;
    private String model;
    private String processor;
    private String ram;
    private String storage;
    private String condition;
    private String age;
    private String screenCondition;
    private String batteryHealth;
    private String keyboardStatus;
    private String portsStatus;
    private List<String> accessories;
}
