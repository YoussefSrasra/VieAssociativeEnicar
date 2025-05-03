package com.dev.backdev.entretien.repository;

import com.dev.backdev.entretien.model.Entretien;
import com.dev.backdev.enrollment.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EntretienRepository extends JpaRepository<Entretien, Long> {
    boolean existsByEnrollment(Enrollment enrollment);
    Optional<Entretien> findByEnrollment(Enrollment enrollment);

       @Query("SELECT e FROM Entretien e WHERE e.enrollment.clubId = :clubId")
    List<Entretien> findByClubId(@Param("clubId") Long clubId);
}