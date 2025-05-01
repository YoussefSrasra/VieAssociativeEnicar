package com.dev.backdev.Club.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dev.backdev.Auth.model.User;
import com.dev.backdev.Auth.repository.UserRepository;
import com.dev.backdev.Club.Model.Club;
import com.dev.backdev.Club.Model.ClubMembership;
import com.dev.backdev.Club.Repository.ClubRepository;
import com.dev.backdev.Club.dto.ClubBasicDTO;
import com.dev.backdev.Club.dto.ClubDTO;
import com.dev.backdev.Enums.ClubRole;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ClubService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public Club createClub(Club club) {
        if (clubRepository.existsByName(club.getName())) {
            throw new IllegalArgumentException("Un club avec ce nom existe déjà");
        }

        // 2. Crée le compte manager
        User manager = new User();
        manager.setUsername(club.getName());
        manager.setPassword(passwordEncoder.encode("changeme"));
        manager.setRole("MANAGER");
        manager.setPhoto(club.getLogo()); // Photo = logo du club
        userRepository.save(manager);

        // 3. Lie le manager au club
        club.setResponsibleMember(manager);
        Club savedClub = clubRepository.save(club);

        return savedClub;
    }

    /*
     * public ClubDTO createClubWithManager(Club club, String managerPassword) {
     * // 1. Vérifie que le nom du club est unique
     * if (clubRepository.existsByName(club.getName())) {
     * throw new IllegalArgumentException("Un club avec ce nom existe déjà");
     * }
     * 
     * // 2. Crée le compte manager
     * User manager = new User();
     * manager.setUsername(club.getName());
     * manager.setPassword(passwordEncoder.encode(managerPassword));
     * manager.setRole("ROLE_MANAGER");
     * manager.setPhoto(club.getLogo()); // Photo = logo du club
     * userRepository.save(manager);
     * 
     * // 3. Lie le manager au club
     * club.setResponsibleMember(manager);
     * Club savedClub = clubRepository.save(club);
     * 
     * return convertToDTO(savedClub);
     * }
     */

    public List<ClubDTO> getAllClubs() {
        List<Club> clubs = clubRepository.findAll();
        return clubs.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Optional<ClubDTO> getClubById(Long id) {
        return clubRepository.findById(id).map(this::convertToDTO);
    }

    public List<ClubBasicDTO> getClubsByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(user -> user.getClubMemberships().stream()
                        .map(ClubMembership::getClub)  // Récupère le Club depuis ClubMembership
                        .map(club -> new ClubBasicDTO(club.getId(), club.getName())) // Convertit en DTO minimal

                        .collect(Collectors.toList()))
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    public List<ClubDTO> getClubsByUserName(String userName) {
        return userRepository.findByUsername(userName)
                .map(user -> user.getClubMemberships().stream()
                        .map(ClubMembership::getClub) // Récupère le Club depuis ClubMembership
                        .map(this::convertToDTO) // Convertit en DTO
                        .collect(Collectors.toList()))
                .orElseThrow(() -> new RuntimeException("User not found with username: " + userName));
    }

    public List<ClubDTO> getClubsByResponnsibleMemberId(Long idReponsible) {
        Optional<User> userReonsible = userRepository.findById(idReponsible);
        if (userReonsible.isEmpty()) {
            throw new RuntimeException("User not found with id: " + idReponsible);
        } else {
            User userResponsible = userReonsible.get();
            Optional<Club> clubs = clubRepository.findByResponsibleMember(userResponsible);
            if (clubs.isEmpty()) {
                throw new RuntimeException("Club not found with id: " + idReponsible);
            } else {
                return clubs.stream().map(this::convertToDTO).collect(Collectors.toList());
            }
        }
    }

    public Club updateClub(Long id, Club clubDetails) {
        return clubRepository.findById(id).map(club -> {
            if (clubDetails.getName() != null) {
                // Vérifie que le nouveau nom n'existe pas déjà
                if (!clubDetails.getName().equals(club.getName()) &&
                        clubRepository.existsByName(clubDetails.getName())) {
                    throw new IllegalArgumentException("Un club avec ce nom existe déjà");
                }
                club.setName(clubDetails.getName());
            }
            // ... autres champs
            return clubRepository.save(club);
        }).orElseThrow(() -> new RuntimeException("Club not found"));
    }

    public ClubDTO assignMembersToClub(String name, Set<String> usernames) {
        Club club = clubRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Club not found"));

        List<User> users = userRepository.findByUsernameIn(usernames);

        for (User user : users) {
            // Vérifie si l'utilisateur est déjà membre
            boolean alreadyMember = club.getMemberships().stream()
                    .anyMatch(m -> m.getUser().equals(user));

            if (!alreadyMember) {
                ClubMembership membership = new ClubMembership();
                membership.setUser(user);
                membership.setClub(club);
                membership.setRole(ClubRole.MEMBER); // Rôle par défaut
                club.getMemberships().add(membership);
            }
        }

        clubRepository.save(club);
        return convertToDTO(club);
    }

    public ClubDTO removeMembersFromClub(String name, Set<String> usernames) {
        Club club = clubRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Club not found"));

        List<User> users = userRepository.findByUsernameIn(usernames);

        // Supprime les membreships correspondants
        club.getMemberships().removeIf(membership -> users.contains(membership.getUser()) &&
                membership.getRole() == ClubRole.MEMBER // Ne pas supprimer les rôles spéciaux
        );

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
        String managerUsername = (club.getResponsibleMember() != null)
                ? club.getResponsibleMember().getUsername()
                : null;

        List<String> memberUsernames = club.getMemberships().stream()
                .map(m -> m.getUser().getUsername())
                .collect(Collectors.toList());

        return new ClubDTO(
                club.getId(),
                club.getName(),
                club.getSpecialty(),
                club.getStatus(), // Convertit l'enum en String
                club.getLogo(),
                club.isEnrollmentOpen(),
                managerUsername,
                memberUsernames,
                club.getMandatStartDate(),
                club.getMandatDurationMonths());
    }

    public boolean toggleEnrollmentStatus(Long clubId) {
        Optional<Club> optionalClub = clubRepository.findById(clubId);

        if (optionalClub.isEmpty()) {
            throw new IllegalArgumentException("Club not found with ID: " + clubId);
        }

        Club club = optionalClub.get();
        club.setEnrollmentOpen(!club.isEnrollmentOpen());
        clubRepository.save(club);
        return club.isEnrollmentOpen();
    }

}
