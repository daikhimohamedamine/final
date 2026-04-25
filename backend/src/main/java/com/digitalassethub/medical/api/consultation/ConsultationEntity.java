package com.digitalassethub.medical.api.consultation;

import com.digitalassethub.medical.api.security.encryption.AesAttributeConverter;
import jakarta.persistence.Convert;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "consultation")
public class ConsultationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "employee_id")
    private Long employeeId;
    @Column(name = "medecin_id")
    private Long medecinId;
    private String type;
    @Column(name = "date_consultation")
    private LocalDate dateConsultation;
    private Double poids;
    private Double taille;
    @Column(columnDefinition = "json")
    @Convert(converter = AesAttributeConverter.class)
    private String details;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
