package com.digitalassethub.medical.api.drug;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DrugRepository extends JpaRepository<DrugEntity, Long> {
    Page<DrugEntity> findByDrugNameContainingIgnoreCaseOrGenericNameContainingIgnoreCase(
            String drugName, String genericName, Pageable pageable
    );
}
