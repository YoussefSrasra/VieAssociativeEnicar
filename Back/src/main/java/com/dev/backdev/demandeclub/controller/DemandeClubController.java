package com.dev.backdev.demandeclub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backdev.Club.dto.ClubDTO;
import com.dev.backdev.demandeclub.model.demandeclub;
import com.dev.backdev.demandeclub.service.DemandeClubService;

import lombok.extern.slf4j.Slf4j;
@Slf4j

@RestController
@RequestMapping("/api/demandes")
public class DemandeClubController {

    @Autowired
    private DemandeClubService demandeClubService;

    @GetMapping
    public List<demandeclub> getAllDemandes() {
        log.info("Fetching all demandes");

        return demandeClubService.getAllDemandes();
    }

    @PostMapping
    public ResponseEntity<demandeclub> createDemande(@RequestBody demandeclub demande) {
        log.info("Creating new demande: {}", demande);

        return ResponseEntity.ok(demandeClubService.createDemande(demande));
    }

    @PostMapping("/creer/{demandeid}")
    public ResponseEntity<ClubDTO> creerDepuisDemande(@PathVariable Long demandeid) {
        log.info("Creating club from demande ID: {}", demandeid);

        ClubDTO clubCree = demandeClubService.accepterDemandeEtCreerClub(demandeid);
        return ResponseEntity.ok(clubCree);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDemande(@PathVariable Long id) {
        log.warn("Deleting demande ID: {}", id);

        demandeClubService.deleteDemande(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<demandeclub> approveDemande(@PathVariable Long id) {
        log.info("Approving demande ID: {}", id);

        return ResponseEntity.ok(demandeClubService.updateDemandeState(id, "ACCEPTE"));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<demandeclub> rejectDemande(@PathVariable Long id) {
        log.info("Rejecting demande ID: {}", id);

        return ResponseEntity.ok(demandeClubService.updateDemandeState(id, "REJETE"));
    }

}
