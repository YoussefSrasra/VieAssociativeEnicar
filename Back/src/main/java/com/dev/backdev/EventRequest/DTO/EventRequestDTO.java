package com.dev.backdev.EventRequest.DTO;

import java.time.LocalDateTime;

import javax.swing.event.DocumentEvent.EventType;

import com.dev.backdev.EventRequest.Model.EventRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventRequestDTO {
    private Long id;
    private String clubName;
    private EventRequest.EventType type;
    private String nom;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String location;
    private String description;


}
