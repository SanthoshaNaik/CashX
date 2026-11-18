package com.thecashx.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pricing_base_rates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingBaseRateEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(length = 50, nullable = false)
    private String category;

    @Column(length = 100, nullable = false)
    private String brand;

    @Column(length = 150)
    private String model;

    @Column(name = "base_price", precision = 12, scale = 2, nullable = false)
    private BigDecimal basePrice;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
