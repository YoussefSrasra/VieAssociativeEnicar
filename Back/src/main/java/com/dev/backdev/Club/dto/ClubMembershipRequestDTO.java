package com.dev.backdev.Club.dto;

import com.dev.backdev.Enums.ClubRole;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClubMembershipRequestDTO {
        private Long userId;
        private Long clubId;
        private ClubRole role;

}
