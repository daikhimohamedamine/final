package com.digitalassethub.medical.api.audit;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {
    private final AuditLogRepository repository;
    private final HttpServletRequest request;

    @AfterReturning("@annotation(auditable)")
    public void log(JoinPoint joinPoint, Auditable auditable) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        AuditLogEntity log = new AuditLogEntity();
        log.setAction(auditable.action());
        log.setEntityType(auditable.entityType());
        log.setDetails(joinPoint.getSignature().toShortString());
        log.setIpAddress(request.getRemoteAddr());
        if (auth != null) {
            log.setUserId(null);
        }
        repository.save(log);
    }
}
