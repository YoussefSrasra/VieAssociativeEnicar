package com.dev.backdev.EvenementClub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backdev.EvenementClub.model.EvenementClb;
import com.dev.backdev.EvenementClub.repository.EvenementClbRepository;

import java.util.List;

@Service
public class EvenementClbService {

    @Autowired
    private EvenementClbRepository evenementClbRepository;
    private final EvenementClbRepository repository;

    public EvenementClbService(EvenementClbRepository repository) {
        this.repository = repository;
    }
    public EvenementClb createEvent(EvenementClb evenementClb) {
        return evenementClbRepository.save(evenementClb);
    }

    public List<EvenementClb> getAllEvents() {
        return evenementClbRepository.findAll();
    }
    public EvenementClb getEventById(Long id) {
        return repository.findById(id).orElseThrow();
    }
}
