package com.dev.backdev.lancerEvenement.service;

import com.dev.backdev.lancerEvenement.model.Event;
import com.dev.backdev.lancerEvenement.repository.EventRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findUpcomingEvents(LocalDateTime.now());
    }


    public Event getLatestEvent() {
        return eventRepository.findFirstByOrderByCreatedAtDesc();
    }
    
}