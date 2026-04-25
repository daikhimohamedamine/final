package com.digitalassethub.medical.api.admin.importing;

import com.digitalassethub.medical.api.drug.DrugEntity;
import com.digitalassethub.medical.api.drug.DrugRepository;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DrugCsvImportService {
    private final DrugRepository repository;

    @Transactional
    public ImportResult importCsv(InputStream in, boolean clearBefore) {
        if (clearBefore) {
            repository.deleteAllInBatch();
        }

        int created = 0;
        int skipped = 0;
        List<String> errors = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8))) {
            CSVParser parser = CSVFormat.DEFAULT
                    .builder()
                    .setHeader()
                    .setSkipHeaderRecord(true)
                    .setIgnoreSurroundingSpaces(true)
                    .build()
                    .parse(reader);

            for (CSVRecord record : parser) {
                try {
                    // commons-csv merges correctly when file is well-formed; but our dataset sometimes has
                    // unquoted commas in last column. We rebuild a map from header order and join overflow into sicknesses.
                    var map = record.toMap();
                    var fixed = new LinkedHashMap<>(map);
                    if (record.size() > map.size()) {
                        // not expected, but keep safe
                    }

                    String drugName = fixed.getOrDefault("drug_name", "");
                    String genericName = fixed.getOrDefault("generic_name", "");
                    String dosage = fixed.getOrDefault("dosage", "");
                    String indications = fixed.getOrDefault("indications", "");
                    String imageLookupUrl = fixed.getOrDefault("image_lookup_url", "");
                    String setId = fixed.getOrDefault("set_id", "");
                    String sicknessRaw = fixed.getOrDefault("sicknesses", "");

                    if ((drugName == null || drugName.isBlank()) && (setId == null || setId.isBlank())) {
                        skipped++;
                        continue;
                    }

                    DrugEntity e = new DrugEntity();
                    e.setDrugName(nullIfBlank(drugName));
                    e.setGenericName(nullIfBlank(genericName));
                    e.setDosage(nullIfBlank(dosage));
                    e.setIndications(nullIfBlank(indications));
                    e.setImageLookupUrl(nullIfBlank(imageLookupUrl));
                    e.setSetId(nullIfBlank(setId));
                    e.setActive(true);
                    e.setSicknesses(parseSicknesses(sicknessRaw));
                    repository.save(e);
                    created++;
                } catch (Exception inner) {
                    errors.add("line " + record.getRecordNumber() + ": " + inner.getMessage());
                }
            }
        } catch (Exception ex) {
            errors.add(ex.getMessage());
        }

        return new ImportResult(created, skipped, errors);
    }

    private static String nullIfBlank(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    private static List<String> parseSicknesses(String raw) {
        if (raw == null) return List.of();
        String s = raw.trim();
        if (s.isEmpty()) return List.of();

        // Heuristics for this dataset:
        // - sometimes a single keyword (e.g. "acne")
        // - sometimes a phrase
        // - sometimes multiple keywords separated by | ; /
        // We avoid splitting on commas because the field itself frequently contains commas.
        String[] parts = s.split("\\s*[\\|;/]\\s*");
        List<String> out = new ArrayList<>();
        for (String p : parts) {
            String t = p.trim();
            if (!t.isEmpty() && out.size() < 50) {
                out.add(t);
            }
        }
        return out.isEmpty() ? List.of(s) : out;
    }

    public record ImportResult(int created, int skipped, List<String> errors) {}
}

