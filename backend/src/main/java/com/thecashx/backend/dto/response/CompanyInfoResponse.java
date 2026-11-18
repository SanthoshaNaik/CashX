package com.thecashx.backend.dto.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CompanyInfoResponse {
    private String name;
    private String tagline;
    private String phone;
    private String whatsapp;
    private String email;
    private String address;
    private String workingHours;
    private String websiteUrl;
    private String googleMapsUrl;
    private Integer establishedYear;
    private Integer yearsExperience;
}
