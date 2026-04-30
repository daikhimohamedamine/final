package com.digitalassethub.medical.api.ai;

import com.digitalassethub.medical.api.ai.medassist.MedAssistEngine;
import com.digitalassethub.medical.api.security.SecurityUser;
import com.digitalassethub.medical.api.user.UserEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Public entry point for the chat endpoint. Delegates to {@link MedAssistEngine},
 * the agentic Nemotron-on-OpenRouter loop with manual tool calling.
 */
@Service
public class AiChatService {
    private static final Logger log = LoggerFactory.getLogger(AiChatService.class);

    private final MedAssistEngine engine;

    public AiChatService(MedAssistEngine engine) {
        this.engine = engine;
    }

    public Map<String, Object> chat(ChatRequest request) {
        UserEntity user = currentUser();
        if (user == null) {
            return Map.of("response", "Authentification requise.", "error", true);
        }

        String message = request.getMessage() == null ? "" : request.getMessage().trim();
        if (message.isEmpty()) {
            return Map.of("response", "Veuillez fournir un message.", "error", true);
        }

        try {
            MedAssistEngine.Reply reply = engine.chat(
                    user, message, request.getSessionId(), request.getHistory()
            );
            Map<String, Object> out = new LinkedHashMap<>();
            out.put("response", reply.response());
            if (reply.thinking() != null) out.put("thinking", reply.thinking());
            if (reply.toolCalls() != null && !reply.toolCalls().isEmpty()) {
                out.put("toolCalls", reply.toolCalls());
            }
            if (reply.error()) out.put("error", true);
            return out;
        } catch (Exception ex) {
            log.error("AI chat error", ex);
            return Map.of("response", "Erreur technique IA : " + ex.getMessage(), "error", true);
        }
    }

    private UserEntity currentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        Object principal = auth.getPrincipal();
        if (principal instanceof SecurityUser su) return su.user();
        return null;
    }
}
