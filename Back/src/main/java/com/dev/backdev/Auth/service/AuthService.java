    package com.dev.backdev.Auth.service;

    import java.util.List;
    import java.util.Optional;
    import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.stereotype.Service;

import com.dev.backdev.Auth.dto.ManagerWithClubDto;
import com.dev.backdev.Auth.dto.ProfileCompletionDTO;
    import com.dev.backdev.Auth.dto.UserRegistrationDTO;
    import com.dev.backdev.Auth.dto.UserResponseDto;
    import com.dev.backdev.Auth.dto.UserUpdateDTO;
    import com.dev.backdev.Auth.model.User;
    import com.dev.backdev.Auth.repository.UserRepository;
import com.dev.backdev.Auth.util.JwtUtil;
import com.dev.backdev.Club.Model.Club;
    import com.dev.backdev.Club.Model.ClubMembership;
import com.dev.backdev.Club.Repository.ClubMembershipRepository;
import com.dev.backdev.Club.Repository.ClubRepository;
import com.dev.backdev.Email.EmailService;
    import com.dev.backdev.Enums.ClubRole;

import jakarta.transaction.Transactional;


    @Service
    public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final ClubRepository clubRepository;
        private final ClubMembershipRepository clubMembershipRepository;
        private final JwtUtil jwtUtil;
        private final EmailService emailService;


        public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,ClubRepository clubRepository, EmailService emailService, ClubMembershipRepository clubMembershipRepository, JwtUtil jwtUtil) {
            this.jwtUtil = jwtUtil;
            this.clubMembershipRepository = clubMembershipRepository;
            this.userRepository = userRepository;
            this.passwordEncoder = passwordEncoder;
            this.clubRepository = clubRepository;
            this.emailService = emailService;

        }

        public User registerUser(UserRegistrationDTO userDto) {
            
            User user = new User();
            user.setUsername(userDto.getUsername());
            user.setPassword(passwordEncoder.encode("changeme"));
            user.setEmail(userDto.getEmail());
            user.setRole(userDto.getRole());
            user.setNom(userDto.getNom());
            user.setPrenom(userDto.getPrenom());
            user.setCin(userDto.getCin());
            user.setFiliere(userDto.getFiliere());
            user.setNiveau(userDto.getNiveau());
            user.setSexe(userDto.getSexe());
            user.setFormation(userDto.getFormation());
            user.setPhoto(userDto.getPhoto());
            
            /*if (userDto.getMemberClubNames() != null) {
                userDto.getMemberClubNames().forEach(clubName -> {
                    clubRepository.findByName(clubName).ifPresent(club -> {
                        ClubMembership membership = new ClubMembership();
                        membership.setUser(user);
                        membership.setClub(club);
                        membership.setRole(ClubRole.MEMBER); // Rôle par défaut
                        user.getClubMemberships().add(membership);
                    });
                });
            }*/
            emailService.sendCredentials(
                user.getEmail(),
                userDto.getUsername(),
                "changeme" // Send the initial password
            );
    
            return userRepository.save(user);
        }

        public User createVisitorAccount(String nom, String prenom, String email, Club club, ClubRole role) {
            String baseUsername = prenom.toLowerCase() + capitalizeFirstLetter(nom);
            String username = baseUsername;
            int suffix = 0;
        
            // Vérifier l'unicité du username
            while (userRepository.findByUsername(username).isPresent()) {
                username = baseUsername + suffix;
                suffix++;
            }
        
            User user = new User();
            user.setNom(nom);
            user.setPrenom(prenom);
            user.setEmail(email);
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode("changeme"));
            user.setRole("MEMBER");
            user.setFirstLogin(true);
            user.joinClub(club, role); 
        
            emailService.sendCredentials(email, username, "changeme");
        
            return userRepository.save(user);
        }


        public void deleteUser(Long userId) {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Check if user is responsible for any club
            Optional<Club> managedClub = clubRepository.findByResponsibleMember(user);
            if (managedClub.isPresent()) {
                throw new IllegalStateException(
                    "Cannot delete user because they are responsible for club: " + 
                    managedClub.get().getName() + 
                    ". Please reassign a new manager first."
                );
            }
            
            userRepository.delete(user);
        }

        @Transactional
        public String switchToManagerAccount(String memberUsername, String clubName) {
            // 1. Trouver l'utilisateur et le club
            User member = userRepository.findByUsername(memberUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            Club club = clubRepository.findByName(clubName)
                .orElseThrow(() -> new RuntimeException("Club not found"));

            // 2. Vérifier les droits via les membreships
            boolean hasRights = member.getClubMemberships().stream()
                .anyMatch(m -> 
                    m.getClub().equals(club) && 
                    m.getRole() != ClubRole.MEMBER
                );
            
            if (!hasRights) {
                throw new RuntimeException("Access denied - insufficient privileges");
            }

            // 3. Récupérer le compte manager
            User managerAccount = club.getResponsibleMember();
            if (managerAccount == null) {
                throw new RuntimeException("Manager account not configured for this club");
            }

            // 4. Générer le token
            UserDetails managerDetails = org.springframework.security.core.userdetails.User.builder()
                .username(managerAccount.getUsername())
                .password(managerAccount.getPassword())
                .authorities("ROLE_" + managerAccount.getRole())
                .build();

            return jwtUtil.generateToken(managerDetails);
        }
        
        public void deleteUser(String username) {
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Check if user is responsible for any club
            Optional<Club> managedClub = clubRepository.findByResponsibleMember(user);
            if (managedClub.isPresent()) {
                throw new IllegalStateException(
                    "Cannot delete user because they are responsible for club: " + 
                    managedClub.get().getName() + 
                    ". Please reassign a new manager first."
                );
            }
            
            userRepository.delete(user);
        }
        public List<UserResponseDto> getAllUsers() {
            List<User> users = userRepository.findAll();
            return users.stream()
                .map(this::convertToUserResponseDTO)
                .collect(Collectors.toList());
        }

        // 2. Get users by role
        public List<UserResponseDto> getUsersByRole(String role) {
            List<User> users = userRepository.findByRole(role);
            return users.stream()
                .map(this::convertToUserResponseDTO)
                .collect(Collectors.toList());
        }

        // 3. Get users by club name
        public List<UserResponseDto> getUsersByClubName(String clubName) {
            Club club = clubRepository.findByName(clubName)
        .orElseThrow(() -> new RuntimeException("Club not found"));
            
            Set<User> clubUsers = club.getMemberships().stream()
                .map(ClubMembership::getUser)
                .collect(Collectors.toSet());
            if (club.getResponsibleMember() != null) {
                clubUsers.add(club.getResponsibleMember());
            }
            
            return clubUsers.stream()
                .map(this::convertToUserResponseDTO)
                .collect(Collectors.toList());
        }

        // 4. Get user by username
        public Optional<UserResponseDto> getUserByUsername(String username) {
            return userRepository.findByUsername(username)
                .map(this::convertToUserResponseDTO);
        }

        public Optional<UserResponseDto> getUserById(Long id) {
            return userRepository.findById(id)
                .map(this::convertToUserResponseDTO);
        }

        public Optional<UserResponseDto> getUserByEmail(String email) {
            return userRepository.findByEmail(email)
                .map(this::convertToUserResponseDTO);
        }
        

        private UserResponseDto convertToUserResponseDTO(User user) {
            
            return new UserResponseDto(user);
        }

        public UserResponseDto updateUser(String username, UserUpdateDTO updateDTO) {
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

            // Update fields (if provided in DTO)
            if (updateDTO.getEmail() != null) user.setEmail(updateDTO.getEmail());
            if (updateDTO.getRole() != null) user.setRole(updateDTO.getRole());
            if (updateDTO.getPassword() != null) {
                // 1. Verify current password was provided
                if (updateDTO.getCurrentPassword() == null) {
                    throw new IllegalArgumentException("Current password is required");
                }
                
                // 2. Verify current password matches
                if (!passwordEncoder.matches(updateDTO.getCurrentPassword(), user.getPassword())) {
                    throw new IllegalArgumentException("Current password is incorrect");
                }
                
                // 3. Validate new password
                if (updateDTO.getPassword().length() < 8) {
                    throw new IllegalArgumentException("Password must be at least 8 characters");
                }
                
                // 4. Don't allow setting same password
                if (passwordEncoder.matches(updateDTO.getPassword(), user.getPassword())) {
                    throw new IllegalArgumentException("New password must be different from current password");
                }
                
                user.setPassword(passwordEncoder.encode(updateDTO.getPassword()));
            }            
            if (updateDTO.getNom() != null) user.setNom(updateDTO.getNom());
            if (updateDTO.getPrenom() != null) user.setPrenom(updateDTO.getPrenom());
            if (updateDTO.getCin() != null) user.setCin(updateDTO.getCin());
            if (updateDTO.getFiliere() != null) user.setFiliere(updateDTO.getFiliere());
            if (updateDTO.getNiveau() != null) user.setNiveau(updateDTO.getNiveau());
            if (updateDTO.getSexe() != null) user.setSexe(updateDTO.getSexe());
            if (updateDTO.getFormation() != null) user.setFormation(updateDTO.getFormation());
            if (updateDTO.getPhoto() != null) user.setPhoto(updateDTO.getPhoto());

            

            // Update club (if provided)
            /*if (updateDTO.getMemberClubNames() != null) {
                updateClubMemberships(user, updateDTO.getMemberClubNames());
            }*/

            User savedUser = userRepository.save(user);
            return new UserResponseDto(savedUser); // Converts to DTO
        }

        private void updateClubMemberships(User user, Set<String> newClubNames) {
            user.getClubMemberships().removeIf(membership -> 
            !newClubNames.contains(membership.getClub().getName())
            );
            
            // Ajouter les nouveaux membreships
            newClubNames.forEach(clubName -> {
                if (user.getClubMemberships().stream()
                    .noneMatch(m -> m.getClub().getName().equals(clubName))) {
                    
                    clubRepository.findByName(clubName).ifPresent(club -> {
                        ClubMembership membership = new ClubMembership();
                        membership.setUser(user);
                        membership.setClub(club);
                        membership.setRole(ClubRole.MEMBER);
                        user.getClubMemberships().add(membership);
                    });
                }
            });
        }

        public User completeProfile(String username, ProfileCompletionDTO dto) {
            // 1. Find user
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // 2. Validate it's first login
            if (!user.isFirstLogin()) {
                throw new IllegalStateException("Profile already completed");
            }
            
            // 3. Manual validation
            validateProfileCompletion(dto);
            
            // 4. Update user
            user.setNom(dto.getNom());
            user.setPrenom(dto.getPrenom());
            user.setCin(dto.getCin());
            user.setFiliere(dto.getFiliere());
            user.setNiveau(dto.getNiveau());
            user.setSexe(dto.getSexe());
            user.setFormation(dto.getFormation());
            user.setPhoto(dto.getPhoto());
            user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
            user.setFirstLogin(false); // Mark as completed
            
            return userRepository.save(user);
        }

        // Manual validation
        private void validateProfileCompletion(ProfileCompletionDTO dto) {
            if (dto.getNewPassword() == null || dto.getNewPassword().length() < 8) {
                throw new IllegalArgumentException("Password must be at least 8 characters");
            }
            if (dto.getNom() == null || dto.getNom().trim().isEmpty()) {
                throw new IllegalArgumentException("Last name is required");
            }
            if (dto.getPrenom() == null || dto.getPrenom().trim().isEmpty()) {
                throw new IllegalArgumentException("First name is required");
            }
            if (dto.getCin() == null) {
                throw new IllegalArgumentException("CIN is required");
            }
            if (dto.getFiliere() == null) {
                throw new IllegalArgumentException("Field of study is required");
            }
            if (dto.getNiveau() == null) {
                throw new IllegalArgumentException("Academic level is required");
            }
            if (dto.getSexe() == null) {
                throw new IllegalArgumentException("Gender is required");
            }
            if (dto.getFormation() == null) {
                throw new IllegalArgumentException("Formation is required");
            }
        }

        

        private String capitalizeFirstLetter(String str) {
            if (str == null || str.isEmpty()) return str;
            return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
        }
    }