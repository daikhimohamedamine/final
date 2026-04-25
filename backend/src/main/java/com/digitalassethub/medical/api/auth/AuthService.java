package com.digitalassethub.medical.api.auth;

import com.digitalassethub.medical.api.security.JwtService;
import com.digitalassethub.medical.api.user.UserEntity;
import com.digitalassethub.medical.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        UserEntity user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        return new LoginResponse(
                jwtService.generateAccessToken(user.getEmail(), user.getRole().name()),
                jwtService.generateRefreshToken(user.getEmail()),
                user.getRole().name(),
                user.getNom(),
                user.getPrenom()
        );
    }
}
