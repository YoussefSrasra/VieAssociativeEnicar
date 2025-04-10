package com.dev.backdev.entretien.model;

import com.dev.backdev.enrollment.model.Enrollment;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class Entretien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "enrollment_id")
    private Enrollment enrollment;

    private LocalDate dateEntretien;
    private LocalTime heureEntretien;

    @Enumerated(EnumType.STRING)
    private StatutEntretien statut = StatutEntretien.EN_ATTENTE;

    private boolean confirmation = false;

    @Enumerated(EnumType.STRING)
    private ResultatEntretien resultat = ResultatEntretien.EN_ATTENTE;
}


