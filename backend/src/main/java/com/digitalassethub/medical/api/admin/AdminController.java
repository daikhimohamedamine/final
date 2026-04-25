package com.digitalassethub.medical.api.admin;

import com.digitalassethub.medical.api.admin.importing.DrugCsvImportService;
import com.digitalassethub.medical.api.audit.AuditLogEntity;
import com.digitalassethub.medical.api.audit.AuditLogRepository;
import com.digitalassethub.medical.api.user.UserEntity;
import com.digitalassethub.medical.api.user.UserRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Administration")
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogRepository auditLogRepository;
    private final DrugCsvImportService drugCsvImportService;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserEntity> users() {
        return userRepository.findAll();
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public UserEntity createUser(@RequestBody UserEntity user) {
        user.setId(null);
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepository.save(user);
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserEntity updateUser(@PathVariable Long id, @RequestBody UserEntity payload) {
        UserEntity user = userRepository.findById(id).orElseThrow();
        user.setNom(payload.getNom());
        user.setPrenom(payload.getPrenom());
        user.setRole(payload.getRole());
        user.setEnabled(payload.isEnabled());
        if (payload.getPasswordHash() != null && !payload.getPasswordHash().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(payload.getPasswordHash()));
        }
        return userRepository.save(user);
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserEntity disableUser(@PathVariable Long id) {
        UserEntity user = userRepository.findById(id).orElseThrow();
        user.setEnabled(false);
        return userRepository.save(user);
    }

    @GetMapping("/audit-logs")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AuditLogEntity> auditLogs() {
        return auditLogRepository.findAll();
    }

    @PostMapping("/drugs/import")
    @PreAuthorize("hasRole('ADMIN')")
    public DrugCsvImportService.ImportResult importDrugs(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "false") boolean clearBefore
    ) throws IOException {
        return drugCsvImportService.importCsv(file.getInputStream(), clearBefore);
    }
}
