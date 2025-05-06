package com.dev.backdev.lancerEvenement.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backdev.lancerEvenement.model.Event;
import com.dev.backdev.lancerEvenement.service.EventService;

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

  
    @GetMapping("/latest")
public Event getLatestEvent() {
    return eventService.getLatestEvent();
}
@GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }
}