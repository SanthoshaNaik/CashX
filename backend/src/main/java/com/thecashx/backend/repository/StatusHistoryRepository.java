package com.thecashx.backend.repository;

import com.thecashx.backend.entity.StatusHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StatusHistoryRepository extends JpaRepository<StatusHistoryEntity, String> {
    List<StatusHistoryEntity> findByBuybackRequestIdOrderByCreatedAtAsc(String requestId);
}
