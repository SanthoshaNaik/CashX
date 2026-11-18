package com.thecashx.backend.repository;

import com.thecashx.backend.entity.RequestDeviceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RequestDeviceRepository extends JpaRepository<RequestDeviceEntity, String> {
    Optional<RequestDeviceEntity> findByBuybackRequestId(String requestId);
}
