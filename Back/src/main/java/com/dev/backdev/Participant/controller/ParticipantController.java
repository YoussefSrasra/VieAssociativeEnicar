package com.dev.backdev.Participant.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backdev.Participant.model.Participant;
import com.dev.backdev.Participant.repository.ParticipantRepository;
import com.dev.backdev.Participant.service.ParticipantService;

@RestController
@RequestMapping("/api/participants")
@CrossOrigin(origins = "http://localhost:4200",methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.DELETE}) // Ajout pour CORS
public class ParticipantController {

    private final ParticipantService participantService;
    private final ParticipantRepository participantRepository;

    public ParticipantController(ParticipantService participantService, 
                               ParticipantRepository participantRepository) {
        this.participantService = participantService;
        this.participantRepository = participantRepository;
    }

    @PostMapping
    public ResponseEntity<Participant> createParticipant(@RequestBody Participant participant) {
        Participant savedParticipant = participantService.saveParticipant(participant);
        return new ResponseEntity<>(savedParticipant, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Participant>> getAllParticipants() {
        List<Participant> participants = participantService.getAllParticipants();
        return new ResponseEntity<>(participants, HttpStatus.OK);
    }

    @GetMapping("/event/{eventName}")
    public ResponseEntity<List<Participant>> getParticipantsByEventName(@PathVariable String eventName) {
        List<Participant> participants = participantService.getParticipantsByEvent(eventName);
        return new ResponseEntity<>(participants, HttpStatus.OK);
    }

    @GetMapping("/comite/{comite}")
    public ResponseEntity<List<Participant>> getParticipantsByComite(@PathVariable String comite) {
        List<Participant> participants = participantService.getParticipantsByComite(comite);
        return new ResponseEntity<>(participants, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParticipant(@PathVariable Long id) {
        participantService.deleteParticipant(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/stats")
    public ResponseEntity<List<ParticipantRepository.EventStatsProjection>> getEventStats() {
        List<ParticipantRepository.EventStatsProjection> stats = participantRepository.findEventStats();
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

    @PostMapping("/reminder/{eventName}")
    public ResponseEntity<Void> sendReminders(@PathVariable String eventName) {
        // Implémentation de l'envoi de rappel
        return ResponseEntity.ok().build();
    }
    // ParticipantController.java
@GetMapping("/by-event/{eventName}")
public ResponseEntity<List<Participant>> getParticipantsByEvent(
    @PathVariable String eventName) {
    
    List<Participant> participants = participantService.findByEventName(eventName);
    return ResponseEntity.ok(participants);
}
@PatchMapping("/{id}/approve")
public ResponseEntity<Void> approveParticipant(@PathVariable Long id) {
    participantService.approveParticipant(id);
    return ResponseEntity.ok().build();
}

@PatchMapping("/{id}/reject")
public ResponseEntity<Void> rejectParticipant(@PathVariable Long id) {
    participantService.rejectParticipant(id);
    return ResponseEntity.ok().build();
}
@GetMapping("/distinct-events")
public ResponseEntity<List<String>> getDistinctEventNames() {
    List<String> distinctEventNames = participantService.getDistinctEventNames();
    return new ResponseEntity<>(distinctEventNames, HttpStatus.OK);
}


@GetMapping("/search")
public ResponseEntity<List<Participant>> searchParticipants(
        @RequestParam String nom,
        @RequestParam String prenom) {
    List<Participant> result = participantRepository.findByNomAndPrenom(nom, prenom);
    if (result.isEmpty()) {
        return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(result);
}


}