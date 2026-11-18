package com.thecashx.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "field_agents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FieldAgentEntity {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private UserEntity user;

    @Column(length = 150, nullable = false)
    private String name;

    @Column(length = 20, nullable = false)
    private String phone;

    @Column(length = 150, nullable = false, unique = true)
    private String email;

    @Column(length = 100, nullable = false)
    private String city;

    @Column(length = 150, nullable = false)
    private String hub;

    @Column(length = 150)
    private String specialization;

    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = new BigDecimal("5.00");

    @Column(name = "completed_pickups")
    @Builder.Default
    private Integer completedPickups = 0;

    @Column(length = 30)
    @Builder.Default
    private String status = "Active";

    @Column(name = "joined_date")
    private LocalDate joinedDate;

    @Column(length = 500)
    private String avatar;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "assignedAgent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<BuybackRequestEntity> buybackRequests;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
