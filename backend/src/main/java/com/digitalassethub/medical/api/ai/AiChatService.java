package com.digitalassethub.medical.api.ai;

import com.digitalassethub.medical.api.appointment.AppointmentRepository;
import com.digitalassethub.medical.api.consultation.ConsultationRepository;
import com.digitalassethub.medical.api.employee.EmployeeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.*;

@Service
public class AiChatService {
    private static final Logger log = LoggerFactory.getLogger(AiChatService.class);

    private final EmployeeRepository employeeRepository;
    private final AppointmentRepository appointmentRepository;
    private final ConsultationRepository consultationRepository;

    @Value("${llm.base-url}")
    private String llmBaseUrl;
    @Value("${llm.api-key}")
    private String llmApiKey;
    @Value("${llm.model}")
    private String llmModel;

    public AiChatService(EmployeeRepository employeeRepository,
                        AppointmentRepository appointmentRepository,
                        ConsultationRepository consultationRepository) {
        this.employeeRepository = employeeRepository;
        this.appointmentRepository = appointmentRepository;
        this.consultationRepository = consultationRepository;
    }

    public Map<String, String> chat(ChatRequest request) {
        log.info("--- IA MODE SÉCURITÉ (SANS TOOLS) ---");
        
        // On récupère les stats pour les donner à l'IA dans le prompt
        long patientCount = employeeRepository.count();
        long consultCount = consultationRepository.count();
        long apptCount = appointmentRepository.count();

        String systemPrompt = String.format(
            "Tu es MediBot, l'assistant médical de COFICAB. Réponds en français. " +
            "Voici les statistiques actuelles de l'application : " +
            "- Nombre total d'employés (patients) : %d " +
            "- Nombre total de consultations : %d " +
            "- Nombre de rendez-vous : %d. " +
            "Voici les rendez-vous d'aujourd'hui : %s. " +
            "Utilise ces chiffres si on te pose des questions sur les totaux.",
            patientCount, consultCount, apptCount, appointmentRepository.findAll().stream().limit(5).map(a -> a.getDateDebut().toString()).collect(java.util.stream.Collectors.joining(", "))
        );

        List<Map<String, Object>> contents = new ArrayList<>();
        contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", systemPrompt))));
        contents.add(Map.of("role", "model", "parts", List.of(Map.of("text", "Compris. Je connais les statistiques et je suis prêt." ))));

        if (request.getHistory() != null) {
            for (var h : request.getHistory()) {
                String role = h.get("role");
                String content = h.get("content");
                if (content != null && !content.isBlank()) {
                    contents.add(Map.of("role", "assistant".equals(role) ? "model" : "user", 
                                      "parts", List.of(Map.of("text", content))));
                }
            }
        }
        contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", request.getMessage()))));

        Map<String, Object> body = new HashMap<>();
        body.put("contents", contents);

        try {
            Map<String, Object> response = callGemini(body);
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                if (!parts.isEmpty() && parts.get(0).containsKey("text")) {
                    return Map.of("response", (String) parts.get(0).get("text"));
                }
            }
            return Map.of("response", "Désolé, je n'ai pas pu générer de réponse.");
        } catch (Exception e) {
            log.error("AI ERROR: {}", e.getMessage());
            return Map.of("response", "Erreur technique IA : " + e.getMessage());
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
