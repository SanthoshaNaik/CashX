package com.thecashx.backend.repository;
import com.thecashx.backend.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<CustomerEntity, String> {
    Optional<CustomerEntity> findByUserId(String userId);
    Optional<CustomerEntity> findByPhone(String phone);
    Optional<CustomerEntity> findByEmail(String email);
    Optional<CustomerEntity> findByPhoneOrEmail(String phone, String email);
}
