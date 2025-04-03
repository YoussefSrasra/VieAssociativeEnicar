package com.dev.backdev.Auth.dto;

public class UserRegistrationDTO {
    private String username;
    private String password;
    private String email;
    private String role;
    private ClubSimpleDto club; // Only needs club name


    // Getters and setters
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    } 
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public ClubSimpleDto getClub() {
        return club;
    }
    public void setClub(ClubSimpleDto club) {
        this.club = club;
    }        
}