package com.dev.backdev.demandeclub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dev.backdev.demandeclub.model.demandeclub;
import com.dev.backdev.demandeclub.service.DemandeClubService;

import java.util.List;

@RestController
@RequestMapping("/api/demandes")
public class DemandeClubController {

    @Autowired
    private DemandeClubService demandeClubService;

    @GetMapping
    public List<demandeclub> getAllDemandes() {
        return demandeClubService.getAllDemandes();
    }

    @PostMapping
    public ResponseEntity<demandeclub> createDemande(@RequestBody demandeclub demande) {
        return ResponseEntity.ok(demandeClubService.createDemande(demande));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDemande(@PathVariable Long id) {
        demandeClubService.deleteDemande(id);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/{id}/approve")
    public ResponseEntity<demandeclub> approveDemande(@PathVariable Long id) {
        return ResponseEntity.ok(demandeClubService.updateDemandeState(id, "ACCEPTE"));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<demandeclub> rejectDemande(@PathVariable Long id) {
        return ResponseEntity.ok(demandeClubService.updateDemandeState(id, "REJETE"));
    }
}
