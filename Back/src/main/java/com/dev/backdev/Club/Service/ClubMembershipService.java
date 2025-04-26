package com.dev.backdev.Club.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.backdev.Auth.model.User;
import com.dev.backdev.Club.Model.Club;
import com.dev.backdev.Club.Model.ClubMembership;
import com.dev.backdev.Club.Repository.ClubMembershipRepository;
import com.dev.backdev.Club.dto.ClubMembershipDTO;
import com.dev.backdev.Enums.ClubRole;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClubMembershipService {
    private final ClubMembershipRepository membershipRepository;

    public ClubMembership createMembership(User user, Club club, ClubRole role) {
        ClubMembership membership = new ClubMembership();
        membership.setUser(user);
        membership.setClub(club);
        membership.setRole(role);
        return membershipRepository.save(membership);
    }

    public void updateMembershipRole(Long membershipId, ClubRole newRole) {
        ClubMembership membership = membershipRepository.findById(membershipId)
            .orElseThrow(() -> new RuntimeException("Membership not found"));
        membership.setRole(newRole);
        membershipRepository.save(membership);
    }

    @Transactional
    public void removeMembership(Long membershipId) {
        ClubMembership membership = membershipRepository.findById(membershipId)
            .orElseThrow(() -> new RuntimeException("Membership not found"));
        membershipRepository.delete(membership);
    }

    public List<ClubMembershipDTO> getMembersByClub(String clubname) {
        List<ClubMembership> memberships = membershipRepository.findByClubName(clubname);
        return memberships.stream()
            .map(ClubMembershipDTO::new)
            .collect(Collectors.toList());
    }
}
