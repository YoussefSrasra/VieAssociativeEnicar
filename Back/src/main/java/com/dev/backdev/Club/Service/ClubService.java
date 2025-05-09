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
import com.dev.backdev.Club.Repository.ClubMembershipRepository;
import com.dev.backdev.Club.Repository.ClubRepository;
import com.dev.backdev.Club.dto.ClubBasicDTO;
import com.dev.backdev.Club.dto.ClubDTO;
import com.dev.backdev.Enums.ClubRole;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ClubMembershipRepository membershipRepository;
    private final PasswordEncoder passwordEncoder;

    public ClubService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public Club createClub(Club club) {
        if (clubRepository.existsByName(club.getName())) {
            throw new IllegalArgumentException("Un club avec ce nom existe déjà");
        }

        User manager = new User();
        manager.setUsername(club.getName());
        manager.setPassword(passwordEncoder.encode("changeme"));
        manager.setRole("MANAGER");
        manager.setPhoto(club.getLogo()); // Photo = logo du club
        userRepository.save(manager);

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
    public Optional<Club> getClubByIdWithoutDTO(Long id) {
        return clubRepository.findById(id);
    }

    public List<ClubBasicDTO> getClubsByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(user -> user.getClubMemberships().stream()
                        .map(ClubMembership::getClub)  // Récupère le Club depuis ClubMembership
                        .map(club -> new ClubBasicDTO(club.getId(), club.getName()))

                        .collect(Collectors.toList()))
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    public List<ClubDTO> getClubsByUserName(String userName) {
        return userRepository.findByUsername(userName)
                .map(user -> user.getClubMemberships().stream()
                        .map(ClubMembership::getClub) 
                        .map(this::convertToDTO) 
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
                if (!clubDetails.getName().equals(club.getName()) &&
                        clubRepository.existsByName(clubDetails.getName())) {
                    throw new IllegalArgumentException("Un club avec ce nom existe déjà");
                }
                club.setName(clubDetails.getName());
            }
    
            if (clubDetails.getSpecialty() != null) {
                club.setSpecialty(clubDetails.getSpecialty());
            }
    
            if (clubDetails.getStatus() != null) {
                club.setStatus(clubDetails.getStatus());
            }
    
            if (clubDetails.getLogo() != null) {
                club.setLogo(clubDetails.getLogo());
            }
    
            if (clubDetails.getResponsibleMember() != null) {
                club.setResponsibleMember(clubDetails.getResponsibleMember());
            }
    
            club.setEnrollmentOpen(clubDetails.isEnrollmentOpen());
    
            if (clubDetails.getMandatStartDate() != null) {
                club.setMandatStartDate(clubDetails.getMandatStartDate());
            }
    
            if (clubDetails.getMandatDurationMonths() != null) {
                club.setMandatDurationMonths(clubDetails.getMandatDurationMonths());
            }
    
            return clubRepository.save(club);
        }).orElseThrow(() -> new RuntimeException("Club not found"));
    }
    

    public ClubDTO assignMembersToClub(String name, Set<String> usernames) {
        Club club = clubRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Club not found"));

        List<User> users = userRepository.findByUsernameIn(usernames);

        for (User user : users) {
            boolean alreadyMember = club.getMemberships().stream()
                    .anyMatch(m -> m.getUser().equals(user));

            if (!alreadyMember) {
                ClubMembership membership = new ClubMembership();
                membership.setUser(user);
                membership.setClub(club);
                membership.setRole(ClubRole.MEMBER);
                club.getMemberships().add(membership);
            }
        }

        clubRepository.save(club);
        return convertToDTO(club);
    }

    public void assignMemberToClub (String clubName, String username){
        Club club =  clubRepository.findByName(clubName)
        .orElseThrow(() -> new RuntimeException("Club not found"));
        User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));
        boolean alreadyMember = club.getMemberships().stream()
                    .anyMatch(m -> m.getUser().equals(user));
        if (!alreadyMember) {
            ClubMembership membership = new ClubMembership();
            membership.setUser(user);
            membership.setClub(club);
            membership.setRole(ClubRole.MEMBER); 
            membershipRepository.save(membership);
            club.getMemberships().add(membership);
        }

    }

    public ClubDTO removeMembersFromClub(String name, Set<String> usernames) {
        Club club = clubRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Club not found"));

        List<User> users = userRepository.findByUsernameIn(usernames);

        club.getMemberships().removeIf(membership -> users.contains(membership.getUser()) &&
                membership.getRole() == ClubRole.MEMBER // Ne pas supprimer les rôles spéciaux
        );

        clubRepository.save(club);
        return convertToDTO(club);
    }

    @Transactional
    public void deleteClub(Long id) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Club not found with id: " + id));

        club.getMemberships().forEach(membership -> membershipRepository.delete(membership));

        User responsible = club.getResponsibleMember();
        if (responsible != null) {
            userRepository.delete(responsible);
        }

        clubRepository.delete(club);
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
                club.getStatus(), 
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

    public List<ClubBasicDTO> getAllClubsBasic() {
        List<Club> clubs = clubRepository.findAll();
        return clubs.stream().map(club -> new ClubBasicDTO(club.getId(), club.getName())).collect(Collectors.toList());
    }

}
