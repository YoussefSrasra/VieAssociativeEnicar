package com.dev.backdev.EventRequest.Repository;

import com.dev.backdev.EventRequest.Model.EventRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRequestRepository extends JpaRepository<EventRequest, Long> {
    List<EventRequest> findByClubId(Long clubId);
    List<EventRequest> findByStatus(EventRequest.RequestStatus status);
}