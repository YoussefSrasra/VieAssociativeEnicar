package com.dev.backdev.lancerEvenement.repository;

import com.dev.backdev.lancerEvenement.model.Event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Version de base sans pagination
    @Query("SELECT e FROM Event e WHERE e.endDate > :now ORDER BY e.startDate ASC")
    List<Event> findUpcomingEvents(LocalDateTime now);
    
    // Version paginée
    
    Event findFirstByOrderByCreatedAtDesc();


}