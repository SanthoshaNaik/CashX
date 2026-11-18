package com.thecashx.backend.service.impl;

import com.thecashx.backend.dto.common.ApiResponse;
import com.thecashx.backend.dto.request.*;
import com.thecashx.backend.dto.response.AuthResponse;
import com.thecashx.backend.entity.CustomerEntity;
import com.thecashx.backend.entity.FieldAgentEntity;
import com.thecashx.backend.entity.OtpEntity;
import com.thecashx.backend.entity.UserEntity;
import com.thecashx.backend.exception.BadRequestException;
import com.thecashx.backend.exception.ResourceNotFoundException;
import com.thecashx.backend.exception.UnauthorizedException;
import com.thecashx.backend.repository.CustomerRepository;
import com.thecashx.backend.repository.FieldAgentRepository;
import com.thecashx.backend.repository.OtpRepository;
import com.thecashx.backend.repository.UserRepository;
import com.thecashx.backend.security.JwtTokenProvider;
import com.thecashx.backend.service.AuthService;
import com.thecashx.backend.service.SmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final FieldAgentRepository fieldAgentRepository;
    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final SmsService smsService;
    private final Random random = new Random();

    @Override
    @Transactional
    public ApiResponse<Void> sendOtp(SendOtpRequest request) {
        String phone = request.getPhone();
        if (phone == null || !phone.matches("\\d{10,15}")) {
            throw new BadRequestException("Invalid phone number format");
        }

        LocalDateTime fifteenMinsAgo = LocalDateTime.now().minusMinutes(15);
        long count = otpRepository.countByIdentifierAndCreatedAtAfter(phone, fifteenMinsAgo);
        if (count >= 3) {
            throw new BadRequestException("Too many OTP requests. Please try again later.");
        }

        String otp = String.format("%06d", random.nextInt(1000000));
        String hashedOtp = passwordEncoder.encode(otp);

        OtpEntity otpEntity = new OtpEntity();
        otpEntity.setId(UUID.randomUUID().toString());
        otpEntity.setIdentifier(phone);
        otpEntity.setOtpHash(hashedOtp);
        otpEntity.setPurpose("LOGIN");
        otpEntity.setAttempts(0);
        otpEntity.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpEntity.setCreatedAt(LocalDateTime.now());
        
        otpRepository.save(otpEntity);
        smsService.sendOtp(phone, otp);

        return ApiResponse.success("OTP sent successfully");
    }

    @Override
    @Transactional
    public ApiResponse<AuthResponse> verifyOtp(VerifyOtpRequest request) {
        OtpEntity otpEntity = otpRepository.findTopByIdentifierAndPurposeOrderByCreatedAtDesc(request.getPhone(), "LOGIN")
                .orElseThrow(() -> new BadRequestException("No OTP found for this phone"));

        if (otpEntity.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP has expired");
        }
        if (otpEntity.getAttempts() >= 3) {
            throw new BadRequestException("Too many invalid attempts");
        }
        if (!passwordEncoder.matches(request.getOtp(), otpEntity.getOtpHash())) {
            otpEntity.setAttempts(otpEntity.getAttempts() + 1);
            otpRepository.save(otpEntity);
            throw new BadRequestException("Invalid OTP");
        }

        otpEntity.setVerifiedAt(LocalDateTime.now());
        otpRepository.save(otpEntity);

        UserEntity user = userRepository.findByPhone(request.getPhone()).orElseGet(() -> {
            UserEntity newUser = new UserEntity();
            newUser.setId(UUID.randomUUID().toString());
            newUser.setPhone(request.getPhone());
            newUser.setRole("CUSTOMER");
            newUser.setAuthProvider("PHONE");
            newUser.setIsActive(true);
            newUser.setCreatedAt(LocalDateTime.now());
            newUser.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(newUser);
        });

        customerRepository.findByUserId(user.getId()).orElseGet(() -> {
            CustomerEntity customer = new CustomerEntity();
            customer.setId(UUID.randomUUID().toString());
            customer.setUser(user);
            customer.setPhone(user.getPhone());
            return customerRepository.save(customer);
        });

        String token = jwtTokenProvider.generateToken(user.getId(), user.getPhone(), user.getRole(), user.getFullName());
        return ApiResponse.success("Login successful", buildAuthResponse(token, user, null));
    }

    @Override
    @Transactional
    public ApiResponse<AuthResponse> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already taken");
        }
        if (request.getPhone() != null && userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone already taken");
        }

        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID().toString());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setFullName(request.getFullName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("CUSTOMER");
        user.setAuthProvider("LOCAL");
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user = userRepository.save(user);

        CustomerEntity customer = new CustomerEntity();
        customer.setId(UUID.randomUUID().toString());
        customer.setUser(user);
        customer.setFullName(user.getFullName());
        customer.setEmail(user.getEmail());
        customer.setPhone(user.getPhone());
        customerRepository.save(customer);

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole(), user.getFullName());
        return ApiResponse.success("Registration successful", buildAuthResponse(token, user, null));
    }

    @Override
    @Transactional
    public ApiResponse<AuthResponse> login(LoginRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole(), user.getFullName());
        return ApiResponse.success("Login successful", buildAuthResponse(token, user, null));
    }

    @Override
    @Transactional
    public ApiResponse<AuthResponse> googleLogin(GoogleLoginRequest request) {
        String email = request.getCredential() != null ? request.getCredential() : request.getEmail();
        if (email == null) {
             throw new BadRequestException("Email/credential is required");
        }

        UserEntity user = userRepository.findByEmail(email).orElseGet(() -> {
            UserEntity newUser = new UserEntity();
            newUser.setId(UUID.randomUUID().toString());
            newUser.setEmail(email);
            newUser.setRole("CUSTOMER");
            newUser.setAuthProvider("GOOGLE");
            newUser.setIsActive(true);
            newUser.setCreatedAt(LocalDateTime.now());
            newUser.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(newUser);
        });

        customerRepository.findByUserId(user.getId()).orElseGet(() -> {
            CustomerEntity customer = new CustomerEntity();
            customer.setId(UUID.randomUUID().toString());
            customer.setUser(user);
            customer.setEmail(user.getEmail());
            return customerRepository.save(customer);
        });

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole(), user.getFullName());
        return ApiResponse.success("Google login successful", buildAuthResponse(token, user, null));
    }

    @Override
    @Transactional
    public ApiResponse<AuthResponse> adminLogin(AdminLoginRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        if (!"ADMIN".equals(user.getRole()) && !"FIELD_AGENT".equals(user.getRole())) {
            throw new UnauthorizedException("Unauthorized access");
        }

        String agentId = null;
        if ("FIELD_AGENT".equals(user.getRole())) {
            FieldAgentEntity agent = fieldAgentRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Agent details not found"));
            agentId = agent.getId();
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole(), user.getFullName());
        return ApiResponse.success("Admin login successful", buildAuthResponse(token, user, agentId));
    }

    @Override
    @Transactional
    public ApiResponse<Void> forgotPassword(ForgotPasswordRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String otp = String.format("%06d", random.nextInt(1000000));
        String hashedOtp = passwordEncoder.encode(otp);

        OtpEntity otpEntity = new OtpEntity();
        otpEntity.setId(UUID.randomUUID().toString());
        otpEntity.setIdentifier(user.getEmail());
        otpEntity.setOtpHash(hashedOtp);
        otpEntity.setPurpose("RESET_PASSWORD");
        otpEntity.setAttempts(0);
        otpEntity.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        otpEntity.setCreatedAt(LocalDateTime.now());
        
        otpRepository.save(otpEntity);
        log.info("[DEV SMS] RESET OTP for {}: {}", user.getEmail(), otp);

        return ApiResponse.success("Password reset instructions sent");
    }

    @Override
    @Transactional
    public ApiResponse<Void> resetPassword(ResetPasswordRequest request) {
        OtpEntity otpEntity = otpRepository.findTopByIdentifierAndPurposeOrderByCreatedAtDesc(request.getEmail(), "RESET_PASSWORD")
                .orElseThrow(() -> new BadRequestException("No reset request found"));

        if (otpEntity.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP has expired");
        }
        if (otpEntity.getAttempts() >= 3) {
            throw new BadRequestException("Too many invalid attempts");
        }
        if (!passwordEncoder.matches(request.getOtp(), otpEntity.getOtpHash())) {
            otpEntity.setAttempts(otpEntity.getAttempts() + 1);
            otpRepository.save(otpEntity);
            throw new BadRequestException("Invalid OTP");
        }

        otpEntity.setVerifiedAt(LocalDateTime.now());
        otpRepository.save(otpEntity);

        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return ApiResponse.success("Password reset successful");
    }

    private AuthResponse buildAuthResponse(String token, UserEntity user, String agentId) {
        return AuthResponse.builder()
                .token(token)
                .user(AuthResponse.UserProfileDto.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .fullName(user.getFullName())
                        .role(user.getRole())
                        .authProvider(user.getAuthProvider())
                        .agentId(agentId)
                        .build())
                .build();
    }
}
