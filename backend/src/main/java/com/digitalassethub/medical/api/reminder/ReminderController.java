package com.digitalassethub.medical.api.reminder;

import com.digitalassethub.medical.api.notification.NotificationLogRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Reminders")
@RestController
@RequestMapping("/api/v1/reminders")
@RequiredArgsConstructor
public class ReminderController {
    private final ReminderRepository repository;
    private final NotificationLogRepository notificationLogRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('COORDINATRICE','DOCTOR')")
    public List<ReminderEntity> list(@RequestParam LocalDate from, @RequestParam LocalDate to) {
        return repository.findByDateEcheanceBetween(from, to);
    }

    @PostMapping("/manual")
    @PreAuthorize("hasRole('COORDINATRICE')")
    public ReminderEntity createManual(@RequestBody ReminderEntity reminder) {
        reminder.setId(null);
        reminder.setType("MANUEL");
        reminder.setEnvoye(false);
        return repository.save(reminder);
    }

    @PutMapping("/{id}/send")
    @PreAuthorize("hasRole('COORDINATRICE')")
    public ReminderEntity send(@PathVariable Long id) {
        ReminderEntity reminder = repository.findById(id).orElseThrow();
        reminder.setEnvoye(true);
        reminder.setDateEnvoi(LocalDateTime.now());
        var log = new com.digitalassethub.medical.api.notification.NotificationLogEntity();
        log.setDestinataireEmail("unknown@local");
        log.setSujet("Rappel medical");
        log.setContenu("Reminder id " + reminder.getId() + " sent manually.");
        log.setStatut("SUCCESS");
        notificationLogRepository.save(log);
        return repository.save(reminder);
    }
}
