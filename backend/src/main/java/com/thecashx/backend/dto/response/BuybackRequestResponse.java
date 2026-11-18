package com.thecashx.backend.dto.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BuybackRequestResponse {
    private String id;
    private String status;
    private LocalDateTime requestDate;
    private LocalDate scheduledDate;
    private String timeSlot;
    private BigDecimal estimatedPrice;
    private BigDecimal finalOfferPrice;
    private String remarks;
    private String dispatchNotes;
    private LocalDateTime createdAt;
    
    private CustomerDto customer;
    private DeviceDto device;
    private InspectionDto inspection;
    private AgentSummaryDto assignedAgent;
    private List<StatusHistoryDto> statusHistory;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CustomerDto {
        private String id;
        private String name;
        private String phone;
        private String altPhone;
        private String email;
        private String address;
        private String city;
        private String pincode;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DeviceDto {
        private String deviceType;
        private String brand;
        private String model;
        private String processor;
        private String ram;
        private String storage;
        private String condition;
        private String age;
        private String accessories;
        private BigDecimal expectedPrice;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class InspectionDto {
        private String screenCondition;
        private String bodyCondition;
        private String batteryHealth;
        private String keyboardStatus;
        private String portsStatus;
        private String wifiBluetoothStatus;
        private String soundMicStatus;
        private String verifiedAccessories;
        private LocalDateTime inspectedAt;
        private String inspectedByAgentName;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class AgentSummaryDto {
        private String id;
        private String name;
        private String phone;
        private String city;
        private String hub;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class StatusHistoryDto {
        private String fromStatus;
        private String toStatus;
        private String changedByName;
        private String reason;
        private LocalDateTime createdAt;
    }
}
