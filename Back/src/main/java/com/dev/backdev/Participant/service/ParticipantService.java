package com.dev.backdev.Participant.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.backdev.Participant.model.Participant;
import com.dev.backdev.Participant.repository.ParticipantRepository;

@Service
@Transactional
public class ParticipantService {

    private final ParticipantRepository participantRepository;

    public ParticipantService(ParticipantRepository participantRepository) {
        this.participantRepository = participantRepository;
    }

    public Participant saveParticipant(Participant participant) {
        participant.setCreatedAt(LocalDateTime.now());
        return participantRepository.save(participant);
    }

    @Transactional(readOnly = true)
    public List<Participant> getAllParticipants() {
        return participantRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Participant> getParticipantsByEvent(String eventName) {
        return participantRepository.findByEventName(eventName);
    }

    @Transactional(readOnly = true)
    public List<Participant> getParticipantsByComite(String comite) {
        return participantRepository.findByComite(comite);
    }

    public void deleteParticipant(Long id) {
        participantRepository.deleteById(id);
    }
public List<Participant> findByEventName(String eventName) {
    return participantRepository.findByEventName(eventName);
}
/* 
public void approveParticipant(Long id) {
    Participant participant = participantRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Participant non trouvé avec l'id: " + id));
    
    participant.setStatus("APPROVED");
    participantRepository.save(participant);
}

public void rejectParticipant(Long id) {
    Participant participant = participantRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Participant non trouvé avec l'id: " + id));
    
    participant.setStatus("REJECTED");
    participantRepository.save(participant);
}
*/
public void approveParticipant(Long id) {
    Participant participant = participantRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Participant non trouvé"));
    participant.setStatus("APPROVED");
    participantRepository.save(participant);
}

public void rejectParticipant(Long id) {
    Participant participant = participantRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Participant non trouvé"));
    participant.setStatus("REJECTED");
    participantRepository.save(participant);
}

public List<String> getDistinctEventNames() {
    return participantRepository.findDistinctEventNames();
}
}