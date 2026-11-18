package com.thecashx.backend.controller;

import com.thecashx.backend.dto.common.ApiResponse;
import com.thecashx.backend.dto.request.ScheduleOrderRequest;
import com.thecashx.backend.dto.request.UpdateStatusRequest;
import com.thecashx.backend.dto.response.BuybackRequestResponse;
import com.thecashx.backend.security.JwtTokenProvider;
import com.thecashx.backend.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/orders")
@Tag(name = "Admin Orders")
@RequiredArgsConstructor
@Slf4j
public class AdminOrderController {

    private final AdminService adminService;
    private final JwtTokenProvider jwtTokenProvider;

    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return authHeader;
    }

    @GetMapping
    @Operation(summary = "List all orders")
    public ResponseEntity<ApiResponse<List<BuybackRequestResponse>>> getAllOrders(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getAllOrders(city, category, status, search));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details")
    public ResponseEntity<ApiResponse<BuybackRequestResponse>> getOrderById(
            @PathVariable("id") String id) {
        return ResponseEntity.ok(adminService.getOrderById(id));
    }

    @PutMapping("/{id}/schedule")
    @Operation(summary = "Schedule order")
    public ResponseEntity<ApiResponse<BuybackRequestResponse>> scheduleOrder(
            @PathVariable("id") String id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody @Valid ScheduleOrderRequest request) {
        String token = extractToken(authHeader);
        String adminUserId = jwtTokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(adminService.scheduleOrder(id, request, adminUserId));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update order status")
    public ResponseEntity<ApiResponse<BuybackRequestResponse>> updateOrderStatus(
            @PathVariable("id") String id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody @Valid UpdateStatusRequest request) {
        String token = extractToken(authHeader);
        String adminUserId = jwtTokenProvider.getUserIdFromToken(token);
        return ResponseEntity.ok(adminService.updateOrderStatus(id, request, adminUserId));
    }
}
