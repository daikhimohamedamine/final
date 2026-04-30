package com.digitalassethub.medical.api.ai.medassist;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Thin OpenAI-compatible client for OpenRouter.
 * Used to drive the Nemotron reasoning model.
 *
 * NOTE: Nemotron reasoning models do NOT support native tool/function calling.
 * Tool use is implemented manually via JSON-fenced blocks in the system prompt.
 * See {@link MedAssistEngine}.
 */
@Component
public class OpenRouterClient {
    private static final Logger log = LoggerFactory.getLogger(OpenRouterClient.class);

    private final OpenRouterProperties props;
    private final ObjectMapper mapper = new ObjectMapper();

    public OpenRouterClient(OpenRouterProperties props) {
        this.props = props;
    }

    /**
     * Single-shot chat completion. Returns the assistant message content
     * (with `<think>` blocks still in place — caller is responsible for stripping).
     */
    public ChatCompletionResult complete(List<Map<String, Object>> messages) {
        return complete(messages, props.getMaxTokens(), 0.6);
    }

    public ChatCompletionResult complete(List<Map<String, Object>> messages, int maxTokens, double temperature) {
        if (!props.isConfigured()) {
            throw new IllegalStateException("OPENROUTER_API_KEY is not configured");
        }

        Map<String, Object> body = new HashMap<>();
        body.put("model", props.getModel());
        body.put("messages", messages);
        body.put("max_tokens", maxTokens);
        body.put("temperature", temperature);
        body.put("stream", false);

        String baseUrl = props.getBaseUrl().endsWith("/")
                ? props.getBaseUrl().substring(0, props.getBaseUrl().length() - 1)
                : props.getBaseUrl();

        Map<?, ?> response = WebClient.builder()
                .baseUrl(baseUrl)
                .build()
                .post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + props.getApiKey())
                .header("HTTP-Referer", props.getHttpReferer())
                .header("X-Title", props.getAppTitle())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .onStatus(s -> s.isError(), resp -> resp.bodyToMono(String.class)
                        .map(s -> new RuntimeException("OpenRouter error: " + s)))
                .bodyToMono(Map.class)
                .block();

        if (response == null) {
            throw new RuntimeException("OpenRouter returned an empty response");
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        if (choices == null || choices.isEmpty()) {
            throw new RuntimeException("OpenRouter response had no choices: " + response);
        }
        @SuppressWarnings("unchecked")
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        Object contentObj = message != null ? message.get("content") : null;
        String content = contentObj == null ? "" : contentObj.toString();

        // Some reasoning models also return a separate "reasoning" field
        Object reasoningObj = message != null ? message.get("reasoning") : null;
        String reasoning = reasoningObj == null ? null : reasoningObj.toString();

        Usage usage = new Usage(0, 0, 0);
        Object usageObj = response.get("usage");
        if (usageObj instanceof Map<?, ?> u) {
            int prompt = toInt(u.get("prompt_tokens"));
            int completion = toInt(u.get("completion_tokens"));
            int reasoningTokens = toInt(u.get("reasoning_tokens"));
            usage = new Usage(prompt, completion, reasoningTokens);
        }

        return new ChatCompletionResult(content, reasoning, usage);
    }

    private static int toInt(Object o) {
        if (o instanceof Number n) return n.intValue();
        if (o instanceof String s) {
            try { return Integer.parseInt(s); } catch (Exception ignored) {}
        }
        return 0;
    }

    public record ChatCompletionResult(String content, String reasoning, Usage usage) {}

    public record Usage(int promptTokens, int completionTokens, int reasoningTokens) {}
}
