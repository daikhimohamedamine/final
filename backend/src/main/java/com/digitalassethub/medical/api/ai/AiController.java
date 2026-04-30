package com.digitalassethub.medical.api.ai;

import com.digitalassethub.medical.api.ai.medassist.MedAssistEngine;
import com.digitalassethub.medical.api.ai.medassist.MemoryManager;
import com.digitalassethub.medical.api.security.SecurityUser;
import com.digitalassethub.medical.api.user.UserEntity;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.Executors;

@Tag(name = "AI Assistant")
@RestController
@RequestMapping("/api/v1/ai")
public class AiController {
    private final AiRecommendationService recommendationService;
    private final AiChatService chatService;
    private final MedAssistEngine engine;
    private final MemoryManager memory;

    public AiController(AiRecommendationService recommendationService,
                        AiChatService chatService,
                        MedAssistEngine engine,
                        MemoryManager memory) {
        this.recommendationService = recommendationService;
        this.chatService = chatService;
        this.engine = engine;
        this.memory = memory;
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

    /**
     * Server-Sent Events stream of the agentic loop. Emits one event per
     * lifecycle stage so the UI can render progress: tool_call, tool_result,
     * thinking, response, done, error.
     *
     * Note: the underlying OpenRouter call is non-streaming; events are emitted
     * as the engine progresses through the agentic loop.
     */
    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @PreAuthorize("hasAnyRole('COORDINATRICE','MEDECIN','ADMIN')")
    public SseEmitter stream(@RequestBody ChatRequest request) {
        UserEntity user = currentUser();
        SseEmitter emitter = new SseEmitter(120_000L);
        if (user == null) {
            try { emitter.send(SseEmitter.event().name("error").data(Map.of("message", "Auth required"))); } catch (IOException ignored) {}
            emitter.complete();
            return emitter;
        }
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                MedAssistEngine.Reply reply = engine.chat(
                        user, request.getMessage(), request.getSessionId(), request.getHistory()
                );
                if (reply.toolCalls() != null) {
                    for (MedAssistEngine.ToolCallTrace t : reply.toolCalls()) {
                        emitter.send(SseEmitter.event().name("tool_call")
                                .data(Map.of("tool", t.tool(), "input", t.input())));
                        emitter.send(SseEmitter.event().name("tool_result")
                                .data(Map.of("tool", t.tool(),
                                        "success", t.result().success(),
                                        "data", t.result().data() == null ? Map.of() : t.result().data(),
                                        "error", t.result().error() == null ? "" : t.result().error())));
                    }
                }
                if (reply.thinking() != null) {
                    emitter.send(SseEmitter.event().name("thinking").data(Map.of("text", reply.thinking())));
                }
                emitter.send(SseEmitter.event().name("response").data(Map.of("text", reply.response())));
                emitter.send(SseEmitter.event().name("done").data(Map.of("ok", !reply.error())));
                emitter.complete();
            } catch (Exception ex) {
                try {
                    emitter.send(SseEmitter.event().name("error").data(Map.of("message", ex.getMessage())));
                } catch (IOException ignored) {}
                emitter.completeWithError(ex);
            }
        });
        return emitter;
    }

    @DeleteMapping("/sessions/{sessionId}")
    @PreAuthorize("hasAnyRole('COORDINATRICE','MEDECIN','ADMIN')")
    public ResponseEntity<Map<String, Object>> clearSession(@PathVariable String sessionId) {
        memory.clear(sessionId);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("ok", true);
        body.put("sessionId", sessionId);
        return ResponseEntity.ok(body);
    }

    private UserEntity currentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        Object principal = auth.getPrincipal();
        if (principal instanceof SecurityUser su) return su.user();
        return null;
    }
}
