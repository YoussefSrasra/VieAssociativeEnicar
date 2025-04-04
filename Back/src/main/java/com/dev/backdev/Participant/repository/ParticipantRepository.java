package com.dev.backdev.Participant.repository;

import com.dev.backdev.Participant.model.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    
    List<Participant> findByEventName(String eventName);
    
    List<Participant> findByComite(String comite);
    
    List<Participant> findByParticipationType(String participationType);
    
    @Query("SELECT p.eventName as eventName, COUNT(p) as registeredCount, " +
           "SUM(CASE WHEN p.participationType = 'responsable' THEN 1 ELSE 0 END) as responsablesCount " +
           "FROM Participant p GROUP BY p.eventName")
    List<EventStatsProjection> findEventStats();
    
    interface EventStatsProjection {
        String getEventName();
        Long getRegisteredCount();
        Long getResponsablesCount();
    }
    
}