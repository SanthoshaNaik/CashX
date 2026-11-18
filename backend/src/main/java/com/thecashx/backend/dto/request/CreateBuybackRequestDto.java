package com.thecashx.backend.dto.request;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CreateBuybackRequestDto {
    @Valid
    @NotNull
    private CustomerDto customer;
    @Valid
    @NotNull
    private DeviceDto device;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CustomerDto {
        @NotBlank private String name;
        @NotBlank private String phone;
        private String altPhone;
        private String email;
        @NotBlank private String address;
        @NotBlank private String city;
        private String pincode;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DeviceDto {
        @NotBlank private String type;
        @NotBlank private String brand;
        private String model;
        private String processor;
        private String ram;
        private String storage;
        private String condition;
        private String age;
        private String accessories;
        private BigDecimal expectedPrice;
    }
}
