package com.digitalassethub.medical.api.employee;

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
@Table(name = "employee")
public class EmployeeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "dossier_number", nullable = false, unique = true)
    private String dossierNumber;
    private String nom;
    private String prenom;
    @Column(name = "date_naissance")
    private LocalDate dateNaissance;
    private String departement;
    @Column(name = "poste_travail")
    private String posteTravail;
    private String email;
    @Column(name = "statut")
    private String statut = "ACTIF";
    @Column(name = "archived_at")
    private LocalDateTime archivedAt;
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
