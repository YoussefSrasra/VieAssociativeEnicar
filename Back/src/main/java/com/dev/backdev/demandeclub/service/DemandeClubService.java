
package com.dev.backdev.demandeclub.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backdev.Auth.service.AuthService;
import com.dev.backdev.Club.Model.Club;
import com.dev.backdev.Club.Model.Club.ClubStatus;
import com.dev.backdev.Club.Service.ClubService;
import com.dev.backdev.Club.dto.ClubDTO;
import com.dev.backdev.Email.EmailService;
import com.dev.backdev.Enums.ClubRole; 
import com.dev.backdev.demandeclub.model.Etat;
import com.dev.backdev.demandeclub.model.demandeclub;
import com.dev.backdev.demandeclub.repository.DemandeClubRepository;

@Service
public class DemandeClubService {

    @Autowired
    private DemandeClubRepository DemandeClubRepository;
    @Autowired
    private ClubService clubService;

    @Autowired
    private AuthService authService;
    @Autowired
    private  EmailService emailService;




    public ClubDTO accepterDemandeEtCreerClub(long demandeid) {
        demandeclub demande = DemandeClubRepository.findById(demandeid)
            .orElseThrow(() -> new RuntimeException("Demande non trouvée"));
        Club nouveauClub = new Club();
        nouveauClub.setName(demande.getNomClub());
        nouveauClub.setSpecialty(demande.getDescription());
        nouveauClub.setLogo(demande.getLogoBase64());
        nouveauClub.setStatus(ClubStatus.ACTIVE);

        Club clubCree = clubService.createClub(nouveauClub);
        emailService.sendClubCreationInfo(demande.getEmail(), demande.getNomClub());

        authService.createVisitorAccount(
            demande.getNom(),
            demande.getPrenom(),
            demande.getEmail(),
            clubCree, 
            ClubRole.PRESIDENT
        );

        DemandeClubRepository.delete(demande);
        ClubDTO clubDTO = new ClubDTO(clubCree);
        return clubDTO;
    }

    public List<demandeclub> getAllDemandes() {
        return DemandeClubRepository.findAll();
    }

    public demandeclub createDemande(demandeclub demande) {
        return DemandeClubRepository.save(demande);
    }

    public void deleteDemande(Long id) {
        DemandeClubRepository.deleteById(id);
    }

    public demandeclub updateDemandeState(Long id, String newState) {
        demandeclub demande = DemandeClubRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Demande non trouvée"));
        
        try {
            Etat etat = Etat.valueOf(newState.toUpperCase());
            demande.setEtat(etat);
            return DemandeClubRepository.save(demande);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(
                "État invalide: " + newState + 
                ". Les états valides sont: " + Arrays.toString(Etat.values())
            );
        }
    }
}