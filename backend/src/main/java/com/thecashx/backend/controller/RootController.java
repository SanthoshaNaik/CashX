package com.thecashx.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@Tag(name = "Root API")
public class RootController {

    @GetMapping("/")
    @Operation(summary = "API Root Overview and Links")
    public ResponseEntity<Map<String, Object>> getApiRoot() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("service", "TheCashX Laptop Buyback REST API");
        response.put("status", "UP & RUNNING");
        response.put("timestamp", LocalDateTime.now());
        response.put("version", "1.0.0");
        
        Map<String, String> links = new LinkedHashMap<>();
        links.put("swaggerUI", "/api/swagger-ui/index.html");
        links.put("openApiDocs", "/api/v3/api-docs");
        links.put("companyInfo", "/api/company/info");
        links.put("frontendApp", "http://localhost:3000");
        
        response.put("links", links);
        return ResponseEntity.ok(response);
    }
}
