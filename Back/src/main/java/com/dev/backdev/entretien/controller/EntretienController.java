package com.dev.backdev.entretien.controller;

import com.dev.backdev.entretien.model.Entretien;
import com.dev.backdev.entretien.service.EntretienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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
}