package com.dev.backdev.Club.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backdev.Club.Service.ClubMembershipService;
import com.dev.backdev.Club.dto.ClubMembershipDTO;
import com.dev.backdev.Club.dto.ClubMembershipRequestDTO;
import com.dev.backdev.Enums.ClubRole;

import lombok.Data;

@RestController
@RequestMapping("/api/memberships")
public class ClubMembershipController {
    @Autowired
    private ClubMembershipService membershipService;



    @PostMapping
    public ResponseEntity<Void> addMembership(@RequestBody ClubMembershipRequestDTO membershipDTO) {
       membershipService.addMembership(membershipDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getUsers/{clubname}")
    public ResponseEntity<List<ClubMembershipDTO>> getMembersByClub(@PathVariable String clubname) {
        List<ClubMembershipDTO> members = membershipService.getMembersByClub(clubname);
        return ResponseEntity.ok(members);
    }

    @PutMapping("/update-role")
    public ResponseEntity<Void> updateMembershipRole(@RequestBody UpdateRoleRequest request) {
        membershipService.updateMembershipRole(request.getMembershipId(), request.getNewRole());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeMembership(@RequestParam Long membershipId) {
        membershipService.removeMembership(membershipId);
        return ResponseEntity.ok().build();
    }

  

    @GetMapping("/getRole/{username}/{clubId}") 
    public ResponseEntity<ClubRole> getUserRoleInClub(@PathVariable String username, @PathVariable Long clubId) {
        ClubRole role = membershipService.getUserRoleInClub(username, clubId);
        return ResponseEntity.ok(role);
    }
 
 
 
    @Data
    public static class UpdateRoleRequest {
        private Long membershipId;
        private ClubRole newRole;
    }
}
