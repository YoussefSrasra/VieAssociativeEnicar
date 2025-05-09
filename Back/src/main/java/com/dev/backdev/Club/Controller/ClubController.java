package com.dev.backdev.Club.Controller;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backdev.Auth.repository.UserRepository;
import com.dev.backdev.Club.Model.Club;
import com.dev.backdev.Club.Service.ClubService;
import com.dev.backdev.Club.dto.ClubBasicDTO;
import com.dev.backdev.Club.dto.ClubDTO;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    @Autowired
    private ClubService clubService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ClubDTO createClub(@RequestBody Club club) {
        Club clubCree = clubService.createClub(club);
        ClubDTO dto = new ClubDTO(clubCree);
        return dto;
    }

    @GetMapping
    public List<ClubDTO> getAllClubs() {
        return clubService.getAllClubs();
    }

    @GetMapping("/basic")
    public List<ClubBasicDTO> getAllClubsBasic() {
        return clubService.getAllClubsBasic();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClubDTO> getClubById(@PathVariable Long id) {
        Optional<ClubDTO> club = clubService.getClubById(id);
        return club.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Club> updateClub(@PathVariable Long id, @RequestBody Club clubDetails) {
        Club updatedClub = clubService.updateClub(id, clubDetails);
        return ResponseEntity.ok(updatedClub);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClub(@PathVariable Long id) {
        clubService.deleteClub(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<ClubDTO> getClubsByName(@PathVariable String name) {
        Optional<ClubDTO> club = clubService.getClubByName(name);
        return club.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{name}/members")
    public ResponseEntity<ClubDTO> assignMembersToClub(
            @PathVariable String name,
            @RequestBody Set<String> usernames) {
        ClubDTO updatedClub = clubService.assignMembersToClub(name, usernames);
        return ResponseEntity.ok(updatedClub);
    }

    @DeleteMapping("/{name}/members")
    public ResponseEntity<ClubDTO> removeMembersFromClub(
            @PathVariable String name,
            @RequestBody Set<String> usernames) {
        ClubDTO updatedClub = clubService.removeMembersFromClub(name, usernames);
        return ResponseEntity.ok(updatedClub);
    }

    @GetMapping("/userid/{id}")
    public ResponseEntity<List<ClubDTO>> getClubsByUser(@PathVariable Long id) {
        // List<ClubDTO> clubs = clubService.getClubsByUserName(username);
        List<ClubDTO> clubs = clubService.getClubsByResponnsibleMemberId(id);

        return ResponseEntity.ok(clubs);
    }
   @PutMapping("/{clubId}/toggle-enrollment")
    public ResponseEntity<String> toggleEnrollment(@PathVariable Long clubId) {
        try {
            boolean newStatus = clubService.toggleEnrollmentStatus(clubId);
            return ResponseEntity.ok("Enrollment status is now: " + newStatus);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<List<ClubBasicDTO>> getClubsByUsername(@PathVariable String username) {

        List<ClubBasicDTO> clubs = clubService.getClubsByUsername(username);
        return ResponseEntity.ok(clubs);    
    }


    @GetMapping("/user/{username}")
    public ResponseEntity<List<ClubDTO>> getClubsByUser(@PathVariable String username) {
            List<ClubDTO> clubs = clubService.getClubsByUserName(username);
            return ResponseEntity.ok(clubs);
    }

    @PostMapping("assign/user/{clubName}/{username}")
    public void assignMemberToClub(@PathVariable  String clubName, @PathVariable String username ){
        clubService.assignMemberToClub(clubName, username);
    }
    
   
}
