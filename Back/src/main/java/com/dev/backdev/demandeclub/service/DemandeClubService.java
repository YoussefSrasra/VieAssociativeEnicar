
package com.dev.backdev.demandeclub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.dev.backdev.demandeclub.model.demandeclub;
import com.dev.backdev.demandeclub.model.Etat; // Import ajouté
import com.dev.backdev.demandeclub.repository.DemandeClubRepository;
import java.util.List;
import java.util.Arrays;

@Service
public class DemandeClubService {

    @Autowired
    private DemandeClubRepository DemandeClubRepository;

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
            // Utilisation directe de l'enum Etat
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