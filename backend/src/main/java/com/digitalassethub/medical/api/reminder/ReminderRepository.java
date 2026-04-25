package com.digitalassethub.medical.api.reminder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReminderRepository extends JpaRepository<ReminderEntity, Long> {
    List<ReminderEntity> findByDateEcheanceBetween(LocalDate from, LocalDate to);
    Optional<ReminderEntity> findTopByEmployeeIdAndTypeAndEnvoyeFalse(Long employeeId, String type);
}
