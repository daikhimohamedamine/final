package com.digitalassethub.medical.api.ai;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "AI Assistant")
@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {
    private final AiRecommendationService service;

    @PostMapping("/recommend")
    @PreAuthorize("hasRole('DOCTOR')")
    public Object recommend(@Valid @RequestBody AiRecommendRequest request) {
        return service.recommend(request);
    }
}
