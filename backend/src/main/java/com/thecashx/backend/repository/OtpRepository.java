package com.thecashx.backend.repository;
import com.thecashx.backend.entity.OtpEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Modifying;

public interface OtpRepository extends JpaRepository<OtpEntity, String> {
    Optional<OtpEntity> findTopByIdentifierAndPurposeOrderByCreatedAtDesc(String identifier, String purpose);
    long countByIdentifierAndCreatedAtAfter(String identifier, LocalDateTime after);
    
    @Modifying
    @Transactional
    void deleteByExpiresAtBefore(LocalDateTime before);
}
