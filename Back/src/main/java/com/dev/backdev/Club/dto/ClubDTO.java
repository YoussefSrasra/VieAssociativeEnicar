package com.dev.backdev.Club.dto;


import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import com.dev.backdev.Club.Model.Club;
import com.dev.backdev.Club.Model.Club.ClubStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClubDTO {
    private Long id;
    private String name;
    private String specialty;
    private ClubStatus status;  // Utilisation de l'enum plutôt que String
    private String logo;
    private boolean enrollmentOpen;
    private String responsibleMemberUsername;  // Plus explicite
    private List<String> memberUsernames;     // Plus explicite
    private LocalDate mandatStartDate;
    private Integer mandatDurationMonths;
    

    // Constructeur à partir de l'entité Club
    public ClubDTO(Club club) {
        this.id = club.getId();
        this.name = club.getName();
        this.specialty = club.getSpecialty();
        this.status = club.getStatus();
        this.logo = club.getLogo();
        this.enrollmentOpen = club.isEnrollmentOpen();
        
        this.responsibleMemberUsername = club.getResponsibleMember() != null 
            ? club.getResponsibleMember().getUsername() 
            : null;
            
        this.memberUsernames = club.getMemberships().stream()
            .map(membership -> membership.getUser().getUsername())
            .collect(Collectors.toList());
        
        this.mandatStartDate = club.getMandatStartDate();
        this.mandatDurationMonths = club.getMandatDurationMonths();
    }
}