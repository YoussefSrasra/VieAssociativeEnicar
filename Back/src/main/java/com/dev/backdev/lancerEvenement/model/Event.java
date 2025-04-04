package com.dev.backdev.lancerEvenement.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String eventName;
    
    @Column(nullable = false)
    private String eventType;
    
    @Column(nullable = false)
    private LocalDateTime startDate  ;
    
    @Column(nullable = false)
    private LocalDateTime endDate;
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    
    @ElementCollection
    private List<String> committees;
    
    private Integer maxParticipants;
    
    @Column(nullable = false)
    private String clubName;
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}