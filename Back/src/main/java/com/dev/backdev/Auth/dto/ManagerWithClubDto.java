package com.dev.backdev.Auth.dto;

public class ManagerWithClubDto {
    private String username;
    private String email;
    private String clubName;
    private String clubStatus;
    
    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getClubName() { return clubName; }
    public void setClubName(String clubName) { this.clubName = clubName; }
    public String getClubStatus() { return clubStatus; }
    public void setClubStatus(String clubStatus) { this.clubStatus = clubStatus; }
}