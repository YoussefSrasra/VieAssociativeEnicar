package com.dev.backdev.Club.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backdev.Auth.model.User;
import com.dev.backdev.Auth.repository.UserRepository;
import com.dev.backdev.Club.Model.Club;
import com.dev.backdev.Club.Repository.ClubRepository;
import com.dev.backdev.Club.dto.ClubDTO;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private UserRepository userRepository;

    public ClubDTO createClub(Club club) {
        clubRepository.save(club);
        return convertToDTO(club);
    }

    public List<ClubDTO> getAllClubs() {
        List<Club> clubs = clubRepository.findAll();
        return clubs.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Optional<ClubDTO> getClubById(Long id) {
        return clubRepository.findById(id).map(this::convertToDTO);
    }

    public List<ClubDTO> getClubsByUserId(Long userId) {
        return userRepository.findById(userId)
                .map(user -> user.getMemberClubs().stream()
                        .map(this::convertToDTO)
                        .collect(Collectors.toList()))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    public List<ClubDTO> getClubsByUserName(String userName) {
        return userRepository.findByUsername(userName)
                .map(user -> user.getMemberClubs().stream()
                        .map(this::convertToDTO)
                        .collect(Collectors.toList()))
                .orElseThrow(() -> new RuntimeException("User not found with username: " + userName));
    }

    public Club updateClub(Long id, Club clubDetails) {
        return clubRepository.findById(id).map(club -> {
            club.setName(clubDetails.getName());
            club.setSpecialty(clubDetails.getSpecialty());
            club.setStatus(clubDetails.getStatus());
            return clubRepository.save(club);
        }).orElseThrow(() -> new RuntimeException("Club not found"));
    }

    
    public ClubDTO assignMembersToClub(String name, Set<String> usernames) {
        Club club = clubRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Club not found"));

        List<User> users = userRepository.findByUsernameIn(usernames);

        for (User user : users) {
            club.addMember(user); // Uses the entity helper method
        }

        clubRepository.save(club);
        return convertToDTO(club);
    }

    public ClubDTO removeMembersFromClub(String name, Set<String> usernames) {
        Club club = clubRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Club not found"));

        List<User> users = userRepository.findByUsernameIn(usernames);

        for (User user : users) {
            try {
                club.removeMember(user); // May throw if trying to remove the manager
            } catch (IllegalStateException e) {
                // Optional: log or skip, or collect errors to return
            }
        }

        clubRepository.save(club);
        return convertToDTO(club);
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
                club.getLogo(),
                responsibleMemberUsername,
                memberUsernames
        );
    }
    
}
