package com.thecashx.backend.service.impl;

import com.thecashx.backend.service.SmsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DevLoggingSmsServiceImpl implements SmsService {

    @Override
    public void sendOtp(String phoneNumber, String otpCode) {
        log.info("[DEV SMS] OTP for {}: {}", maskPhone(phoneNumber), otpCode);
    }

    private String maskPhone(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.length() < 4) {
            return "****";
        }
        return "******" + phoneNumber.substring(phoneNumber.length() - 4);
    }
}
