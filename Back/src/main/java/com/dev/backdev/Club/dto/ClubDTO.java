package com.dev.backdev.Club.dto;

import java.util.List;

public class ClubDTO {
    private Long id;
    private String name;
    private String specialty;
    private String status;
    private String logo;
    private String responsibleMember; // Only the username
    private List<String> members; // List of usernames

    public ClubDTO(Long id, String name, String specialty, String status, String logo, String responsibleMember, List<String> members) {
        this.id = id;
        this.name = name;
        this.specialty = specialty;
        this.status = status;
        this.logo = logo;
        this.responsibleMember = responsibleMember;
        this.members = members;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResponsibleMember() {
        return responsibleMember;
    }

    public void setResponsibleMember(String responsibleMember) {
        this.responsibleMember = responsibleMember;
    }

    public List<String> getMembers() {
        return members;
    }

    public void setMembers(List<String> members) {
        this.members = members;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }
}
