package com.thecashx.backend.service;

import com.thecashx.backend.dto.common.ApiResponse;
import com.thecashx.backend.dto.request.AdminLoginRequest;
import com.thecashx.backend.dto.request.RegisterRequest;
import com.thecashx.backend.dto.response.AuthResponse;
import com.thecashx.backend.entity.CustomerEntity;
import com.thecashx.backend.entity.UserEntity;
import com.thecashx.backend.exception.BadRequestException;
import com.thecashx.backend.exception.UnauthorizedException;
import com.thecashx.backend.repository.CustomerRepository;
import com.thecashx.backend.repository.FieldAgentRepository;
import com.thecashx.backend.repository.OtpRepository;
import com.thecashx.backend.repository.UserRepository;
import com.thecashx.backend.security.JwtTokenProvider;
import com.thecashx.backend.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private FieldAgentRepository fieldAgentRepository;

    @Mock
    private OtpRepository otpRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private SmsService smsService;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void testRegister_Success() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Rahul Sharma")
                .email("rahul.sharma@example.com")
                .password("Secret@123")
                .phone("9876543210")
                .build();

        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(userRepository.existsByPhone(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashedSecret");
        when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(customerRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtTokenProvider.generateToken(any(), any(), any(), any())).thenReturn("mock-jwt-token");

        ApiResponse<AuthResponse> response = authService.register(request);

        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("mock-jwt-token", response.getData().getToken());
        assertEquals("Rahul Sharma", response.getData().getUser().getFullName());
    }

    @Test
    void testRegister_DuplicateEmail_ThrowsException() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Rahul Sharma")
                .email("existing@example.com")
                .password("Secret@123")
                .build();

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
    }

    @Test
    void testAdminLogin_Success() {
        AdminLoginRequest request = AdminLoginRequest.builder()
                .email("admin@thecashx.com")
                .password("admin123")
                .build();

        UserEntity adminUser = UserEntity.builder()
                .id("admin-001")
                .email("admin@thecashx.com")
                .fullName("Super Admin")
                .role("ADMIN")
                .passwordHash("hashedPass")
                .build();

        when(userRepository.findByEmail("admin@thecashx.com")).thenReturn(Optional.of(adminUser));
        when(passwordEncoder.matches("admin123", "hashedPass")).thenReturn(true);
        when(jwtTokenProvider.generateToken(eq("admin-001"), eq("admin@thecashx.com"), eq("ADMIN"), eq("Super Admin")))
                .thenReturn("admin-token-xyz");

        ApiResponse<AuthResponse> response = authService.adminLogin(request);

        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("admin-token-xyz", response.getData().getToken());
        assertEquals("ADMIN", response.getData().getUser().getRole());
    }

    @Test
    void testAdminLogin_InvalidPassword_ThrowsException() {
        AdminLoginRequest request = AdminLoginRequest.builder()
                .email("admin@thecashx.com")
                .password("wrongpassword")
                .build();

        UserEntity adminUser = UserEntity.builder()
                .id("admin-001")
                .email("admin@thecashx.com")
                .passwordHash("hashedPass")
                .role("ADMIN")
                .build();

        when(userRepository.findByEmail("admin@thecashx.com")).thenReturn(Optional.of(adminUser));
        when(passwordEncoder.matches("wrongpassword", "hashedPass")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.adminLogin(request));
    }
}
