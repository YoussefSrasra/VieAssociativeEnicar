package com.dev.backdev.Auth.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backdev.Auth.dto.ProfileCompletionDTO;
import com.dev.backdev.Auth.dto.UserRegistrationDTO;
import com.dev.backdev.Auth.dto.UserResponseDto;
import com.dev.backdev.Auth.dto.UserUpdateDTO;
import com.dev.backdev.Auth.model.User;
import com.dev.backdev.Auth.repository.UserRepository;
import com.dev.backdev.Auth.service.AuthService;
import com.dev.backdev.Auth.util.JwtUtil;
import com.dev.backdev.Club.Model.Club;
import com.dev.backdev.Enums.ClubRole;

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
    public ResponseEntity<UserResponseDto> registerUser(@RequestBody UserRegistrationDTO userDto) {
        User user = authService.registerUser(userDto);
        return ResponseEntity.ok(new UserResponseDto(user));
    }

    @PostMapping("/register/member")
    public ResponseEntity<UserResponseDto> createVisitorAccount(@PathVariable String nom,@PathVariable  String prenom,@PathVariable  String email, @RequestBody Club club, @PathVariable ClubRole role) {
        User user = authService.createVisitorAccount( nom,  prenom,  email, club, role);
        return ResponseEntity.ok(new UserResponseDto(user));
    }

    // Pour le switch compte membre -> manager
    @PostMapping("/switch-to-manager/{clubName}")
    public ResponseEntity<?> switchToManagerAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String clubName) {
        String token = authService.switchToManagerAccount(
            userDetails.getUsername(), 
            clubName
        );
        return ResponseEntity.ok(Map.of("token", token));
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

     @PostMapping("/complete-profile")
    public ResponseEntity<UserResponseDto> completeProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ProfileCompletionDTO dto) {
        User User = authService.completeProfile(userDetails.getUsername(), dto);
        UserResponseDto updateUser=new  UserResponseDto(User);
        return ResponseEntity.ok(updateUser);
    }

     @DeleteMapping("/delete-user/by-id/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            authService.deleteUser(userId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    @DeleteMapping("/delete-user/bu-username/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        try {
            authService.deleteUser(username);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

     @GetMapping("/users")
    public List<UserResponseDto> getAllUsers() {
        return authService.getAllUsers();
    }
// UserController.java
@GetMapping("/managers")
public List<UserResponseDto> getAllManagers() {
    return userRepository.findByRole("MANAGER")
        .stream()
        .map(UserResponseDto::new)
        .toList();
}


    @GetMapping("/users/by-role/{role}")
    public List<UserResponseDto> getUsersByRole(@PathVariable String role) {
        return authService.getUsersByRole(role);
    }

    @GetMapping("/users/by-club/{clubName}")
    public List<UserResponseDto> getUsersByClub(@PathVariable String clubName) {
        return authService.getUsersByClubName(clubName);
    }

    @GetMapping("/users/{username}")
    public ResponseEntity<UserResponseDto> getUserByUsername(@PathVariable String username) {
        Optional<UserResponseDto> user = authService.getUserByUsername(username);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/users/{username}")
    public ResponseEntity<UserResponseDto> updateUser(
        @PathVariable String username,
        @RequestBody UserUpdateDTO updateDTO
    ) 
    {
        UserResponseDto updatedUser = authService.updateUser(username, updateDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .map(user -> ResponseEntity.ok(new UserResponseDto(user)))
                .orElse(ResponseEntity.notFound().build());
    }

}