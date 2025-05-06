package com.dev.backdev.entretien.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backdev.Auth.dto.UserResponseDto;
import com.dev.backdev.Auth.service.AuthService;
import com.dev.backdev.Club.Model.Club;
import com.dev.backdev.Club.Service.ClubService;
import com.dev.backdev.Club.dto.ClubDTO;
import com.dev.backdev.Enums.ClubRole;
import com.dev.backdev.enrollment.model.Enrollment;
import com.dev.backdev.entretien.model.Entretien;
import com.dev.backdev.entretien.model.ResultatEntretien;
import com.dev.backdev.entretien.model.StatutEntretien;
import com.dev.backdev.entretien.repository.EntretienRepository;

@Service
public class EntretienService {

    private final EntretienRepository entretienRepository;
    @Autowired
    private AuthService authService;
    @Autowired
    private ClubService clubService;


    @Autowired
    public EntretienService(EntretienRepository entretienRepository) {
        this.entretienRepository = entretienRepository;
    }

    public List<Entretien> getAllEntretiens() {
        return entretienRepository.findAll();
    }

    public Optional<Entretien> getEntretienById(Long id) {
        return entretienRepository.findById(id);
    }

    public Entretien saveEntretien(Entretien entretien) {
        return entretienRepository.save(entretien);
    }

    public void deleteEntretien(Long id) {
        entretienRepository.deleteById(id);
    }

    public boolean existsByEnrollment(Enrollment enrollment) {
        return entretienRepository.existsByEnrollment(enrollment);
    }

    public Optional<Entretien> findByEnrollment(Enrollment enrollment) {
        return entretienRepository.findByEnrollment(enrollment);
    }

    public Optional<Entretien> updateEntretien(Long id, Entretien entretienDetails) {
        return entretienRepository.findById(id)
                .map(entretien -> {
                    if (entretienDetails.getDateEntretien() != null) {
                        entretien.setDateEntretien(entretienDetails.getDateEntretien());
                    }
    
                    if (entretienDetails.getHeureEntretien() != null) {
                        entretien.setHeureEntretien(entretienDetails.getHeureEntretien());
                    }
                    if (entretienDetails.getStatut() != null) {
                        entretien.setStatut(entretienDetails.getStatut());
                    }
                    
    
                    entretien.setConfirmation(entretienDetails.isConfirmation());
    
                    if (entretienDetails.getResultat() != null) {
                        entretien.setResultat(entretienDetails.getResultat());
                        if (entretienDetails.getResultat() == ResultatEntretien.ACCEPTE ) {
                            if (authService.getUserByEmail(entretien.getEnrollment().getEmail()).isPresent()) {
                                UserResponseDto user = authService.getUserByEmail(entretien.getEnrollment().getEmail()).get();
                                Optional<ClubDTO> club = clubService.getClubById(entretien.getEnrollment().getClubId());
                                clubService.assignMemberToClub(club.get().getName(),user.getUsername());
                                entretien.setStatut(StatutEntretien.COMPTE);
                            }
                           
                        } 
                    }
    
                    return entretienRepository.save(entretien);
                }); 
    }
    
    public List<Entretien> getEntretiensByClubId(Long clubId) {
        return entretienRepository.findByClubId(clubId);
    }


       public void  creercompte (long entretiensId ) {

       
       Entretien entretien = entretienRepository.findById(entretiensId)
        .orElseThrow(() -> new RuntimeException("Demande non trouvée"));
      long clubid = entretien.getEnrollment().getClubId();
            Club cluba = clubService.getClubByIdWithoutDTO(clubid)
            .orElseThrow(() -> new RuntimeException("Club non trouvé"));

        
        authService.createVisitorAccount(
            entretien.getEnrollment().getNom(),
            entretien.getEnrollment().getPrenom(),
            entretien.getEnrollment().getEmail(),
            cluba,
            ClubRole.MEMBER
        );
        


      
}
public Optional<Long> getClubIdByEntretienId(Long entretienId) {
    return getEntretienById(entretienId)
            .map(entretien -> {
                if (entretien.getEnrollment() != null) {
                    return entretien.getEnrollment().getClubId();
                } else {
                    return null;
                }
            });
}

}