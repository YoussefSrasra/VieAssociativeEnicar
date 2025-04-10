package com.dev.backdev.entretien.repository;

import com.dev.backdev.entretien.model.Entretien;
import com.dev.backdev.enrollment.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EntretienRepository extends JpaRepository<Entretien, Long> {
    boolean existsByEnrollment(Enrollment enrollment);
    Optional<Entretien> findByEnrollment(Enrollment enrollment);
}