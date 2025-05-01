package com.dev.backdev.Club.Repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.backdev.Auth.model.User;
import com.dev.backdev.Club.Model.Club;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    Optional<Club> findByName( String name);
    Optional<Club> findByResponsibleMember( User user);
    Optional<Club> findByResponsibleMember_Username(String username);
    boolean existsByName(String name);
   // void findByResponsibleMember(Optional<User> userReonsible);

    
}