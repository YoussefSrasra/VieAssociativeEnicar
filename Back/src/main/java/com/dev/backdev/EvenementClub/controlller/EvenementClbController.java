package com.dev.backdev.EvenementClub.controlller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.dev.backdev.EvenementClub.model.EvenementClb;
import com.dev.backdev.EvenementClub.service.EvenementClbService;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EvenementClbController {

    @Autowired
    private EvenementClbService evenementClbService;

    @PostMapping("/create")
    public EvenementClb createEvent(@RequestBody EvenementClb evenementClb) {
        return evenementClbService.createEvent(evenementClb);
    }

    @GetMapping("/all")
    public List<EvenementClb> getAllEvents() {
        return evenementClbService.getAllEvents();
    }
}
