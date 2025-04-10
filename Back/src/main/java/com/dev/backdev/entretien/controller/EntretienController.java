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

    @Autowired
    public EntretienController(EntretienService entretienService) {
        this.entretienService = entretienService;
    }

    @GetMapping
    public List<Entretien> getAllEntretiens() {
        return entretienService.getAllEntretiens();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Entretien> getEntretienById(@PathVariable Long id) {
        Entretien entretien = entretienService.getEntretienById(id);
        if (entretien != null) {
            return ResponseEntity.ok(entretien);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Entretien createEntretien(@RequestBody Entretien entretien) {
        return entretienService.saveEntretien(entretien);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Entretien> updateEntretien(@PathVariable Long id, @RequestBody Entretien entretienDetails) {
        Entretien updatedEntretien = entretienService.updateEntretien(id, entretienDetails);
        if (updatedEntretien != null) {
            return ResponseEntity.ok(updatedEntretien);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntretien(@PathVariable Long id) {
        entretienService.deleteEntretien(id);
        return ResponseEntity.noContent().build();
    }
}