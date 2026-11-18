package com.thecashx.backend.repository;
import com.thecashx.backend.entity.ContactInquiryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContactInquiryRepository extends JpaRepository<ContactInquiryEntity, String> {
    List<ContactInquiryEntity> findByStatus(String status);
    List<ContactInquiryEntity> findAllByOrderByCreatedAtDesc();
}
