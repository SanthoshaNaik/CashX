package com.thecashx.backend.service;

import com.thecashx.backend.dto.common.ApiResponse;
import com.thecashx.backend.dto.request.*;
import com.thecashx.backend.dto.response.AuthResponse;

public interface AuthService {
    ApiResponse<Void> sendOtp(SendOtpRequest request);
    ApiResponse<AuthResponse> verifyOtp(VerifyOtpRequest request);
    ApiResponse<AuthResponse> register(RegisterRequest request);
    ApiResponse<AuthResponse> login(LoginRequest request);
    ApiResponse<AuthResponse> googleLogin(GoogleLoginRequest request);
    ApiResponse<AuthResponse> adminLogin(AdminLoginRequest request);
    ApiResponse<Void> forgotPassword(ForgotPasswordRequest request);
    ApiResponse<Void> resetPassword(ResetPasswordRequest request);
}
