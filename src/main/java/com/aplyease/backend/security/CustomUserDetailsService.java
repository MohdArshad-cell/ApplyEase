package com.aplyease.backend.security;

import com.aplyease.backend.model.User;
import com.aplyease.backend.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // This is the new, corrected logic.
        // It creates a new UserDetails object just for Spring Security.
        return new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            mapRolesToAuthorities(user) // We use our helper method to add the "ROLE_" prefix
        );
    }

    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(User user) {
        // This correctly uses the role name directly from the database (e.g., "ROLE_AGENT")
        return user.getRoles().stream()
                   .map(role -> new SimpleGrantedAuthority(role.getName()))
                   .collect(Collectors.toList());
    
    }
}