package com.dev.backdev.Club.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.backdev.Club.Model.ClubMembership;

public interface ClubMembershipRepository extends JpaRepository<ClubMembership, Long> {
    
    // Requête pour trouver un membership spécifique
    @Query("SELECT m FROM ClubMembership m WHERE m.user.username = :username AND m.club.name = :clubName")
    Optional<ClubMembership> findByUserAndClub(
        @Param("username") String username,
        @Param("clubName") String clubName
    );
    
    // Trouver tous les membreships d'un club
    List<ClubMembership> findByClubName(String clubName);
    List<ClubMembership> findByClubId(Long clubId);
}