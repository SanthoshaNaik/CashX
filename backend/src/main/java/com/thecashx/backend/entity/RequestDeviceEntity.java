package com.thecashx.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "request_devices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestDeviceEntity {

    @Id
    @Column(length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false, unique = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private BuybackRequestEntity buybackRequest;

    @Column(name = "device_type", length = 50, nullable = false)
    private String deviceType;

    @Column(length = 100, nullable = false)
    private String brand;

    @Column(length = 150)
    private String model;

    @Column(length = 100)
    private String processor;

    @Column(length = 50)
    private String ram;

    @Column(length = 100)
    private String storage;

    @Column(length = 50)
    private String condition;

    @Column(length = 50)
    private String age;

    @Column(columnDefinition = "TEXT")
    private String accessories;

    @Column(name = "expected_price", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal expectedPrice = BigDecimal.ZERO;

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
