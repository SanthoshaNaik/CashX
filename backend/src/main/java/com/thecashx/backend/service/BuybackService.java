package com.thecashx.backend.service;

import com.thecashx.backend.dto.common.ApiResponse;
import com.thecashx.backend.dto.request.CancelRequestDto;
import com.thecashx.backend.dto.request.CreateBuybackRequestDto;
import com.thecashx.backend.dto.response.BuybackRequestResponse;

import java.util.List;

public interface BuybackService {
    ApiResponse<BuybackRequestResponse> createRequest(CreateBuybackRequestDto dto, String userId);
    ApiResponse<List<BuybackRequestResponse>> getMyRequests(String userId);
    ApiResponse<BuybackRequestResponse> getRequestById(String requestId, String userId, String role);
    ApiResponse<BuybackRequestResponse> cancelRequest(String requestId, CancelRequestDto dto, String userId);
}
