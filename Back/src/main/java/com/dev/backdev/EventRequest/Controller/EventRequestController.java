package com.dev.backdev.EventRequest.Controller;

import com.dev.backdev.Club.Model.Club;
import com.dev.backdev.Club.Service.ClubService;
import com.dev.backdev.Club.dto.ClubDTO;
import com.dev.backdev.EventRequest.DTO.EventRequestDTO;
import com.dev.backdev.EventRequest.Model.EventRequest;
import com.dev.backdev.EventRequest.Repository.EventRequestRepository;
import com.dev.backdev.EventRequest.Service.EventRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/event-requests")
public class EventRequestController {

    @Autowired
    private EventRequestService eventRequestService;
    private EventRequestRepository eventRequestRepository ;
    @Autowired
    private ClubService clubService;
    @PostMapping
    public ResponseEntity<EventRequest> createEventRequest(@RequestBody EventRequest eventRequest) {
        // Vérifier que le club existe et récupérer son DTO
        Long clubId = eventRequest.getClub().getId();
    
        ClubDTO clubDTO = clubService.getClubById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found with id: " + clubId));
        
        // Vous pouvez directement associer le clubDTO à l'eventRequest si ClubDTO est suffisant.
        Club club = new Club();  // Créer une nouvelle instance si nécessaire ou récupérer via DTO
        club.setId(clubDTO.getId());
        // Si des propriétés supplémentaires existent dans ClubDTO, les transférer ici.
        
        // Associer le club trouvé à la demande d'événement
        eventRequest.setClub(club);
        
        // Créer la demande d'événement
        EventRequest createdRequest = eventRequestService.createEventRequest(eventRequest);
        return ResponseEntity.ok(createdRequest);


        
    }
    
    

    @GetMapping("/by-ids")
    public ResponseEntity<List<EventRequestDTO>> getEventsByIds(@RequestParam("ids") List<Long> eventIds) {
        List<EventRequestDTO> events = eventRequestService.getEventsByIds(eventIds);
        return ResponseEntity.ok(events);
    }




// Dans EventRequestController.java
@GetMapping("/club/{clubId}/event-names")
public ResponseEntity<List<String>> getEventNamesByClub(@PathVariable Long clubId) {
    List<String> eventNames = eventRequestService.getEventNamesByClubId(clubId);
    return ResponseEntity.ok(eventNames);
}







    @GetMapping("/{id}")
    public ResponseEntity<EventRequest> getEventRequestById(@PathVariable Long id) {
        return eventRequestService.getEventRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/club/{clubId}")
    public List<EventRequest> getEventRequestsByClub(@PathVariable Long clubId) {
        return eventRequestService.getEventRequestsByClubId(clubId);
    }

    @GetMapping("approved/club/{clubId}")
    public List<EventRequestDTO> getApprovedEventsByClub(@PathVariable Long clubId){
        return eventRequestService.getAcceptedEventsByClubId(clubId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventRequest> updateEventRequest(
            @PathVariable Long id, 
            @RequestBody EventRequest eventRequestDetails) {
        EventRequest updatedRequest = eventRequestService.updateEventRequest(id, eventRequestDetails);
        return ResponseEntity.ok(updatedRequest);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<EventRequest> approveEventRequest(@PathVariable Long id) {
        EventRequest approvedRequest = eventRequestService.approveEventRequest(id);
        return ResponseEntity.ok(approvedRequest);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<EventRequest> rejectEventRequest(@PathVariable Long id) {
        EventRequest rejectedRequest = eventRequestService.rejectEventRequest(id);
        return ResponseEntity.ok(rejectedRequest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEventRequest(@PathVariable Long id) {
        eventRequestService.deleteEventRequest(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllEventRequests() {
        return ResponseEntity.ok(eventRequestService.getAllEventRequestsWithClubNames());
    }
}