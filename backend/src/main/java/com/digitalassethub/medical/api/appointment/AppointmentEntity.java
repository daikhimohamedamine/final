package com.digitalassethub.medical.api.appointment;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "appointment")
public class AppointmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long employeeId;
    private Long medecinId;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private String typeVisite;
    private String statut;
    private String notes;
    private Long createdBy;
}
