package com.thecashx.backend.controller;

import com.thecashx.backend.dto.common.ApiResponse;
import com.thecashx.backend.dto.request.CancelRequestDto;
import com.thecashx.backend.dto.request.CreateBuybackRequestDto;
import com.thecashx.backend.dto.response.BuybackRequestResponse;
import com.thecashx.backend.security.JwtTokenProvider;
import com.thecashx.backend.service.BuybackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/requests")
@Tag(name = "Buyback Requests")
@RequiredArgsConstructor
@Slf4j
public class BuybackRequestController {

    private final BuybackService buybackService;
    private final JwtTokenProvider jwtTokenProvider;

    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return authHeader;
    }

    private String getUserIdFromHeader(String authHeader) {
        if (authHeader == null || authHeader.isBlank()) return null;
        try {
            String token = extractToken(authHeader);
            return jwtTokenProvider.getUserIdFromToken(token);
        } catch (Exception e) {
            log.debug("No valid token in header: {}", e.getMessage());
            return null;
        }
    }

    private String getRoleFromHeader(String authHeader) {
        if (authHeader == null || authHeader.isBlank()) return "GUEST";
        try {
            String token = extractToken(authHeader);
            return jwtTokenProvider.getRoleFromToken(token);
        } catch (Exception e) {
            return "GUEST";
        }
    }

    @PostMapping
    @Operation(summary = "Create buyback request")
    public ResponseEntity<ApiResponse<BuybackRequestResponse>> createRequest(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody @Valid CreateBuybackRequestDto request) {
        String userId = getUserIdFromHeader(authHeader);
        return ResponseEntity.status(HttpStatus.CREATED).body(buybackService.createRequest(request, userId));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current customer's requests")
    public ResponseEntity<ApiResponse<List<BuybackRequestResponse>>> getMyRequests(
            @RequestHeader("Authorization") String authHeader) {
        String userId = getUserIdFromHeader(authHeader);
        return ResponseEntity.ok(buybackService.getMyRequests(userId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single request details")
    public ResponseEntity<ApiResponse<BuybackRequestResponse>> getRequestById(
            @PathVariable("id") String id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        String userId = getUserIdFromHeader(authHeader);
        String role = getRoleFromHeader(authHeader);
        return ResponseEntity.ok(buybackService.getRequestById(id, userId, role));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel request")
    public ResponseEntity<ApiResponse<BuybackRequestResponse>> cancelRequest(
            @PathVariable("id") String id,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody @Valid CancelRequestDto request) {
        String userId = getUserIdFromHeader(authHeader);
        return ResponseEntity.ok(buybackService.cancelRequest(id, request, userId));
    }
}
