package com.aplyease.backend.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.aplyease.backend.model.Client;
import com.aplyease.backend.repository.ClientRepository;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ClientRepository clientRepository;

    @Autowired
    public DataInitializer(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if the clients table is empty before adding data
        if (clientRepository.count() == 0) {
            System.out.println("No clients found, creating sample data...");

            Client client1 = new Client();
            client1.setFirstName("Anudeep");
            client1.setLastName("Bathina");
            client1.setEmail("anudeep.b@example.com");

            Client client2 = new Client();
            client2.setFirstName("Priya");
            client2.setLastName("Sharma");
            client2.setEmail("priya.s@example.com");

            Client client3 = new Client();
            client3.setFirstName("Raj");
            client3.setLastName("Verma");
            client3.setEmail("raj.v@example.com");

            // Save all the new clients to the database
            clientRepository.saveAll(Arrays.asList(client1, client2, client3));

            System.out.println("Sample clients created.");
        } else {
            System.out.println("Database already contains clients. Skipping data initialization.");
        }
    }
}