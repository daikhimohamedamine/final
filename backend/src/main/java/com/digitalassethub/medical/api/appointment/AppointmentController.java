package com.digitalassethub.medical.api.appointment;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Appointments")
@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
public class AppointmentController {
    private final AppointmentRepository repository;

    @GetMapping
    @PreAuthorize("hasAnyRole('COORDINATRICE','DOCTOR')")
    public List<AppointmentEntity> list(@RequestParam LocalDateTime from, @RequestParam LocalDateTime to) {
        return repository.findByDateDebutBetween(from, to);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('COORDINATRICE','DOCTOR')")
    public AppointmentEntity create(@RequestBody AppointmentEntity payload) {
        payload.setId(null);
        if (payload.getStatut() == null || payload.getStatut().isBlank()) {
            payload.setStatut("PLANIFIE");
        }
        return repository.save(payload);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDINATRICE','DOCTOR')")
    public AppointmentEntity update(@PathVariable Long id, @RequestBody AppointmentEntity payload) {
        AppointmentEntity entity = repository.findById(id).orElseThrow();
        entity.setDateDebut(payload.getDateDebut());
        entity.setDateFin(payload.getDateFin());
        entity.setTypeVisite(payload.getTypeVisite());
        entity.setMedecinId(payload.getMedecinId());
        entity.setNotes(payload.getNotes());
        entity.setStatut(payload.getStatut());
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDINATRICE','DOCTOR')")
    public AppointmentEntity cancel(@PathVariable Long id) {
        AppointmentEntity entity = repository.findById(id).orElseThrow();
        entity.setStatut("ANNULE");
        return repository.save(entity);
    }
}
