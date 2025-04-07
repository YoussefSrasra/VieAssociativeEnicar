package com.dev.backdev.Club.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backdev.Auth.model.User;
import com.dev.backdev.Club.Model.Club;
import com.dev.backdev.Club.Repository.ClubRepository;
import com.dev.backdev.Club.dto.ClubDTO;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;

    public Club createClub(Club club) {
        return clubRepository.save(club);
    }

    public List<ClubDTO> getAllClubs() {
        List<Club> clubs = clubRepository.findAll();
        return clubs.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Optional<ClubDTO> getClubById(Long id) {
        return clubRepository.findById(id).map(this::convertToDTO);
    }

    public Club updateClub(Long id, Club clubDetails) {
        return clubRepository.findById(id).map(club -> {
            club.setName(clubDetails.getName());
            club.setSpecialty(clubDetails.getSpecialty());
            club.setStatus(clubDetails.getStatus());
            return clubRepository.save(club);
        }).orElseThrow(() -> new RuntimeException("Club not found"));
    }

    public void deleteClub(Long id) {
        clubRepository.deleteById(id);
    }

    public Optional<ClubDTO> getClubByName(String name) {
        return clubRepository.findByName(name).map(this::convertToDTO);
    }

    private ClubDTO convertToDTO(Club club) {
        String responsibleMemberUsername = (club.getResponsibleMember() != null) ? club.getResponsibleMember().getUsername() : null;
        List<String> memberUsernames = club.getMembers().stream().map(User::getUsername).collect(Collectors.toList());

        return new ClubDTO(
                club.getId(),
                club.getName(),
                club.getSpecialty(),
                club.getStatus(),
                responsibleMemberUsername,
                memberUsernames
        );
    }
    
}
