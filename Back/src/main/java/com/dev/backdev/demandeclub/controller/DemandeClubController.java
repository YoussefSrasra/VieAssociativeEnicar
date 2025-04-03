package com.dev.backdev.demandeClub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dev.backdev.demandeClub.model.DemandeClub;
import com.dev.backdev.demandeClub.service.DemandeClubService;

import java.util.List;

@RestController
@RequestMapping("/api/demandes")
public class DemandeClubController {

    @Autowired
    private DemandeClubService demandeClubService;

    @GetMapping
    public List<DemandeClub> getAllDemandes() {
        return demandeClubService.getAllDemandes();
    }

    @PostMapping
    public ResponseEntity<DemandeClub> createDemande(@RequestBody DemandeClub demande) {
        return ResponseEntity.ok(demandeClubService.createDemande(demande));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDemande(@PathVariable Long id) {
        demandeClubService.deleteDemande(id);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/{id}/approve")
    public ResponseEntity<DemandeClub> approveDemande(@PathVariable Long id) {
        return ResponseEntity.ok(demandeClubService.updateDemandeState(id, "ACCEPTE"));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<DemandeClub> rejectDemande(@PathVariable Long id) {
        return ResponseEntity.ok(demandeClubService.updateDemandeState(id, "REJETE"));
    }
}
