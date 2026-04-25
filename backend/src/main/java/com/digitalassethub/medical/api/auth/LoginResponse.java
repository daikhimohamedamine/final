package com.digitalassethub.medical.api.auth;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        String role,
        String nom,
        String prenom
) {
}
