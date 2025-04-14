    package com.dev.backdev.Auth.service;

    import java.util.List;
    import java.util.Optional;
    import java.util.stream.Collectors;

    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.stereotype.Service;

    import com.dev.backdev.Auth.dto.ProfileCompletionDTO;
    import com.dev.backdev.Auth.dto.UserRegistrationDTO;
    import com.dev.backdev.Auth.dto.UserResponseDto;
    import com.dev.backdev.Auth.dto.UserUpdateDTO;
    import com.dev.backdev.Auth.model.User;
    import com.dev.backdev.Auth.repository.UserRepository;
    import com.dev.backdev.Club.Model.Club;
    import com.dev.backdev.Club.Repository.ClubRepository;
    import com.dev.backdev.Email.EmailService;


    @Service
    public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final ClubRepository clubRepository;
        private final EmailService emailService;


        public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,ClubRepository clubRepository, EmailService emailService) {
            this.userRepository = userRepository;
            this.passwordEncoder = passwordEncoder;
            this.clubRepository = clubRepository;
            this.emailService = emailService;

        }

        public User registerUser(UserRegistrationDTO userDto) {
            // 1. Find the club by name
            Club club = clubRepository.findByName(userDto.getClub().getName())
                .orElseThrow(() -> new RuntimeException("Club not found"));

            // 2. Create and save the user
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
            user.setClub(club); // Assign the fetched club

            emailService.sendCredentials(
                user.getEmail(),
                userDto.getUsername(),
                user.getPassword() // Raw password (will be sent via email)
            );

            return userRepository.save(user);
        }
        public void deleteUser(Long userId) {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Handle club relationships if needed
            if (user.getResponsibleClub() != null) {
                throw new RuntimeException("Cannot delete a club manager. Reassign club first.");
            }
            
            userRepository.delete(user);
        }
        public void deleteUser(String username) {
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Handle club relationships if needed
            if (user.getResponsibleClub() != null) {
                throw new RuntimeException("Cannot delete a club manager. Reassign club first.");
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
            List<User> users = userRepository.findByClub_Name(clubName);
            return users.stream()
                .map(this::convertToUserResponseDTO)
                .collect(Collectors.toList());
        }

        // 4. Get user by username
        public Optional<UserResponseDto> getUserByUsername(String username) {
            return userRepository.findByUsername(username)
                .map(this::convertToUserResponseDTO);
        }

        private UserResponseDto convertToUserResponseDTO(User user) {
            String clubName = (user.getClub() != null) ? user.getClub().getName() : null;
            
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
            if (updateDTO.getClubName() != null) {
                Club club = clubRepository.findByName(updateDTO.getClubName())
                    .orElseThrow(() -> new RuntimeException("Club not found"));
                user.setClub(club);
            }

            User savedUser = userRepository.save(user);
            return new UserResponseDto(savedUser); // Converts to DTO
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
    }