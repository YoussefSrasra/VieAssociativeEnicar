package com.dev.backdev.entretien.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backdev.entretien.model.Entretien;
import com.dev.backdev.entretien.service.EntretienService;


@RestController
@RequestMapping("/api/entretiens")
public class EntretienController {

    private final EntretienService entretienService;

    
    public EntretienController(EntretienService entretienService) {
        this.entretienService = entretienService;
    }

    @GetMapping
    public ResponseEntity<List<Entretien>> getAllEntretiens() {
        return ResponseEntity.ok(entretienService.getAllEntretiens());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEntretienById(@PathVariable Long id) {
        return entretienService.getEntretienById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Entretien> createEntretien(@RequestBody Entretien entretien) {
        return ResponseEntity.ok(entretienService.saveEntretien(entretien));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEntretien(@PathVariable Long id, @RequestBody Entretien entretienDetails) {
        return entretienService.updateEntretien(id, entretienDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntretien(@PathVariable Long id) {
        entretienService.deleteEntretien(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/club/{clubId}")
    public List<Entretien> getEntretiensByClub(@PathVariable Long clubId) {
        return entretienService.getEntretiensByClubId(clubId);
    }
    @PostMapping("/{id}/creer-compte")
    public ResponseEntity<String> creerComptePourEntretien(@PathVariable("id") Long entretienId) {
        entretienService.creercompte(entretienId);
        return ResponseEntity.ok("Compte créé avec succès");
    }
    @GetMapping("/{id}/club-id")
    public ResponseEntity<Long> getClubIdByEntretienId(@PathVariable("id") Long entretienId) {
        return entretienService.getClubIdByEntretienId(entretienId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}