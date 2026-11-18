package com.thecashx.backend.repository;

import com.thecashx.backend.entity.RequestInspectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RequestInspectionRepository extends JpaRepository<RequestInspectionEntity, String> {
    Optional<RequestInspectionEntity> findByBuybackRequestId(String requestId);
}
