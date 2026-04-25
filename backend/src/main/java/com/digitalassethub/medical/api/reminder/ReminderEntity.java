package com.digitalassethub.medical.api.reminder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "reminder")
public class ReminderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "employee_id")
    private Long employeeId;
    private String type;
    @Column(name = "date_echeance")
    private LocalDate dateEcheance;
    private boolean envoye;
    @Column(name = "date_envoi")
    private LocalDateTime dateEnvoi;
    @Column(name = "created_by")
    private Long createdBy;
}
