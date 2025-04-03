package com.dev.backdev.demandeClub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.dev.backdev.demandeClub.model.DemandeClub;
import com.dev.backdev.demandeClub.model.Etat; // Import ajouté
import com.dev.backdev.demandeClub.repository.DemandeClubRepository;
import java.util.List;
import java.util.Arrays;

@Service
public class DemandeClubService {

    @Autowired
    private DemandeClubRepository demandeClubRepository;

    public List<DemandeClub> getAllDemandes() {
        return demandeClubRepository.findAll();
    }

    public DemandeClub createDemande(DemandeClub demande) {
        return demandeClubRepository.save(demande);
    }

    public void deleteDemande(Long id) {
        demandeClubRepository.deleteById(id);
    }

    public DemandeClub updateDemandeState(Long id, String newState) {
        DemandeClub demande = demandeClubRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Demande non trouvée"));
        
        try {
            // Utilisation directe de l'enum Etat
            Etat etat = Etat.valueOf(newState.toUpperCase());
            demande.setEtat(etat);
            return demandeClubRepository.save(demande);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(
                "État invalide: " + newState + 
                ". Les états valides sont: " + Arrays.toString(Etat.values())
            );
        }
    }
}