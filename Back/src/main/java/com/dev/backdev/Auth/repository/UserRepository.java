package com.dev.backdev.Auth.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.backdev.Auth.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username); // Trouver un utilisateur par son nom d'utilisateur
}