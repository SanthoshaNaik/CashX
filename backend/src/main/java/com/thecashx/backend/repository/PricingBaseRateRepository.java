package com.thecashx.backend.repository;
import com.thecashx.backend.entity.PricingBaseRateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface PricingBaseRateRepository extends JpaRepository<PricingBaseRateEntity, String> {
    Optional<PricingBaseRateEntity> findByCategoryAndBrandAndActiveTrue(String category, String brand);
    Optional<PricingBaseRateEntity> findByCategoryAndBrandAndModelAndActiveTrue(String category, String brand, String model);
    List<PricingBaseRateEntity> findByActiveTrue();
    List<PricingBaseRateEntity> findByCategoryAndActiveTrue(String category);
}
