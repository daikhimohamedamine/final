package com.digitalassethub.medical.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class MedicalApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedicalApiApplication.class, args);
    }
}
