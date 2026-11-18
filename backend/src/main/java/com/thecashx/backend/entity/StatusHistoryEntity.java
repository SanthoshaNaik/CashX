package com.thecashx.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "status_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusHistoryEntity {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private BuybackRequestEntity buybackRequest;

    @Column(name = "from_status", length = 50)
    private String fromStatus;

    @Column(name = "to_status", length = 50, nullable = false)
    private String toStatus;

    @Column(name = "changed_by_user_id", length = 36)
    private String changedByUserId;

    @Column(name = "changed_by_name", length = 150)
    private String changedByName;

    @Column(columnDefinition = "TEXT")
    private String reason;

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
