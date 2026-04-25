package com.digitalassethub.medical.api.employee;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<EmployeeEntity, Long> {
    Page<EmployeeEntity> findByNomContainingIgnoreCaseAndPrenomContainingIgnoreCase(
            String nom, String prenom, Pageable pageable
    );
}
