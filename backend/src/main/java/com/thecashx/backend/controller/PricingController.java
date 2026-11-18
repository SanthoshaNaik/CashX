package com.thecashx.backend.controller;

import com.thecashx.backend.dto.common.ApiResponse;
import com.thecashx.backend.dto.request.CalculateQuoteRequest;
import com.thecashx.backend.dto.response.PriceQuoteResponse;
import com.thecashx.backend.service.PricingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pricing")
@Tag(name = "Pricing")
@RequiredArgsConstructor
@Slf4j
public class PricingController {

    private final PricingService pricingService;

    @PostMapping("/calculate")
    @Operation(summary = "Calculate quote")
    public ResponseEntity<ApiResponse<PriceQuoteResponse>> calculateQuote(@RequestBody @Valid CalculateQuoteRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Quote calculated successfully", pricingService.calculateQuote(request)));
    }
}
