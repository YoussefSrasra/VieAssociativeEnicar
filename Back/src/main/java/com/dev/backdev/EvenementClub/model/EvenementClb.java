package com.dev.backdev.EvenementClub.model;



    import java.time.LocalDateTime;
import java.util.List;

import com.dev.backdev.Auth.model.User;
import com.dev.backdev.enrollment.model.Enrollment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
    @OneToMany(mappedBy = "evenement")
    private List<Enrollment> enrollments;
        @ManyToOne
        @JoinColumn(name = "responsable_id", nullable = false)
        private User responsable;
    }
    
