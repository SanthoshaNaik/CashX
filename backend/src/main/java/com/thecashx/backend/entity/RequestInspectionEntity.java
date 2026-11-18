package com.thecashx.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "request_inspections")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestInspectionEntity {

    @Id
    @Column(length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false, unique = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private BuybackRequestEntity buybackRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inspected_by_agent_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private FieldAgentEntity inspectedByAgent;

    @Column(name = "screen_condition", length = 100)
    private String screenCondition;

    @Column(name = "body_condition", length = 100)
    private String bodyCondition;

    @Column(name = "battery_health", length = 100)
    private String batteryHealth;

    @Column(name = "keyboard_status", length = 100)
    private String keyboardStatus;

    @Column(name = "ports_status", length = 100)
    private String portsStatus;

    @Column(name = "wifi_bluetooth_status", length = 100)
    private String wifiBluetoothStatus;

    @Column(name = "sound_mic_status", length = 100)
    private String soundMicStatus;

    @Column(name = "verified_accessories", columnDefinition = "TEXT")
    private String verifiedAccessories;

    @CreationTimestamp
    @Column(name = "inspected_at", nullable = false, updatable = false)
    private LocalDateTime inspectedAt;

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
