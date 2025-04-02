package com.dev.backdev.demandeClub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backdev.demandeClub.model.DemandeClub;
import com.dev.backdev.demandeClub.repository.DemandeClubRepository;

import java.util.List;


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
}
