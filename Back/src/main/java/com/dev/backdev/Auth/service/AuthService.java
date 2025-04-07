package com.dev.backdev.Auth.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dev.backdev.Auth.dto.UserRegistrationDTO;
import com.dev.backdev.Auth.dto.UserResponseDto;
import com.dev.backdev.Auth.dto.UserUpdateDTO;
import com.dev.backdev.Auth.model.User;
import com.dev.backdev.Auth.repository.UserRepository;
import com.dev.backdev.Club.Model.Club;
import com.dev.backdev.Club.Repository.ClubRepository;
import com.dev.backdev.Email.EmailService;


@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ClubRepository clubRepository;
    private final EmailService emailService;


    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,ClubRepository clubRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.clubRepository = clubRepository;
        this.emailService = emailService;

    }

     public User registerUser(UserRegistrationDTO userDto) {
        // 1. Find the club by name
        Club club = clubRepository.findByName(userDto.getClub().getName())
            .orElseThrow(() -> new RuntimeException("Club not found"));

        // 2. Create and save the user
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());
        user.setRole(userDto.getRole());
        user.setNom(userDto.getNom());
        user.setPrenom(userDto.getPrenom());
        user.setCin(userDto.getCin());
        user.setFiliere(userDto.getFiliere());
        user.setNiveau(userDto.getNiveau());
        user.setSexe(userDto.getSexe());
        user.setFormation(userDto.getFormation());
        user.setPhoto(userDto.getPhoto());
        user.setClub(club); // Assign the fetched club

        emailService.sendCredentials(
            user.getEmail(),
            userDto.getUsername(),
            userDto.getPassword() // Raw password (will be sent via email)
        );

        return userRepository.save(user);
    }
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Handle club relationships if needed
        if (user.getResponsibleClub() != null) {
            throw new RuntimeException("Cannot delete a club manager. Reassign club first.");
        }
        
        userRepository.delete(user);
    }
    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Handle club relationships if needed
        if (user.getResponsibleClub() != null) {
            throw new RuntimeException("Cannot delete a club manager. Reassign club first.");
        }
        
        userRepository.delete(user);
    }

     public List<UserResponseDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
            .map(this::convertToUserResponseDTO)
            .collect(Collectors.toList());
    }

    // 2. Get users by role
    public List<UserResponseDto> getUsersByRole(String role) {
        List<User> users = userRepository.findByRole(role);
        return users.stream()
            .map(this::convertToUserResponseDTO)
            .collect(Collectors.toList());
    }

    // 3. Get users by club name
    public List<UserResponseDto> getUsersByClubName(String clubName) {
        List<User> users = userRepository.findByClub_Name(clubName);
        return users.stream()
            .map(this::convertToUserResponseDTO)
            .collect(Collectors.toList());
    }

    // 4. Get user by username
    public Optional<UserResponseDto> getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .map(this::convertToUserResponseDTO);
    }

    private UserResponseDto convertToUserResponseDTO(User user) {
        String clubName = (user.getClub() != null) ? user.getClub().getName() : null;
        
        return new UserResponseDto(user);
    }

    public UserResponseDto updateUser(String username, UserUpdateDTO updateDTO) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Update fields (if provided in DTO)
        if (updateDTO.getEmail() != null) user.setEmail(updateDTO.getEmail());
        if (updateDTO.getRole() != null) user.setRole(updateDTO.getRole());

        // Update club (if provided)
        if (updateDTO.getClubName() != null) {
            Club club = clubRepository.findByName(updateDTO.getClubName())
                .orElseThrow(() -> new RuntimeException("Club not found"));
            user.setClub(club);
        }

        User savedUser = userRepository.save(user);
        return new UserResponseDto(savedUser); // Converts to DTO
    }
}