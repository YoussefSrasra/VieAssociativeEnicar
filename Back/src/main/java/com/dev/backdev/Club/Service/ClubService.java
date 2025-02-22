package com.dev.backdev.Club.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backdev.Club.Model.Club;
import com.dev.backdev.Club.Repository.ClubRepository;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;

    // Create a new club
    public Club createClub(Club club) {
        return clubRepository.save(club);
    }

    // Get all clubs
    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    // Get a club by ID
    public Optional<Club> getClubById(Long id) {
        return clubRepository.findById(id);
    }

    // Update a club
    public Club updateClub(Long id, Club clubDetails) {
        Club club = clubRepository.findById(id).orElseThrow(() -> new RuntimeException("Club not found"));
        club.setName(clubDetails.getName());
        club.setSpecialty(clubDetails.getSpecialty());
        club.setStatus(clubDetails.getStatus());
        club.setResponsibleMember(clubDetails.getResponsibleMember());
        club.setMembers(clubDetails.getMembers());
        return clubRepository.save(club);
    }

    // Delete a club
    public void deleteClub(Long id) {
        clubRepository.deleteById(id);
    }

    // Find clubs by status
    public List<Club> getClubsByStatus(String status) {
        return clubRepository.findByStatus(status);
    }
}