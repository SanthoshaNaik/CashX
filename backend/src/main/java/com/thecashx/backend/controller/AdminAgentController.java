package com.thecashx.backend.controller;

import com.thecashx.backend.dto.common.ApiResponse;
import com.thecashx.backend.dto.request.CreateFieldAgentRequest;
import com.thecashx.backend.dto.request.UpdateFieldAgentRequest;
import com.thecashx.backend.dto.response.FieldAgentResponse;
import com.thecashx.backend.service.FieldAgentService;
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
@RequestMapping("/admin/agents")
@Tag(name = "Admin Agents")
@RequiredArgsConstructor
@Slf4j
public class AdminAgentController {

    private final FieldAgentService fieldAgentService;

    @GetMapping
    @Operation(summary = "List all field agents")
    public ResponseEntity<ApiResponse<List<FieldAgentResponse>>> getAllAgents(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(fieldAgentService.getAllAgents(city, status, search));
    }

    @PostMapping
    @Operation(summary = "Create field agent")
    public ResponseEntity<ApiResponse<FieldAgentResponse>> createAgent(
            @RequestBody @Valid CreateFieldAgentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fieldAgentService.createAgent(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update field agent")
    public ResponseEntity<ApiResponse<FieldAgentResponse>> updateAgent(
            @PathVariable("id") String id,
            @RequestBody @Valid UpdateFieldAgentRequest request) {
        return ResponseEntity.ok(fieldAgentService.updateAgent(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete field agent")
    public ResponseEntity<ApiResponse<Void>> deleteAgent(
            @PathVariable("id") String id) {
        return ResponseEntity.ok(fieldAgentService.deleteAgent(id));
    }
}
