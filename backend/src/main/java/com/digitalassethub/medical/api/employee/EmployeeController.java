package com.digitalassethub.medical.api.employee;

import com.digitalassethub.medical.api.audit.Auditable;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Employees")
@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeRepository employeeRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('COORDINATRICE','DOCTOR')")
    public Page<EmployeeEntity> list(
            @RequestParam(defaultValue = "") String nom,
            @RequestParam(defaultValue = "") String prenom,
            Pageable pageable
    ) {
        return employeeRepository.findByNomContainingIgnoreCaseAndPrenomContainingIgnoreCase(nom, prenom, pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDINATRICE','DOCTOR')")
    @Auditable(action = "VIEW_EMPLOYEE", entityType = "Employee")
    public EmployeeEntity get(@PathVariable Long id) {
        return employeeRepository.findById(id).orElseThrow();
    }

    @PostMapping
    @PreAuthorize("hasRole('COORDINATRICE')")
    @Auditable(action = "CREATE_EMPLOYEE", entityType = "Employee")
    public EmployeeEntity create(@Valid @RequestBody EmployeeEntity employee) {
        employee.setId(null);
        return employeeRepository.save(employee);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COORDINATRICE')")
    @Auditable(action = "UPDATE_EMPLOYEE", entityType = "Employee")
    public EmployeeEntity update(@PathVariable Long id, @RequestBody EmployeeEntity payload) {
        EmployeeEntity employee = employeeRepository.findById(id).orElseThrow();
        employee.setNom(payload.getNom());
        employee.setPrenom(payload.getPrenom());
        employee.setDepartement(payload.getDepartement());
        employee.setPosteTravail(payload.getPosteTravail());
        employee.setEmail(payload.getEmail());
        return employeeRepository.save(employee);
    }

    @PutMapping("/{id}/medical")
    @PreAuthorize("hasRole('DOCTOR')")
    public EmployeeEntity updateMedical(@PathVariable Long id, @RequestBody EmployeeEntity payload) {
        EmployeeEntity employee = employeeRepository.findById(id).orElseThrow();
        employee.setStatut(payload.getStatut());
        return employeeRepository.save(employee);
    }

    @PatchMapping("/{id}/archive")
    @PreAuthorize("hasRole('COORDINATRICE')")
    public EmployeeEntity archive(@PathVariable Long id) {
        EmployeeEntity employee = employeeRepository.findById(id).orElseThrow();
        employee.setStatut("ARCHIVE");
        employee.setArchivedAt(LocalDateTime.now());
        return employeeRepository.save(employee);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COORDINATRICE')")
    @Auditable(action = "DELETE_EMPLOYEE", entityType = "Employee")
    public void delete(@PathVariable Long id) {
        employeeRepository.deleteById(id);
    }
}
