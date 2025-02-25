package com.dev.backdev.Club.Repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.backdev.Club.Model.Club;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    // Custom query methods can be added here if needed
    // Example: Find clubs by status
    List<Club> findByStatus(String status);
}