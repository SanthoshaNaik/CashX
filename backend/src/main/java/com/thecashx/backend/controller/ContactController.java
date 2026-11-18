package com.thecashx.backend.controller;

import com.thecashx.backend.dto.common.ApiResponse;
import com.thecashx.backend.dto.request.ContactInquiryRequest;
import com.thecashx.backend.entity.ContactInquiryEntity;
import com.thecashx.backend.repository.ContactInquiryRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contact")
@Tag(name = "Contact")
@RequiredArgsConstructor
@Slf4j
public class ContactController {

    private final ContactInquiryRepository contactInquiryRepository;

    @PostMapping
    @Operation(summary = "Submit contact inquiry")
    public ResponseEntity<ApiResponse<Void>> submitContact(
            @RequestBody @Valid ContactInquiryRequest request) {
        
        ContactInquiryEntity entity = ContactInquiryEntity.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .message(request.getMessage())
                .status("New")
                .build();
                
        contactInquiryRepository.save(entity);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Inquiry submitted successfully", null));
    }
}
