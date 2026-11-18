package com.thecashx.backend.service.impl;

import com.thecashx.backend.dto.common.ApiResponse;
import com.thecashx.backend.dto.request.CreateFieldAgentRequest;
import com.thecashx.backend.dto.request.SaveInspectionRequest;
import com.thecashx.backend.dto.request.UpdateFieldAgentRequest;
import com.thecashx.backend.dto.response.BuybackRequestResponse;
import com.thecashx.backend.dto.response.FieldAgentResponse;
import com.thecashx.backend.entity.BuybackRequestEntity;
import com.thecashx.backend.entity.FieldAgentEntity;
import com.thecashx.backend.entity.RequestInspectionEntity;
import com.thecashx.backend.entity.StatusHistoryEntity;
import com.thecashx.backend.entity.UserEntity;
import com.thecashx.backend.exception.ResourceNotFoundException;
import com.thecashx.backend.exception.UnauthorizedException;
import com.thecashx.backend.mapper.BuybackRequestMapper;
import com.thecashx.backend.repository.BuybackRequestRepository;
import com.thecashx.backend.repository.FieldAgentRepository;
import com.thecashx.backend.repository.RequestDeviceRepository;
import com.thecashx.backend.repository.RequestInspectionRepository;
import com.thecashx.backend.repository.StatusHistoryRepository;
import com.thecashx.backend.repository.UserRepository;
import com.thecashx.backend.service.FieldAgentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class FieldAgentServiceImpl implements FieldAgentService {

    private final FieldAgentRepository fieldAgentRepository;
    private final UserRepository userRepository;
    private final BuybackRequestRepository buybackRequestRepository;
    private final RequestInspectionRepository requestInspectionRepository;
    private final RequestDeviceRepository requestDeviceRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ApiResponse<List<FieldAgentResponse>> getAllAgents(String city, String status, String search) {
        List<FieldAgentEntity> all = StreamSupport.stream(fieldAgentRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
                
        List<FieldAgentResponse> res = all.stream().filter(a -> {
            boolean match = true;
            if (city != null && !city.isEmpty()) match = match && city.equalsIgnoreCase(a.getCity());
            if (status != null && !status.isEmpty()) match = match && status.equalsIgnoreCase(a.getStatus());
            if (search != null && !search.isEmpty()) {
                String s = search.toLowerCase();
                match = match && (a.getName().toLowerCase().contains(s) || (a.getEmail() != null && a.getEmail().toLowerCase().contains(s)));
            }
            return match;
        }).map(this::mapToAgentResponse).collect(Collectors.toList());
        
        return ApiResponse.success("Agents fetched successfully", res);
    }

    @Override
    @Transactional
    public ApiResponse<FieldAgentResponse> createAgent(CreateFieldAgentRequest dto) {
        long count = fieldAgentRepository.count();
        String agentId = "agent-" + (100 + count + 1);
        
        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID().toString());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setFullName(dto.getName());
        if (dto.getPassword() != null) {
            user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        } else {
            user.setPasswordHash(passwordEncoder.encode("agent123")); // default fallback
        }
        user.setRole("FIELD_AGENT");
        user.setAuthProvider("LOCAL");
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user = userRepository.save(user);
        
        FieldAgentEntity agent = new FieldAgentEntity();
        agent.setId(agentId);
        agent.setUser(user);
        agent.setName(dto.getName());
        agent.setPhone(dto.getPhone());
        agent.setEmail(dto.getEmail());
        agent.setCity(dto.getCity());
        agent.setHub(dto.getHub());
        agent.setSpecialization(dto.getSpecialization());
        agent.setRating(BigDecimal.valueOf(5.00));
        agent.setCompletedPickups(0);
        agent.setStatus("Active");
        agent.setJoinedDate(LocalDate.now());
        agent = fieldAgentRepository.save(agent);
        
        return ApiResponse.success("Agent created successfully", mapToAgentResponse(agent));
    }

    @Override
    @Transactional
    public ApiResponse<FieldAgentResponse> updateAgent(String agentId, UpdateFieldAgentRequest dto) {
        FieldAgentEntity agent = fieldAgentRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));
                
        if (dto.getName() != null) agent.setName(dto.getName());
        if (dto.getPhone() != null) agent.setPhone(dto.getPhone());
        if (dto.getCity() != null) agent.setCity(dto.getCity());
        if (dto.getHub() != null) agent.setHub(dto.getHub());
        if (dto.getSpecialization() != null) agent.setSpecialization(dto.getSpecialization());
        if (dto.getStatus() != null) agent.setStatus(dto.getStatus());
        
        fieldAgentRepository.save(agent);
        
        UserEntity user = agent.getUser();
        if (user != null) {
            if (dto.getName() != null) user.setFullName(dto.getName());
            if (dto.getPhone() != null) user.setPhone(dto.getPhone());
            userRepository.save(user);
        }
        
        return ApiResponse.success("Agent updated successfully", mapToAgentResponse(agent));
    }

    @Override
    @Transactional
    public ApiResponse<Void> deleteAgent(String agentId) {
        FieldAgentEntity agent = fieldAgentRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));
                
        UserEntity user = agent.getUser();
        if (user != null) {
            user.setIsActive(false);
            userRepository.save(user);
        }
        
        // Logical or physical delete based on requirement. Let's do logical for agent too
        agent.setStatus("Inactive");
        fieldAgentRepository.save(agent);
        
        return ApiResponse.success("Agent deactivated successfully");
    }

    @Override
    public ApiResponse<List<BuybackRequestResponse>> getAgentOrders(String agentUserId) {
        FieldAgentEntity agent = fieldAgentRepository.findByUserId(agentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));
                
        List<BuybackRequestResponse> res = buybackRequestRepository.findByAssignedAgentIdOrderByCreatedAtDesc(agent.getId())
                .stream().map(BuybackRequestMapper::mapToResponse).collect(Collectors.toList());
                
        return ApiResponse.success("Orders fetched successfully", res);
    }

    @Override
    @Transactional
    public ApiResponse<BuybackRequestResponse> saveInspection(String orderId, SaveInspectionRequest dto, String agentUserId) {
        FieldAgentEntity agent = fieldAgentRepository.findByUserId(agentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));
                
        BuybackRequestEntity req = buybackRequestRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
                
        if (req.getAssignedAgent() == null || !req.getAssignedAgent().getId().equals(agent.getId())) {
            throw new UnauthorizedException("Order not assigned to you");
        }
        
        if (req.getRequestDevice() != null) {
            if (dto.getBrand() != null) req.getRequestDevice().setBrand(dto.getBrand());
            if (dto.getModel() != null) req.getRequestDevice().setModel(dto.getModel());
            if (dto.getProcessor() != null) req.getRequestDevice().setProcessor(dto.getProcessor());
            if (dto.getRam() != null) req.getRequestDevice().setRam(dto.getRam());
            if (dto.getStorage() != null) req.getRequestDevice().setStorage(dto.getStorage());
            requestDeviceRepository.save(req.getRequestDevice());
        }
        
        RequestInspectionEntity inspection = req.getRequestInspection();
        if (inspection == null) {
            inspection = new RequestInspectionEntity();
            inspection.setId(UUID.randomUUID().toString());
            inspection.setBuybackRequest(req);
        }
        inspection.setInspectedByAgent(agent);
        inspection.setScreenCondition(dto.getScreenCondition());
        inspection.setBodyCondition(dto.getBodyCondition());
        inspection.setBatteryHealth(dto.getBatteryHealth());
        inspection.setKeyboardStatus(dto.getKeyboardStatus());
        inspection.setPortsStatus(dto.getPortsStatus());
        inspection.setWifiBluetoothStatus(dto.getWifiBluetoothStatus());
        inspection.setSoundMicStatus(dto.getSoundMicStatus());
        
        if (dto.getVerifiedAccessories() != null) {
            inspection.setVerifiedAccessories(dto.getVerifiedAccessories());
        }
        inspection.setInspectedAt(LocalDateTime.now());
        req.setRequestInspection(inspection);
        
        String oldStatus = req.getStatus();
        req.setStatus("Completed");
        req.setFinalOfferPrice(dto.getFinalQuotation());
        req.setRemarks(dto.getRemarks());
        
        agent.setCompletedPickups((agent.getCompletedPickups() == null ? 0 : agent.getCompletedPickups()) + 1);
        fieldAgentRepository.save(agent);
        
        StatusHistoryEntity history = new StatusHistoryEntity();
        history.setId(UUID.randomUUID().toString());
        history.setBuybackRequest(req);
        history.setFromStatus(oldStatus);
        history.setToStatus("Completed");
        history.setReason(dto.getRemarks());
        history.setChangedByUserId(agentUserId);
        history.setChangedByName(agent.getName());
        
        if (req.getStatusHistory() == null) {
            req.setStatusHistory(new ArrayList<>());
        }
        req.getStatusHistory().add(history);
        
        req = buybackRequestRepository.save(req);
        
        return ApiResponse.success("Inspection saved successfully", BuybackRequestMapper.mapToResponse(req));
    }

    @Override
    public ApiResponse<FieldAgentResponse> getAgentProfile(String agentUserId) {
        FieldAgentEntity agent = fieldAgentRepository.findByUserId(agentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));
        return ApiResponse.success("Profile fetched successfully", mapToAgentResponse(agent));
    }
    
    private FieldAgentResponse mapToAgentResponse(FieldAgentEntity agent) {
        FieldAgentResponse res = new FieldAgentResponse();
        res.setId(agent.getId());
        res.setName(agent.getName());
        res.setPhone(agent.getPhone());
        res.setEmail(agent.getEmail());
        res.setCity(agent.getCity());
        res.setHub(agent.getHub());
        res.setSpecialization(agent.getSpecialization());
        res.setRating(agent.getRating());
        res.setCompletedPickups(agent.getCompletedPickups());
        res.setStatus(agent.getStatus());
        res.setJoinedDate(agent.getJoinedDate());
        res.setAvatar(agent.getAvatar());
        return res;
    }
}
