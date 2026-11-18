package com.thecashx.backend.service.impl;

import com.thecashx.backend.dto.common.ApiResponse;
import com.thecashx.backend.dto.request.CalculateQuoteRequest;
import com.thecashx.backend.dto.request.CancelRequestDto;
import com.thecashx.backend.dto.request.CreateBuybackRequestDto;
import com.thecashx.backend.dto.response.BuybackRequestResponse;
import com.thecashx.backend.dto.response.PriceQuoteResponse;
import com.thecashx.backend.entity.BuybackRequestEntity;
import com.thecashx.backend.entity.CustomerEntity;
import com.thecashx.backend.entity.RequestDeviceEntity;
import com.thecashx.backend.entity.StatusHistoryEntity;
import com.thecashx.backend.entity.UserEntity;
import com.thecashx.backend.exception.ResourceNotFoundException;
import com.thecashx.backend.exception.UnauthorizedException;
import com.thecashx.backend.mapper.BuybackRequestMapper;
import com.thecashx.backend.repository.BuybackRequestRepository;
import com.thecashx.backend.repository.CustomerRepository;
import com.thecashx.backend.repository.RequestDeviceRepository;
import com.thecashx.backend.repository.StatusHistoryRepository;
import com.thecashx.backend.repository.UserRepository;
import com.thecashx.backend.service.BuybackService;
import com.thecashx.backend.service.PricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BuybackServiceImpl implements BuybackService {

    private final BuybackRequestRepository buybackRequestRepository;
    private final CustomerRepository customerRepository;
    private final RequestDeviceRepository requestDeviceRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final UserRepository userRepository;
    private final PricingService pricingService;

    @Override
    @Transactional
    public ApiResponse<BuybackRequestResponse> createRequest(CreateBuybackRequestDto dto, String userId) {
        UserEntity user = null;
        if (userId != null && !userId.isBlank()) {
            user = userRepository.findById(userId).orElse(null);
        }
        
        if (user == null) {
            String email = dto.getCustomer().getEmail();
            String phone = dto.getCustomer().getPhone();
            
            if (email != null && !email.isBlank()) {
                user = userRepository.findByEmail(email).orElse(null);
            }
            if (user == null && phone != null && !phone.isBlank()) {
                user = userRepository.findByPhone(phone).orElse(null);
            }
            
            if (user == null) {
                user = new UserEntity();
                user.setId(UUID.randomUUID().toString());
                user.setEmail(email != null && !email.isBlank() ? email : "customer-" + System.currentTimeMillis() + "@thecashx.com");
                user.setPhone(phone);
                user.setFullName(dto.getCustomer().getName() != null ? dto.getCustomer().getName() : "Customer");
                user.setRole("CUSTOMER");
                user.setAuthProvider("LOCAL");
                user.setIsActive(true);
                user = userRepository.save(user);
            }
        }

        final UserEntity effectiveUser = user;
        CustomerEntity customer = customerRepository.findByPhone(dto.getCustomer().getPhone()).orElseGet(() -> {
            CustomerEntity newCustomer = new CustomerEntity();
            newCustomer.setId(UUID.randomUUID().toString());
            newCustomer.setUser(effectiveUser);
            newCustomer.setFullName(dto.getCustomer().getName());
            newCustomer.setPhone(dto.getCustomer().getPhone());
            newCustomer.setEmail(dto.getCustomer().getEmail());
            newCustomer.setAddress(dto.getCustomer().getAddress());
            newCustomer.setCity(dto.getCustomer().getCity());
            newCustomer.setPincode(dto.getCustomer().getPincode());
            return customerRepository.save(newCustomer);
        });
        
        // update customer details if they changed
        customer.setFullName(dto.getCustomer().getName());
        customer.setAddress(dto.getCustomer().getAddress());
        customer.setCity(dto.getCustomer().getCity());
        customer.setPincode(dto.getCustomer().getPincode());
        customer.setUser(effectiveUser);
        customerRepository.save(customer);

        long count = buybackRequestRepository.count();
        int random = (int)(Math.random() * 99) + 1;
        String requestId = "LB-" + (1000 + count + random);

        CalculateQuoteRequest quoteRequest = new CalculateQuoteRequest();
        quoteRequest.setDeviceType(dto.getDevice().getType());
        quoteRequest.setBrand(dto.getDevice().getBrand());
        quoteRequest.setModel(dto.getDevice().getModel());
        quoteRequest.setProcessor(dto.getDevice().getProcessor());
        quoteRequest.setRam(dto.getDevice().getRam());
        quoteRequest.setStorage(dto.getDevice().getStorage());
        quoteRequest.setCondition(dto.getDevice().getCondition());
        quoteRequest.setAge(dto.getDevice().getAge());

        PriceQuoteResponse quoteResponse = pricingService.calculateQuote(quoteRequest);

        BuybackRequestEntity request = new BuybackRequestEntity();
        request.setId(requestId);
        request.setCustomer(customer);
        request.setStatus("New Request");
        request.setRequestDate(LocalDate.now());
        request.setEstimatedPrice(quoteResponse.getEstimatedPrice());

        RequestDeviceEntity device = new RequestDeviceEntity();
        device.setId(UUID.randomUUID().toString());
        device.setBuybackRequest(request);
        device.setDeviceType(dto.getDevice().getType());
        device.setBrand(dto.getDevice().getBrand());
        device.setModel(dto.getDevice().getModel());
        device.setProcessor(dto.getDevice().getProcessor());
        device.setRam(dto.getDevice().getRam());
        device.setStorage(dto.getDevice().getStorage());
        device.setCondition(dto.getDevice().getCondition());
        device.setAge(dto.getDevice().getAge());
        device.setAccessories(dto.getDevice().getAccessories());
        device.setExpectedPrice(dto.getDevice().getExpectedPrice());
        request.setRequestDevice(device);

        StatusHistoryEntity history = new StatusHistoryEntity();
        history.setId(UUID.randomUUID().toString());
        history.setBuybackRequest(request);
        history.setToStatus("New Request");
        history.setChangedByUserId(effectiveUser != null ? effectiveUser.getId() : null);
        history.setChangedByName(effectiveUser != null ? effectiveUser.getFullName() : dto.getCustomer().getName());
        history.setReason("Customer created buyback request");
        
        List<StatusHistoryEntity> historyList = new ArrayList<>();
        historyList.add(history);
        request.setStatusHistory(historyList);

        request = buybackRequestRepository.save(request);

        return ApiResponse.success("Request created successfully", BuybackRequestMapper.mapToResponse(request));
    }

    @Override
    public ApiResponse<List<BuybackRequestResponse>> getMyRequests(String userId) {
        if (userId == null) {
            return ApiResponse.success("No requests", new ArrayList<>());
        }
        CustomerEntity customer = customerRepository.findByUserId(userId).orElse(null);
        if (customer == null) {
            return ApiResponse.success("No requests", new ArrayList<>());
        }

        List<BuybackRequestEntity> requests = buybackRequestRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId());
        List<BuybackRequestResponse> responses = requests.stream()
                .map(BuybackRequestMapper::mapToResponse)
                .collect(Collectors.toList());

        return ApiResponse.success("Requests fetched successfully", responses);
    }

    @Override
    public ApiResponse<BuybackRequestResponse> getRequestById(String id, String userId, String role) {
        BuybackRequestEntity request = buybackRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
                
        if ("CUSTOMER".equals(role) && userId != null) {
            if (request.getCustomer() != null && request.getCustomer().getUser() != null) {
                if (!request.getCustomer().getUser().getId().equals(userId)) {
                    throw new UnauthorizedException("Not authorized to view this request");
                }
            }
        }
        
        return ApiResponse.success("Request fetched successfully", BuybackRequestMapper.mapToResponse(request));
    }

    @Override
    @Transactional
    public ApiResponse<BuybackRequestResponse> cancelRequest(String requestId, CancelRequestDto dto, String userId) {
        BuybackRequestEntity request = buybackRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
                
        UserEntity user = null;
        if (userId != null && !userId.isBlank()) {
            user = userRepository.findById(userId).orElse(null);
        }
                
        if (user != null && "CUSTOMER".equals(user.getRole())) {
            if (request.getCustomer() != null && request.getCustomer().getUser() != null) {
                if (!request.getCustomer().getUser().getId().equals(userId)) {
                    throw new UnauthorizedException("Not authorized to cancel this request");
                }
            }
        }

        if ("Completed".equals(request.getStatus()) || "Cancelled".equals(request.getStatus())) {
            throw new IllegalArgumentException("Cannot cancel a completed or already cancelled request");
        }

        String oldStatus = request.getStatus();
        request.setStatus("Cancelled");
        request.setRemarks(dto.getReason());
        request.setUpdatedAt(LocalDateTime.now());
        buybackRequestRepository.save(request);

        StatusHistoryEntity history = new StatusHistoryEntity();
        history.setId(UUID.randomUUID().toString());
        history.setBuybackRequest(request);
        history.setFromStatus(oldStatus);
        history.setToStatus("Cancelled");
        history.setReason(dto.getReason());
        history.setChangedByUserId(user != null ? user.getId() : null);
        history.setChangedByName(user != null ? user.getFullName() : (request.getCustomer() != null ? request.getCustomer().getFullName() : "Customer"));
        history.setCreatedAt(LocalDateTime.now());
        statusHistoryRepository.save(history);
        
        if (request.getStatusHistory() == null) request.setStatusHistory(new ArrayList<>());
        request.getStatusHistory().add(history);

        return ApiResponse.success("Request cancelled successfully", BuybackRequestMapper.mapToResponse(request));
    }
}
