package com.dev.backdev.lancerEvenement.controller;

import com.dev.backdev.lancerEvenement.model.Event;
import com.dev.backdev.lancerEvenement.service.EventService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/even")
public class EventLaunchController {
    private final EventService eventService;

    public EventLaunchController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventService.createEvent(event);
    }

    @GetMapping("/upcoming")
    public List<Event> getUpcomingEvents() {
        return eventService.getUpcomingEvents();
    }

  
    // Autres endpoints...
    @GetMapping("/latest")
public Event getLatestEvent() {
    return eventService.getLatestEvent();
}
}