package com.dev.backdev.demandeClub.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DemandeClub {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String email;
    private String nomClub;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Etat etat = Etat.EN_ATTENTE; // Valeur par défaut "EN_ATTENTE"
    
    
    
   
    // getters et setters
    public Etat getEtat() {
        return etat;
    }
    
    public void setEtat(Etat etat) {
        this.etat = etat;
    }
 
}



 