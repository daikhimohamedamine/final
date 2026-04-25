package com.digitalassethub.medical.api.drug;

import com.digitalassethub.medical.api.common.jpa.JsonStringListConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "drug")
public class DrugEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "drug_name")
    private String drugName;
    @Column(name = "generic_name")
    private String genericName;
    private String dosage;
    private String indications;
    @Column(name = "image_lookup_url")
    private String imageLookupUrl;
    @Column(name = "set_id")
    private String setId;
    @Column(columnDefinition = "json")
    @Convert(converter = JsonStringListConverter.class)
    private List<String> sicknesses;
    private boolean active = true;
}
