package com.digitalassethub.medical.api.ai.medassist;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenRouterProperties {
    @Value("${openrouter.base-url}")
    private String baseUrl;

    @Value("${openrouter.api-key}")
    private String apiKey;

    @Value("${openrouter.model}")
    private String model;

    @Value("${openrouter.http-referer}")
    private String httpReferer;

    @Value("${openrouter.app-title}")
    private String appTitle;

    @Value("${openrouter.max-tokens}")
    private int maxTokens;

    public String getBaseUrl() { return baseUrl; }
    public String getApiKey() { return apiKey; }
    public String getModel() { return model; }
    public String getHttpReferer() { return httpReferer; }
    public String getAppTitle() { return appTitle; }
    public int getMaxTokens() { return maxTokens; }
    public boolean isConfigured() { return apiKey != null && !apiKey.isBlank(); }
}
