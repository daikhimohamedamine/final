package com.digitalassethub.medical.api.document;

import com.digitalassethub.medical.api.security.SecurityUser;
import com.digitalassethub.medical.api.user.Role;
import com.digitalassethub.medical.api.user.UserEntity;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Tag(name = "Doctor Library")
@RestController
@RequestMapping("/api/v1/doctor-library")
public class DoctorLibraryController {

    private final DoctorLibraryDocumentRepository repository;
    private final Path root;

    public DoctorLibraryController(DoctorLibraryDocumentRepository repository, @Value("${app.upload.dir:uploads}") String uploadDir) {
        this.repository = repository;
        this.root = Paths.get(uploadDir).resolve("doctor_library");
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for doctor library!");
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MEDECIN','ADMIN')")
    public List<DoctorLibraryDocumentEntity> list(@RequestParam(required = false) String categorie) {
        UserEntity user = ((SecurityUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).user();
        if (user.getRole() == Role.ADMIN) {
            if (categorie != null && !categorie.isBlank()) {
                return repository.findByCategorieOrderByUploadedAtDesc(categorie);
            }
            return repository.findAllByOrderByUploadedAtDesc();
        }
        if (categorie != null && !categorie.isBlank()) {
            return repository.findByMedecinIdAndCategorieOrderByUploadedAtDesc(user.getId(), categorie);
        }
        return repository.findByMedecinIdOrderByUploadedAtDesc(user.getId());
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('MEDECIN','ADMIN')")
    public DoctorLibraryDocumentEntity upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("categorie") String categorie,
            @RequestParam(value = "description", required = false) String description) throws IOException {
        
        UserEntity user = ((SecurityUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).user();
        
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), this.root.resolve(filename));

        DoctorLibraryDocumentEntity doc = new DoctorLibraryDocumentEntity();
        doc.setMedecinId(user.getId());
        doc.setNomFichier(file.getOriginalFilename());
        doc.setCheminStockage(filename);
        doc.setTypeMime(file.getContentType());
        doc.setTaille(file.getSize());
        doc.setCategorie(categorie);
        doc.setDescription(description);

        return repository.save(doc);
    }

    @GetMapping("/download/{id}")
    @PreAuthorize("hasAnyRole('MEDECIN', 'ADMIN')")
    public ResponseEntity<Resource> download(@PathVariable Long id) throws IOException {
        DoctorLibraryDocumentEntity doc = repository.findById(id).orElseThrow();
        
        // Security check for doctors
        UserEntity user = ((SecurityUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).user();
        if (user.getRole() == Role.MEDECIN && !doc.getMedecinId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        Path path = root.resolve(doc.getCheminStockage());
        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getNomFichier() + "\"")
                .contentType(MediaType.parseMediaType(doc.getTypeMime()))
                .body(resource);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('MEDECIN','ADMIN')")
    public void delete(@PathVariable Long id) throws IOException {
        UserEntity user = ((SecurityUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).user();
        DoctorLibraryDocumentEntity doc = repository.findById(id).orElseThrow();
        
        if (user.getRole() == Role.MEDECIN && !doc.getMedecinId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized delete attempt");
        }

        Files.deleteIfExists(root.resolve(doc.getCheminStockage()));
        repository.delete(doc);
    }
}
