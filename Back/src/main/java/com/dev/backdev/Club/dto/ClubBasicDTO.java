package com.dev.backdev.Club.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// New minimal DTO for club listing
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClubBasicDTO {
    private Long id;
    private String name;
}

