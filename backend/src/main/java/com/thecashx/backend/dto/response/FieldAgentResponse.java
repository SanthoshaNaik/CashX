package com.thecashx.backend.dto.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FieldAgentResponse {
    private String id;
    private String name;
    private String phone;
    private String email;
    private String city;
    private String hub;
    private String specialization;
    private BigDecimal rating;
    private Integer completedPickups;
    private String status;
    private LocalDate joinedDate;
    private String avatar;
    private LocalDateTime createdAt;
}
