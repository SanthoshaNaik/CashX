package com.thecashx.backend.controller;

import com.thecashx.backend.dto.common.ApiResponse;
import com.thecashx.backend.dto.response.AdminOverviewStatsResponse;
import com.thecashx.backend.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@Tag(name = "Admin Overview")
@RequiredArgsConstructor
@Slf4j
public class AdminOverviewController {

    private final AdminService adminService;

    @GetMapping("/overview")
    @Operation(summary = "Get admin overview statistics")
    public ResponseEntity<ApiResponse<AdminOverviewStatsResponse>> getOverviewStats() {
        return ResponseEntity.ok(adminService.getOverviewStats());
    }
}
