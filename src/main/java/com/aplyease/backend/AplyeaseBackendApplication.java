package com.aplyease.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.aplyease.backend.model")
@EnableJpaRepositories("com.aplyease.backend.repository")
public class AplyeaseBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(AplyeaseBackendApplication.class, args);
	}

}