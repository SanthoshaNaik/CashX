package com.thecashx.backend.repository;
import com.thecashx.backend.entity.BuybackRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BuybackRequestRepository extends JpaRepository<BuybackRequestEntity, String>, JpaSpecificationExecutor<BuybackRequestEntity> {
    List<BuybackRequestEntity> findByCustomerId(String customerId);
    List<BuybackRequestEntity> findByAssignedAgentId(String agentId);
    List<BuybackRequestEntity> findByStatus(String status);
    List<BuybackRequestEntity> findByCustomerIdOrderByCreatedAtDesc(String customerId);
    List<BuybackRequestEntity> findByAssignedAgentIdOrderByCreatedAtDesc(String agentId);
    long countByStatus(String status);

    @Query("SELECT b FROM BuybackRequestEntity b JOIN b.customer c WHERE c.city = :city")
    List<BuybackRequestEntity> findByCustomerCity(@Param("city") String city);
}
