package com.dev.backdev.EvenementClub.model;



    import java.time.LocalDateTime;

import com.dev.backdev.Auth.model.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
    
    @ToString
    @Setter
    @EqualsAndHashCode
    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Entity
    public class EvenementClb {
    
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
    
        private String nomEvenement;
    
        private LocalDateTime dateHeure;
    
        private int nombreMembres;
    
        @Column(columnDefinition = "TEXT")
        private String remarques;
    
        // Relation avec le responsable du club (User)
        @ManyToOne
        @JoinColumn(name = "responsable_id", nullable = false)
        private User responsable;
    }
    
