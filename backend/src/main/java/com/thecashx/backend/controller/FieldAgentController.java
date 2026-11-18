package com.thecashx.backend.controller;

import com.thecashx.backend.dto.common.ApiResponse;
import com.thecashx.backend.dto.request.SaveInspectionRequest;
import com.thecashx.backend.dto.response.BuybackRequestResponse;
import com.thecashx.backend.dto.response.FieldAgentResponse;
import com.thecashx.backend.security.JwtTokenProvider;
import com.thecashx.backend.service.FieldAgentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agent")
@Tag(name = "Field Agent")
@RequiredArgsConstructor
@Slf4j
public class FieldAgentController {

    private final FieldAgentService fieldAgentService;
    private final JwtTokenProvider jwtTokenProvider;

    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return authHeader;
    }

    @GetMapping("/orders")
    @Operation(summary = "Get agent's assigned orders")
    public ResponseEntity<ApiResponse<List<BuybackRequestResponse>>> getAgentOrders(
            @RequestHeader("Authorization") String authHeader) {
        String token = extractToken(authHeader);
        String agentUserId = jwtTokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(fieldAgentService.getAgentOrders(agentUserId));
    }

    @PutMapping("/orders/{id}/inspection")
    @Operation(summary = "Save inspection details")
    public ResponseEntity<ApiResponse<BuybackRequestResponse>> saveInspection(
            @PathVariable("id") String id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody @Valid SaveInspectionRequest request) {
        String token = extractToken(authHeader);
        String agentUserId = jwtTokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(fieldAgentService.saveInspection(id, request, agentUserId));
    }

    @GetMapping("/profile")
    @Operation(summary = "Get agent profile")
    public ResponseEntity<ApiResponse<FieldAgentResponse>> getAgentProfile(
            @RequestHeader("Authorization") String authHeader) {
        String token = extractToken(authHeader);
        String agentUserId = jwtTokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(fieldAgentService.getAgentProfile(agentUserId));
    }
}
