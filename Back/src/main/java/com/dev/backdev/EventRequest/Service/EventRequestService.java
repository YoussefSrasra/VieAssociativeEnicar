package com.dev.backdev.EventRequest.Service;

import com.dev.backdev.EventRequest.DTO.EventRequestDTO;
import com.dev.backdev.EventRequest.Model.EventRequest;
import com.dev.backdev.EventRequest.Model.EventRequest.RequestStatus;
import com.dev.backdev.EventRequest.Repository.EventRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventRequestService {

    @Autowired
    private EventRequestRepository eventRequestRepository;

    public EventRequest createEventRequest(EventRequest eventRequest) {
        return eventRequestRepository.save(eventRequest);
    }

    public List<EventRequest> getAllEventRequests() {
        return eventRequestRepository.findAll();
    }

    public Optional<EventRequest> getEventRequestById(Long id) {
        return eventRequestRepository.findById(id);
    }

    public List<EventRequest> getEventRequestsByClubId(Long clubId) {
        return eventRequestRepository.findByClubId(clubId);
    }

    public List<EventRequestDTO> getAcceptedEventsByClubId(Long clubId){
        RequestStatus status = RequestStatus.APPROVED;
        List<EventRequest> approvedEvents = eventRequestRepository.findByClubIdAndStatus(clubId,status );
        return approvedEvents.stream()
            .map(eventRequest -> {
                EventRequestDTO dto = new EventRequestDTO();
                // Map all necessary fields from entity to DTO
                dto.setId(eventRequest.getId());
                dto.setType(eventRequest.getType());
                dto.setClubName(eventRequest.getClub().getName());
                dto.setNom(eventRequest.getEventName());
                dto.setDescription(eventRequest.getDescription());
                dto.setStartDate(eventRequest.getStartDate());
                dto.setEndDate(eventRequest.getEndDate());
                dto.setLocation(eventRequest.getLocation());
                // Include any other relevant fields
                return dto;
            })
            .collect(Collectors.toList());
    }

    public EventRequest updateEventRequest(Long id, EventRequest eventRequestDetails) {
        EventRequest eventRequest = eventRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EventRequest not found with id: " + id));
        
        eventRequest.setEventName(eventRequestDetails.getEventName());
        eventRequest.setType(eventRequestDetails.getType());
        eventRequest.setStartDate(eventRequestDetails.getStartDate());
        eventRequest.setEndDate(eventRequestDetails.getEndDate());
        eventRequest.setLocation(eventRequestDetails.getLocation());
        eventRequest.setDescription(eventRequestDetails.getDescription());
        eventRequest.setEstimatedAttendees(eventRequestDetails.getEstimatedAttendees());
        eventRequest.setFinancialRequest(eventRequestDetails.getFinancialRequest());
        eventRequest.setRequestedAmount(eventRequestDetails.getRequestedAmount());
        eventRequest.setUpdatedAt(LocalDateTime.now());
        
        return eventRequestRepository.save(eventRequest);
    }

    public EventRequest approveEventRequest(Long id) {
        EventRequest eventRequest = eventRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EventRequest not found with id: " + id));
        
        eventRequest.setStatus(EventRequest.RequestStatus.APPROVED);
        eventRequest.setUpdatedAt(LocalDateTime.now());
        return eventRequestRepository.save(eventRequest);
    }

    public EventRequest rejectEventRequest(Long id) {
        EventRequest eventRequest = eventRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EventRequest not found with id: " + id));
        
        eventRequest.setStatus(EventRequest.RequestStatus.REJECTED);
        eventRequest.setUpdatedAt(LocalDateTime.now());
        return eventRequestRepository.save(eventRequest);
    }

    public void deleteEventRequest(Long id) {
        eventRequestRepository.deleteById(id);
    }
    public EventRequest saveEventRequest(EventRequest eventRequest) {
        return eventRequestRepository.save(eventRequest);
    }
   
    public List<Map<String, Object>> getAllEventRequestsForDisplay() {
        return eventRequestRepository.findAllForDisplay();
    }
    
    public List<Map<String, Object>> getAllEventRequestsWithClubNames() {
        return eventRequestRepository.findAllForDisplay(); // Utilise la requête JOIN existante
    }
    
// Dans EventRequestService.java
public List<String> getEventNamesByClubId(Long clubId) {
    return eventRequestRepository.findEventNamesByClubId(clubId);
}

}