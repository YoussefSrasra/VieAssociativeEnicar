package com.dev.backdev.Auth.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backdev.Auth.model.User;
import com.dev.backdev.Auth.repository.UserRepository;
import com.dev.backdev.Auth.service.AuthService;
import com.dev.backdev.Auth.util.JwtUtil;

@RestController
@RequestMapping("/api/public")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthService authService, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }   

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return authService.registerUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> foundUser = userRepository.findByUsername(user.getUsername());

        if (foundUser.isPresent() && passwordEncoder.matches(user.getPassword(), foundUser.get().getPassword())) {
            // Générer le JWT
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(foundUser.get().getUsername())
                .password(foundUser.get().getPassword())
                .authorities("ROLE_" + foundUser.get().getRole()) // Add role as authority
                .build();

        String token = jwtUtil.generateToken(userDetails);
            return ResponseEntity.ok(Map.of("token", token, "role", foundUser.get().getRole()));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid username or password"));
        }
    }

}