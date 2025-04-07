package com.dev.backdev.EventRequest.Repository;

import com.dev.backdev.EventRequest.Model.EventRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface EventRequestRepository extends JpaRepository<EventRequest, Long> {
    List<EventRequest> findByClubId(Long clubId);
    List<EventRequest> findByStatus(EventRequest.RequestStatus status);
       @Query("SELECT new map(" +
           "er.id as id, " +
           "er.eventName as eventName, " +
           "er.status as status, " +
           "c.name as clubName, " +
           "c.specialty as clubSpecialty" +
           ") FROM EventRequest er JOIN er.club c")
    List<Map<String, Object>> findAllForDisplay();
}