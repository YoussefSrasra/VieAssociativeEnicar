package com.dev.backdev.Participant.model;


import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "participants")
@Data
public class Participant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String status;

    @Column(nullable = false, length = 100)
    private String eventName;
    
    @Column(nullable = false, length = 50)
    private String nom;
    
    @Column(nullable = false, length = 50)
    private String prenom;
    
    @Column(nullable = false, length = 100)
    private String email;
    
    @Column(nullable = false, length = 10)
    private String niveauEtudes;
    
    @Column(nullable = false, length = 50)
    private String comite;
    
    @Column(nullable = false, length = 20)
    private String participationType;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String motivation;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public void setStatus(String status) {
        this.status = status;
    }
  
}