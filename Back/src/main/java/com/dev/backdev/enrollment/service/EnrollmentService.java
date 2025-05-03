package com.dev.backdev.enrollment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backdev.enrollment.model.Enrollment;
import com.dev.backdev.enrollment.model.EnrollmentStatus;
import com.dev.backdev.enrollment.repository.EnrollmentRepository;
import com.dev.backdev.entretien.model.Entretien;
import com.dev.backdev.entretien.model.ResultatEntretien;
import com.dev.backdev.entretien.model.StatutEntretien;
import com.dev.backdev.entretien.service.EntretienService;

import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final EntretienService entretienService;

  
    public EnrollmentService(EnrollmentRepository enrollmentRepository, EntretienService entretienService) {
        this.enrollmentRepository = enrollmentRepository;
        this.entretienService = entretienService;
    }

    public Optional<Enrollment> getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id);
    }

    public List<Enrollment> getEnrollmentsByClub(Long clubId) {
        return enrollmentRepository.findByClubId(clubId);
    }
    public Enrollment createEnrollment(Enrollment enrollment) {
        enrollment.setEtat(EnrollmentStatus.EN_ATTENTE);
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment approveEnrollment(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment non trouvé"));

        enrollment.setEtat(EnrollmentStatus.ACCEPTE);
        Enrollment updatedEnrollment = enrollmentRepository.save(enrollment);

        // Création automatique de l'entretien
        createDefaultEntretien(enrollment);

        return updatedEnrollment;
    }

    public Enrollment rejectEnrollment(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment non trouvé"));

        enrollment.setEtat(EnrollmentStatus.REJETE);
        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    private void createDefaultEntretien(Enrollment enrollment) {
        Entretien entretien = new Entretien();
        entretien.setEnrollment(enrollment);
         entretien.setStatut(StatutEntretien.EN_ATTENTE);
        entretien.setResultat(ResultatEntretien.EN_ATTENTE);
        entretien.setConfirmation(false);
        // dateEntretien et heureEntretien restent null

        entretienService.saveEntretien(entretien);
    }
}