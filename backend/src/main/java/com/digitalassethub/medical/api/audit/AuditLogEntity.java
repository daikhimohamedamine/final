package com.digitalassethub.medical.api.audit;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "audit_log")
public class AuditLogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String action;
    private String entityType;
    private Long entityId;
    private String details;
    private String ipAddress;
    private LocalDateTime timestamp;

    @PrePersist
    void prePersist() {
        timestamp = LocalDateTime.now();
    }
}
