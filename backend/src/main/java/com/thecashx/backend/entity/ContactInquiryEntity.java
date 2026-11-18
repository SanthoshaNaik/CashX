package com.thecashx.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "contact_inquiries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactInquiryEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(length = 150, nullable = false)
    private String name;

    @Column(length = 150, nullable = false)
    private String email;

    @Column(length = 20, nullable = false)
    private String phone;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(length = 50, nullable = false)
    @Builder.Default
    private String status = "New";

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
