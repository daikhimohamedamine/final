package com.digitalassethub.medical.api.reminder;

import com.digitalassethub.medical.api.consultation.ConsultationRepository;
import com.digitalassethub.medical.api.employee.EmployeeRepository;
import java.time.LocalDate;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReminderScheduler {
    private final EmployeeRepository employeeRepository;
    private final ConsultationRepository consultationRepository;
    private final ReminderRepository reminderRepository;

    @Scheduled(cron = "0 0 8 * * ?")
    public void checkAndCreatePeriodicReminders() {
        var employees = employeeRepository.findAll().stream()
                .filter(e -> "ACTIF".equalsIgnoreCase(e.getStatut()))
                .collect(Collectors.toList());

        for (var employee : employees) {
            var lastPeriodic = consultationRepository
                    .findTopByEmployeeIdAndTypeOrderByDateConsultationDesc(employee.getId(), "PERIODIQUE");
            if (lastPeriodic.isEmpty()) {
                continue;
            }
            LocalDate lastDate = lastPeriodic.get().getDateConsultation();
            if (lastDate != null && lastDate.isBefore(LocalDate.now().minusDays(365))
                    && reminderRepository.findTopByEmployeeIdAndTypeAndEnvoyeFalse(employee.getId(), "PERIODIQUE").isEmpty()) {
                ReminderEntity reminder = new ReminderEntity();
                reminder.setEmployeeId(employee.getId());
                reminder.setType("PERIODIQUE");
                reminder.setDateEcheance(LocalDate.now().plusDays(7));
                reminder.setEnvoye(false);
                reminderRepository.save(reminder);
            }
        }
    }
}
