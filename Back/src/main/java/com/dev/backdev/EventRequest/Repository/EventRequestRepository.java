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
    "er.type as type, " +
    "er.status as status, " +
    "er.financialRequest as financialRequest, " +
    "er.requestedAmount as requestedAmount, " +
    "er.startDate as startDate, " +
    "er.endDate as endDate, " +
    "er.estimatedAttendees as estimatedAttendees, " +
    "er.needEquipment as needEquipment, " +
    "er.equipmentDescription as equipmentDescription, " +
    "c.id as clubId, " +
    "c.name as clubName) " +
    "FROM EventRequest er JOIN er.club c " +
    "ORDER BY er.createdAt DESC")  // Tri par date de création
List<Map<String, Object>> findAllForDisplay();
}