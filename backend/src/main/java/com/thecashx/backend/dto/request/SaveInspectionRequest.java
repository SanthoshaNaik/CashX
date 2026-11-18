package com.thecashx.backend.dto.request;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SaveInspectionRequest {
    private String deviceType;
    private String brand;
    private String model;
    private String processor;
    private String ram;
    private String storage;
    private String condition;
    private String age;
    private String screenCondition;
    private String bodyCondition;
    private String batteryHealth;
    private String keyboardStatus;
    private String portsStatus;
    private String wifiBluetoothStatus;
    private String soundMicStatus;
    private String verifiedAccessories;
    @NotNull
    private BigDecimal finalQuotation;
    private String remarks;
}
