package com.dev.backdev.ClubRequest.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.dev.backdev.ClubRequest.Model.ClubRequest;

@Repository
public interface ClubRequestRepository extends JpaRepository<ClubRequest, Long> {
    List<ClubRequest> findByStatus(String status);
}
