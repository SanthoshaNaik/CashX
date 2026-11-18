package com.thecashx.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "buyback_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuybackRequestEntity {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private CustomerEntity customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_agent_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private FieldAgentEntity assignedAgent;

    @Column(length = 50, nullable = false)
    @Builder.Default
    private String status = "New Request";

    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;

    @Column(name = "time_slot", length = 100)
    private String timeSlot;

    @Column(name = "dispatch_notes", columnDefinition = "TEXT")
    private String dispatchNotes;

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate;

    @Column(name = "estimated_price", precision = 12, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal estimatedPrice = BigDecimal.ZERO;

    @Column(name = "final_offer_price", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal finalOfferPrice = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "buybackRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private RequestDeviceEntity requestDevice;

    @OneToOne(mappedBy = "buybackRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private RequestInspectionEntity requestInspection;

    @OneToMany(mappedBy = "buybackRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<StatusHistoryEntity> statusHistory;
}
