package com.dev.backdev.Feedback.model;


import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

@Entity
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String email;
    private String eventName;
    private String comment;
    private int rating;

    @ElementCollection
    @CollectionTable(name = "feedback_images", joinColumns = @JoinColumn(name = "feedback_id"))
    @Column(name = "image")
    private List<String> images;

    private LocalDateTime createdAt;

 


    public Feedback(Long id, String firstName, String lastName, String email, String eventName, String comment,
            int rating, List<String> images, LocalDateTime createdAt) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.eventName = eventName;
        this.comment = comment;
        this.rating = rating;
        this.images = images;
        this.createdAt = createdAt;
    }
    public Feedback() {
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public Long getId() {
        return id;
    }
    public String getFirstName() {
        return firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public String getEmail() {
        return email;
    }
    public String getEventName() {
        return eventName;
    }
    public String getComment() {
        return comment;
    }
    public int getRating() {
        return rating;
    }
    public List<String> getImages() {
        return images;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setEventName(String eventName) {
        this.eventName = eventName;
    }
    public void setComment(String comment) {
        this.comment = comment;
    }
    public void setRating(int rating) {
        this.rating = rating;
    }
    public void setImages(List<String> images) {
        this.images = images;
    }
    
    
}