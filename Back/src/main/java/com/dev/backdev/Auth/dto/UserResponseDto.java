package com.dev.backdev.Auth.dto;

import com.dev.backdev.Auth.model.User;

public class UserResponseDto {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String clubName; // Only club name, not full object

    // Constructor from User entity
    public UserResponseDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.clubName = (user.getClub() != null) ? user.getClub().getName() : null;
    }
    public UserResponseDto(Long id, String username, String email, String role, String clubName) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.clubName = clubName;
    }

    // Getters only (no setters)
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getClubName() { return clubName; }
}
