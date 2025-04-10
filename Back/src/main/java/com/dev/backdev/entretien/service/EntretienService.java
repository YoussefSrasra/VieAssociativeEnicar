package com.dev.backdev.entretien.service;

import com.dev.backdev.entretien.model.Entretien;
import com.dev.backdev.entretien.repository.EntretienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EntretienService {

    private final EntretienRepository entretienRepository;

    @Autowired
    public EntretienService(EntretienRepository entretienRepository) {
        this.entretienRepository = entretienRepository;
    }

    public List<Entretien> getAllEntretiens() {
        return entretienRepository.findAll();
    }

    public Entretien getEntretienById(Long id) {
        return entretienRepository.findById(id).orElse(null);
    }

    public Entretien saveEntretien(Entretien entretien) {
        return entretienRepository.save(entretien);
    }

    public void deleteEntretien(Long id) {
        entretienRepository.deleteById(id);
    }

    public Entretien updateEntretien(Long id, Entretien entretienDetails) {
        Entretien entretien = entretienRepository.findById(id).orElse(null);
        if (entretien != null) {
            entretien.setEnrollment(entretienDetails.getEnrollment());
            entretien.setDateEntretien(entretienDetails.getDateEntretien());
            entretien.setHeureEntretien(entretienDetails.getHeureEntretien());
            entretien.setStatut(entretienDetails.getStatut());
            entretien.setConfirmation(entretienDetails.isConfirmation());
            entretien.setResultat(entretienDetails.getResultat());
            return entretienRepository.save(entretien);
        }
        return null;
    }
}