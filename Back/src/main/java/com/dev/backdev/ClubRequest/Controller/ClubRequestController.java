package com.dev.backdev.ClubRequest.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dev.backdev.ClubRequest.Model.ClubRequest;
import com.dev.backdev.ClubRequest.Service.ClubRequestService;

@RestController
@RequestMapping("/api/club-requests")
public class ClubRequestController {

    @Autowired
    private ClubRequestService clubRequestService;

    @PostMapping
    public ClubRequest createRequest(@RequestBody ClubRequest request) {
        return clubRequestService.createRequest(request);
    }

    @GetMapping
    public List<ClubRequest> getAllRequests() {
        return clubRequestService.getAllRequests();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClubRequest> getRequestById(@PathVariable Long id) {
        Optional<ClubRequest> request = clubRequestService.getRequestById(id);
        return request.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ClubRequest> approveRequest(@PathVariable Long id) {
        ClubRequest approvedRequest = clubRequestService.approveRequest(id);
        return ResponseEntity.ok(approvedRequest);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Void> rejectRequest(@PathVariable Long id) {
        clubRequestService.rejectRequest(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public List<ClubRequest> getRequestsByStatus(@PathVariable String status) {
        return clubRequestService.getRequestsByStatus(status);
    }
}
