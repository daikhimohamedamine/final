package com.digitalassethub.medical.api.ai;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "AI Assistant")
@RestController
@RequestMapping("/api/v1/ai")
public class AiController {
    private final AiRecommendationService recommendationService;
    private final AiChatService chatService;

    public AiController(AiRecommendationService recommendationService, AiChatService chatService) {
        this.recommendationService = recommendationService;
        this.chatService = chatService;
    }

    @PostMapping("/recommend")
    @PreAuthorize("hasRole('MEDECIN')")
    public Object recommend(@Valid @RequestBody AiRecommendRequest request) {
        return recommendationService.recommend(request);
    }

    @PostMapping("/chat")
    @PreAuthorize("hasAnyRole('COORDINATRICE','MEDECIN','ADMIN')")
    public Object chat(@RequestBody ChatRequest request) {
        return chatService.chat(request);
    }
}
