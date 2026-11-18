package com.thecashx.backend.controller;

import com.thecashx.backend.dto.common.ApiResponse;
import com.thecashx.backend.dto.response.CompanyInfoResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/company")
@Tag(name = "Company Info")
public class CompanyInfoController {

    @GetMapping("/info")
    @Operation(summary = "Get company info")
    public ResponseEntity<ApiResponse<CompanyInfoResponse>> getCompanyInfo() {
        CompanyInfoResponse info = CompanyInfoResponse.builder()
                .name("TheCashX")
                .tagline("Instant Cash for Used Laptops, Desktops, Monitors & Mac Mini")
                .phone("+91 821 746 4709")
                .whatsapp("+91 821 746 4709")
                .email("thecashx26@gmail.com")
                .address("NGR complex Arekere Bannerghatta Road Bengaluru pin code 560076")
                .workingHours("Mon - Sat: 9:30 AM - 8:00 PM | Sun: 10:00 AM - 4:00 PM")
                .websiteUrl("https://www.thecashx.com")
                .googleMapsUrl("https://maps.google.com/?q=12.8906,77.5975")
                .establishedYear(2026)
                .yearsExperience(24)
                .build();
        return ResponseEntity.ok(ApiResponse.success("Success", info));
    }
}
