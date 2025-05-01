package com.dev.backdev.Auth.repository;


import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.backdev.Auth.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username); // Trouver un utilisateur par son nom d'utilisateur
    List<User> findByUsernameIn(Set<String> usernames);
    List<User> findByRole(String role);
    //Optional<User> findByMemberClubsId(Long clubId);
   // List<User> findByMemberClubsName(String clubName);
    Optional<User> findByEmail( String role);
    //Optional<User> findByManagedClubId(Long clubId);
    
}