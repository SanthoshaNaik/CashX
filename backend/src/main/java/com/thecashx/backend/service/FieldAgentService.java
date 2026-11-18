package com.thecashx.backend.service;

import com.thecashx.backend.dto.common.ApiResponse;
import com.thecashx.backend.dto.request.CreateFieldAgentRequest;
import com.thecashx.backend.dto.request.SaveInspectionRequest;
import com.thecashx.backend.dto.request.UpdateFieldAgentRequest;
import com.thecashx.backend.dto.response.BuybackRequestResponse;
import com.thecashx.backend.dto.response.FieldAgentResponse;

import java.util.List;

public interface FieldAgentService {
    ApiResponse<List<FieldAgentResponse>> getAllAgents(String city, String status, String search);
    ApiResponse<FieldAgentResponse> createAgent(CreateFieldAgentRequest dto);
    ApiResponse<FieldAgentResponse> updateAgent(String agentId, UpdateFieldAgentRequest dto);
    ApiResponse<Void> deleteAgent(String agentId);
    ApiResponse<List<BuybackRequestResponse>> getAgentOrders(String agentUserId);
    ApiResponse<BuybackRequestResponse> saveInspection(String orderId, SaveInspectionRequest dto, String agentUserId);
    ApiResponse<FieldAgentResponse> getAgentProfile(String agentUserId);
}
