package com.dev.backdev.ClubRequest.Model;


import java.time.LocalDate;
import java.util.List;

import com.dev.backdev.Club.Model.Club;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class ClubRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   
    private String type; 
    @Column(name = "event_name", nullable = false) 
    private String eventName;
        private String description;
        @Column(name = "start_date")

    private LocalDate startDate;  
    @Column(name = "end_date")

    private LocalDate endDate;
        private String location;

    @ElementCollection
    private List<String> committeeTypes;
    @Column(name = "financial_request")

    private boolean financialRequest;
    

    private Double requestedAmount;
        private String status;
        private boolean needEquipment;

        @ElementCollection
        private List<String> requestedEquipment; 
        
    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club;

    public ClubRequest() {}

    public ClubRequest(String type, String eventName, String description, LocalDate startDate, LocalDate endDate, 
                       String location, List<String> committeeTypes, boolean financialRequest, 
                       Double requestedAmount, String status, Club club) {
        this.type = type;
        this.eventName = eventName;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.location = location;
        this.committeeTypes = committeeTypes;
        this.financialRequest = financialRequest;
        this.requestedAmount = requestedAmount;
        this.status = status;
        this.club = club;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public List<String> getCommitteeTypes() { return committeeTypes; }
    public void setCommitteeTypes(List<String> committeeTypes) { this.committeeTypes = committeeTypes; }

    public boolean isFinancialRequest() { return financialRequest; }
    public void setFinancialRequest(boolean financialRequest) { this.financialRequest = financialRequest; }

    public Double getRequestedAmount() { return requestedAmount; }
    public void setRequestedAmount(Double requestedAmount) { this.requestedAmount = requestedAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Club getClub() { return club; }
    public void setClub(Club club) { this.club = club; }
    public boolean isNeedEquipment() {
        return needEquipment;
    }
    
    public void setNeedEquipment(boolean needEquipment) {
        this.needEquipment = needEquipment;
    }
    
    public List<String> getRequestedEquipment() {
        return requestedEquipment;
    }
    
    public void setRequestedEquipment(List<String> requestedEquipment) {
        this.requestedEquipment = requestedEquipment;
    }
    
}
