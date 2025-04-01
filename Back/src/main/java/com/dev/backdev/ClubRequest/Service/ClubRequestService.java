package com.dev.backdev.ClubRequest.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.dev.backdev.ClubRequest.Model.ClubRequest;
import com.dev.backdev.ClubRequest.Repository.ClubRequestRepository;

@Service
public class ClubRequestService {

    @Autowired
    private ClubRequestRepository clubRequestRepository;

    public ClubRequest createRequest(ClubRequest request) {
        request.setStatus("Pending");
        return clubRequestRepository.save(request);
    }

    public List<ClubRequest> getAllRequests() {
        return clubRequestRepository.findAll();
    }

    public Optional<ClubRequest> getRequestById(Long id) {
        return clubRequestRepository.findById(id);
    }

    public ClubRequest approveRequest(Long id) {
        ClubRequest request = clubRequestRepository.findById(id).orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus("Approved");
        return clubRequestRepository.save(request);
    }

    public void rejectRequest(Long id) {
        ClubRequest request = clubRequestRepository.findById(id).orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus("Rejected");
        clubRequestRepository.save(request);
    }

    public List<ClubRequest> getRequestsByStatus(String status) {
        return clubRequestRepository.findByStatus(status);
    }
}
