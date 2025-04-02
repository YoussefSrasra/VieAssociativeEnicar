package com.dev.backdev.enrollment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backdev.enrollment.model.Enrollment;
import com.dev.backdev.enrollment.model.EnrollmentStatus; // Importer l'enum
import com.dev.backdev.enrollment.repository.EnrollmentRepository;

import java.util.List;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public Enrollment createEnrollment(Enrollment enrollment) {
        // Logique pour créer une demande d'enrôlement
        enrollment.setEtat(EnrollmentStatus.EN_ATTENTE); // Initialisation de l'état
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment approveEnrollment(Long enrollmentId) {
        // Logique pour approuver une demande d'enrôlement
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId).orElseThrow();
        enrollment.setEtat(EnrollmentStatus.ACCEPTE); // Mise à jour de l'état
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment rejectEnrollment(Long enrollmentId) {
        // Logique pour rejeter une demande d'enrôlement
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId).orElseThrow();
        enrollment.setEtat(EnrollmentStatus.REJETE); // Mise à jour de l'état
        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getAllEnrollments() {
        // Récupérer toutes les demandes d'enrôlement
        return enrollmentRepository.findAll();
    }
    private final EnrollmentRepository repository;

    public EnrollmentService(EnrollmentRepository repository) {
        this.repository = repository;
    }

   

    public List<Enrollment> getEnrollmentsByEvent(Long eventId) {
        return repository.findByEvenementId(eventId);
    }

 


}
