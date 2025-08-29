package com.aplyease.backend.service.impl;

import com.aplyease.backend.dto.ClientDto;
import com.aplyease.backend.dto.UserDto;
import com.aplyease.backend.model.User;
import com.aplyease.backend.repository.UserRepository;
import com.aplyease.backend.service.UserService;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
  
  
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
     
    }
    
    @Override
    public List<ClientDto> getAllClients() {
        // Fetch all users who have the 'ROLE_CLIENT'
        List<User> clients = userRepository.findByRoles_Name("ROLE_CLIENT");
        
        // Convert the list of User entities to a list of ClientDtos
        return clients.stream()
                      .map(this::convertToClientDto)
                      .collect(Collectors.toList());
    }

    private ClientDto convertToClientDto(User user) {
        ClientDto dto = new ClientDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        return dto;
    }
 // Inside your UserServiceImpl class

    @Override
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // You can create a private helper method to convert User to UserDto
        return convertToUserDto(user); 
    }

    private UserDto convertToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());
        userDto.setRoles(user.getRoles().stream()
                             .map(role -> role.getName())
                             .collect(Collectors.toSet()));
        return userDto;
    }
}