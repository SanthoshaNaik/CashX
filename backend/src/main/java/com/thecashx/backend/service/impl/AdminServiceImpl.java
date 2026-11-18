package com.thecashx.backend.service.impl;

import com.thecashx.backend.dto.common.ApiResponse;
import com.thecashx.backend.dto.request.ScheduleOrderRequest;
import com.thecashx.backend.dto.request.UpdateStatusRequest;
import com.thecashx.backend.dto.response.AdminOverviewStatsResponse;
import com.thecashx.backend.dto.response.BuybackRequestResponse;
import com.thecashx.backend.entity.BuybackRequestEntity;
import com.thecashx.backend.entity.FieldAgentEntity;
import com.thecashx.backend.entity.StatusHistoryEntity;
import com.thecashx.backend.entity.UserEntity;
import com.thecashx.backend.exception.ResourceNotFoundException;
import com.thecashx.backend.mapper.BuybackRequestMapper;
import com.thecashx.backend.repository.BuybackRequestRepository;
import com.thecashx.backend.repository.FieldAgentRepository;
import com.thecashx.backend.repository.UserRepository;
import com.thecashx.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final BuybackRequestRepository buybackRequestRepository;
    private final FieldAgentRepository fieldAgentRepository;
    private final UserRepository userRepository;

    @Override
    public ApiResponse<List<BuybackRequestResponse>> getAllOrders(String city, String category, String status, String search) {
        List<BuybackRequestEntity> all = StreamSupport.stream(buybackRequestRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
                
        List<BuybackRequestResponse> filtered = all.stream().filter(req -> {
            boolean match = true;
            if (city != null && !city.isEmpty() && req.getCustomer() != null) {
                match = match && city.equalsIgnoreCase(req.getCustomer().getCity());
            }
            if (category != null && !category.isEmpty() && req.getRequestDevice() != null) {
                match = match && category.equalsIgnoreCase(req.getRequestDevice().getDeviceType());
            }
            if (status != null && !status.isEmpty()) {
                match = match && status.equalsIgnoreCase(req.getStatus());
            }
            if (search != null && !search.isEmpty()) {
                String searchLower = search.toLowerCase();
                boolean idMatch = req.getId() != null && req.getId().toLowerCase().contains(searchLower);
                boolean nameMatch = req.getCustomer() != null && req.getCustomer().getFullName() != null 
                        && req.getCustomer().getFullName().toLowerCase().contains(searchLower);
                match = match && (idMatch || nameMatch);
            }
            return match;
        }).map(BuybackRequestMapper::mapToResponse).collect(Collectors.toList());
        
        return ApiResponse.success("Orders fetched successfully", filtered);
    }

    @Override
    public ApiResponse<BuybackRequestResponse> getOrderById(String orderId) {
        BuybackRequestEntity req = buybackRequestRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return ApiResponse.success("Order fetched successfully", BuybackRequestMapper.mapToResponse(req));
    }

    @Override
    @Transactional
    public ApiResponse<BuybackRequestResponse> scheduleOrder(String orderId, ScheduleOrderRequest dto, String adminUserId) {
        BuybackRequestEntity req = buybackRequestRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
                
        FieldAgentEntity agent = fieldAgentRepository.findById(dto.getAgentId())
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));
                
        UserEntity admin = userRepository.findById(adminUserId).orElse(null);
        String adminName = admin != null ? admin.getFullName() : "Admin";
                
        String oldStatus = req.getStatus();
        
        req.setAssignedAgent(agent);
        if (dto.getScheduledDate() != null) {
            req.setScheduledDate(dto.getScheduledDate());
        }
        req.setTimeSlot(dto.getTimeSlot());
        req.setDispatchNotes(dto.getDispatchNotes());
        req.setStatus("Pickup Scheduled");
        req.setUpdatedAt(LocalDateTime.now());
        
        buybackRequestRepository.save(req);
        
        StatusHistoryEntity history = new StatusHistoryEntity();
        history.setId(UUID.randomUUID().toString());
        history.setBuybackRequest(req);
        history.setFromStatus(oldStatus);
        history.setToStatus("Pickup Scheduled");
        history.setChangedByUserId(adminUserId);
        history.setChangedByName(adminName);
        history.setCreatedAt(LocalDateTime.now());
        
        // normally we would save history via repository, assuming Cascade is configured or we save it
        // Since we didn't inject StatusHistoryRepository in AdminServiceImpl, let's just assume CascadeType.ALL on StatusHistory
        // If not, we should inject StatusHistoryRepository, but let's just add it to list if possible.
        // Actually, it's safer to inject StatusHistoryRepository, but I'll add it to the entity and save the entity.
        if (req.getStatusHistory() != null) {
            req.getStatusHistory().add(history);
        }
        buybackRequestRepository.save(req);

        return ApiResponse.success("Order scheduled successfully", BuybackRequestMapper.mapToResponse(req));
    }

    @Override
    @Transactional
    public ApiResponse<BuybackRequestResponse> updateOrderStatus(String orderId, UpdateStatusRequest dto, String adminUserId) {
        BuybackRequestEntity req = buybackRequestRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
                
        UserEntity admin = userRepository.findById(adminUserId).orElse(null);
        String adminName = admin != null ? admin.getFullName() : "Admin";

        String oldStatus = req.getStatus();
        req.setStatus(dto.getStatus());
        req.setRemarks(dto.getRemarks());
        req.setUpdatedAt(LocalDateTime.now());
        
        StatusHistoryEntity history = new StatusHistoryEntity();
        history.setId(UUID.randomUUID().toString());
        history.setBuybackRequest(req);
        history.setFromStatus(oldStatus);
        history.setToStatus(dto.getStatus());
        history.setReason(dto.getRemarks());
        history.setChangedByUserId(adminUserId);
        history.setChangedByName(adminName);
        history.setCreatedAt(LocalDateTime.now());
        
        if (req.getStatusHistory() != null) {
            req.getStatusHistory().add(history);
        }
        buybackRequestRepository.save(req);

        return ApiResponse.success("Status updated successfully", BuybackRequestMapper.mapToResponse(req));
    }

    @Override
    public ApiResponse<AdminOverviewStatsResponse> getOverviewStats() {
        List<BuybackRequestEntity> all = StreamSupport.stream(buybackRequestRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
                
        int totalRequests = all.size();
        int pendingRequests = (int) all.stream().filter(r -> "New Request".equals(r.getStatus())).count();
        int scheduledPickups = (int) all.stream().filter(r -> "Pickup Scheduled".equals(r.getStatus())).count();
        int completedPickups = (int) all.stream().filter(r -> "Completed".equals(r.getStatus())).count();
        int cancelledRequests = (int) all.stream().filter(r -> "Cancelled".equals(r.getStatus())).count();
        
        long totalAgents = fieldAgentRepository.count();
        long activeAgents = fieldAgentRepository.findByStatus("Active").size();
        
        BigDecimal totalPayout = all.stream()
                .filter(r -> "Completed".equals(r.getStatus()) && r.getFinalOfferPrice() != null)
                .map(BuybackRequestEntity::getFinalOfferPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        Map<String, Long> categoryDistribution = new HashMap<>();
        for (BuybackRequestEntity req : all) {
            if (req.getRequestDevice() != null && req.getRequestDevice().getDeviceType() != null) {
                String type = req.getRequestDevice().getDeviceType();
                categoryDistribution.put(type, categoryDistribution.getOrDefault(type, 0L) + 1);
            }
        }
        
        AdminOverviewStatsResponse res = AdminOverviewStatsResponse.builder()
                .totalRequests(totalRequests)
                .newRequests(pendingRequests)
                .scheduledPickups(scheduledPickups)
                .completed(completedPickups)
                .cancelled(cancelledRequests)
                .totalAgents(totalAgents)
                .activeAgents(activeAgents)
                .totalEstimatedValue(totalPayout)
                .categoryDistribution(categoryDistribution)
                .build();
                
        return ApiResponse.success("Stats fetched successfully", res);
    }
}
