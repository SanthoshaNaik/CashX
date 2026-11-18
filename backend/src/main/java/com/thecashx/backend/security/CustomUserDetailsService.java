package com.thecashx.backend.security;

import com.thecashx.backend.entity.UserEntity;
import com.thecashx.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String emailOrPhone) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(emailOrPhone)
                .orElseGet(() -> userRepository.findByPhone(emailOrPhone)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with email or phone: " + emailOrPhone)));

        return new org.springframework.security.core.userdetails.User(
                emailOrPhone,
                user.getPasswordHash() != null ? user.getPasswordHash() : "",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }
}
