package com.thecashx.backend.service;

import com.thecashx.backend.dto.common.ApiResponse;
import com.thecashx.backend.dto.request.ScheduleOrderRequest;
import com.thecashx.backend.dto.request.UpdateStatusRequest;
import com.thecashx.backend.dto.response.AdminOverviewStatsResponse;
import com.thecashx.backend.dto.response.BuybackRequestResponse;

import java.util.List;

public interface AdminService {
    ApiResponse<List<BuybackRequestResponse>> getAllOrders(String city, String category, String status, String search);
    ApiResponse<BuybackRequestResponse> getOrderById(String orderId);
    ApiResponse<BuybackRequestResponse> scheduleOrder(String orderId, ScheduleOrderRequest dto, String adminUserId);
    ApiResponse<BuybackRequestResponse> updateOrderStatus(String orderId, UpdateStatusRequest dto, String adminUserId);
    ApiResponse<AdminOverviewStatsResponse> getOverviewStats();
}
