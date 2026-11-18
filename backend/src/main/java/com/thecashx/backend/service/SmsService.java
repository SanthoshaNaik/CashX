package com.thecashx.backend.service;

public interface SmsService {
    void sendOtp(String phoneNumber, String otpCode);
}
