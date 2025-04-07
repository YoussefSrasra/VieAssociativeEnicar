package com.dev.backdev.demandeclub.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class demandeclub {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String email;
    private String nomClub;
    
    @Column(columnDefinition = "TEXT")
    private String logoBase64; // Stocke uniquement la chaîne base64 de l'image
    
    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Etat etat = Etat.EN_ATTENTE; // Valeur par défaut "EN_ATTENTE"
}