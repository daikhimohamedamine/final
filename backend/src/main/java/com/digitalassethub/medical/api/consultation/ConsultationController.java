package com.digitalassethub.medical.api.consultation;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

@Tag(name = "Consultations")
@RestController
@RequestMapping("/api/v1/consultations")
@RequiredArgsConstructor
public class ConsultationController {
    private final ConsultationRepository repository;

    @GetMapping
    @PreAuthorize("hasAnyRole('COORDINATRICE','DOCTOR')")
    public Page<ConsultationEntity> list(@RequestParam Long employeeId, @RequestParam(defaultValue = "") String type, Pageable pageable) {
        return repository.findByEmployeeIdAndTypeContainingIgnoreCase(employeeId, type, pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDINATRICE','DOCTOR')")
    public ConsultationEntity get(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('COORDINATRICE','DOCTOR')")
    public ConsultationEntity create(@RequestBody ConsultationEntity consultation) {
        consultation.setId(null);
        return repository.save(consultation);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDINATRICE','DOCTOR')")
    public ConsultationEntity update(@PathVariable Long id, @RequestBody ConsultationEntity payload) {
        ConsultationEntity consultation = repository.findById(id).orElseThrow();
        consultation.setType(payload.getType());
        consultation.setDateConsultation(payload.getDateConsultation());
        consultation.setPoids(payload.getPoids());
        consultation.setTaille(payload.getTaille());
        consultation.setDetails(payload.getDetails());
        return repository.save(consultation);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COORDINATRICE')")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
