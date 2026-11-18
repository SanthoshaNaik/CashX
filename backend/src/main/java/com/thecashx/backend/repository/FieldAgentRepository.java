package com.thecashx.backend.repository;
import com.thecashx.backend.entity.FieldAgentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface FieldAgentRepository extends JpaRepository<FieldAgentEntity, String> {
    List<FieldAgentEntity> findByCity(String city);
    List<FieldAgentEntity> findByStatus(String status);
    List<FieldAgentEntity> findByCityAndStatus(String city, String status);
    Optional<FieldAgentEntity> findByEmail(String email);
    Optional<FieldAgentEntity> findByUserId(String userId);

    @Query("SELECT f FROM FieldAgentEntity f WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(f.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<FieldAgentEntity> searchByNameOrEmailContaining(@Param("search") String search);
}
