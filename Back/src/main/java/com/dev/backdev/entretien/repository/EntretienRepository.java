package com.dev.backdev.entretien.repository;

import com.dev.backdev.entretien.model.Entretien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntretienRepository extends JpaRepository<Entretien, Long> {
}