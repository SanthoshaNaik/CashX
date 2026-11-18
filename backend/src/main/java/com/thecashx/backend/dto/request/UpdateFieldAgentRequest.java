package com.thecashx.backend.dto.request;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UpdateFieldAgentRequest {
    private String name;
    private String phone;
    private String email;
    private String city;
    private String hub;
    private String specialization;
    private String status;
    private BigDecimal rating;
    private String avatar;
}
