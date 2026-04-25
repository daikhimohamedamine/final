package com.digitalassethub.medical.api.ai;

import com.digitalassethub.medical.api.drug.DrugRepository;
import com.digitalassethub.medical.api.employee.EmployeeRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class AiRecommendationService {
    private final EmployeeRepository employeeRepository;
    private final DrugRepository drugRepository;

    @Value("${llm.base-url}")
    private String llmBaseUrl;
    @Value("${llm.api-key}")
    private String llmApiKey;
    @Value("${llm.model}")
    private String llmModel;

    public Object recommend(AiRecommendRequest request) {
        var employee = employeeRepository.findById(request.employeeId()).orElseThrow();
        var drugs = drugRepository.findAll();

        String prompt = "Symptoms: " + request.symptoms() + "\n"
                + "Employee: " + employee.getNom() + " " + employee.getPrenom() + "\n"
                + "Allowed drugs (only pick from this list): " + drugs.stream()
                .map(d -> d.getId() + ":" + d.getDrugName() + " (" + d.getGenericName() + "), dosage=" + d.getDosage() + ", sicknesses=" + (d.getSicknesses() == null ? List.of() : d.getSicknesses()))
                .toList()
                + "\nReturn strict JSON list recommendations with justification and warning.";

        Map<String, Object> body = new HashMap<>();
        body.put("model", llmModel);
        body.put("input", prompt);

        return WebClient.builder()
                .baseUrl(llmBaseUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + llmApiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build()
                .post()
                .uri("/v1/responses")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }
}
