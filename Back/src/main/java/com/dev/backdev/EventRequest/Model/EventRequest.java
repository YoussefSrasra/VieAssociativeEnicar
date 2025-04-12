package com.dev.backdev.EventRequest.Model;

import com.dev.backdev.Club.Model.Club;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class EventRequest {

    public enum EventType {
        CONFERENCE, WORKSHOP, SEMINAR, COMPETITION, SOCIAL_EVENT
    }

    public enum RequestStatus {
        PENDING, APPROVED, REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    private String eventName;
    
    @Enumerated(EnumType.STRING)
    private EventType type;
    
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String location;
    private String description;
    private Integer estimatedAttendees;
    private Boolean financialRequest = false;
    private Double requestedAmount;
    private boolean needEquipment;

    @Column(columnDefinition = "TEXT")
    private String equipmentDescription;
    
   

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}