package com.digitalassethub.medical.api.ai;

import com.digitalassethub.medical.api.drug.DrugEntity;
import com.digitalassethub.medical.api.drug.DrugRepository;
import com.digitalassethub.medical.api.employee.EmployeeRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class AiRecommendationService {
    private final EmployeeRepository employeeRepository;
    private final DrugRepository drugRepository;

    @Value("${llm.base-url}")
    private String llmBaseUrl;
    @Value("${llm.api-key}")
    private String llmApiKey;
    @Value("${llm.model}")
    private String llmModel;

    public AiRecommendationService(EmployeeRepository employeeRepository, DrugRepository drugRepository) {
        this.employeeRepository = employeeRepository;
        this.drugRepository = drugRepository;
    }

    public Map<String, Object> recommend(AiRecommendRequest request) {
        var employee = employeeRepository.findById(request.employeeId()).orElseThrow();
        List<DrugEntity> drugs = drugRepository.findAll();

        String systemPrompt = "Tu es un assistant médical tunisien expert. " +
                "Propose des médicaments UNIQUEMENT à partir de la liste fournie ci-dessous. " +
                "Retourne TOUJOURS ta réponse au format JSON strict (liste d'objets) avec les champs 'medicament', 'justification' et 'avertissement'.";

        String userPrompt = "Symptômes : " + request.symptoms() + "\n"
                + "Patient : " + employee.getNom() + " " + employee.getPrenom() + "\n"
                + "Médicaments autorisés : " + drugs.stream()
                .map(d -> d.getDrugName() + " (" + d.getGenericName() + "), dosage=" + d.getDosage() + ", indications=" + (d.getIndications() == null ? "" : d.getIndications()))
                .limit(20) // Limiter pour ne pas dépasser le quota de tokens
                .toList();

        List<Map<String, Object>> contents = new ArrayList<>();
        contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", systemPrompt))));
        contents.add(Map.of("role", "model", "parts", List.of(Map.of("text", "Compris. Je vais analyser les symptômes et proposer les médicaments adaptés de la liste."))));
        contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", userPrompt))));

        Map<String, Object> body = new HashMap<>();
        body.put("contents", contents);

        try {
            return callGemini(body);
        } catch (Exception e) {
            return Map.of("error", "Erreur IA: " + e.getMessage());
        }
    }

    private Map<String, Object> callGemini(Map<String, Object> body) {
        String cleanBaseUrl = llmBaseUrl.endsWith("/") ? llmBaseUrl.substring(0, llmBaseUrl.length()-1) : llmBaseUrl;
        String path = String.format("/v1/models/%s:generateContent", llmModel);
        
        return WebClient.builder()
                .baseUrl(cleanBaseUrl)
                .build()
                .post()
                .uri(uriBuilder -> uriBuilder.path(path).queryParam("key", llmApiKey).build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .onStatus(status -> status.isError(), resp -> resp.bodyToMono(String.class).map(s -> new RuntimeException("Gemini error: " + s)))
                .bodyToMono(Map.class)
                .block();
    }
}
