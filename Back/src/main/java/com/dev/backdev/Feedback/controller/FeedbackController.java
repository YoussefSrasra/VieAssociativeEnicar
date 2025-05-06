package com.dev.backdev.Feedback.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backdev.Feedback.model.Feedback;
import com.dev.backdev.Feedback.service.FeedbackService;

@RestController
@RequestMapping("/api/feedbacks")
@CrossOrigin(origins = "http://localhost:4200")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<Feedback> createFeedback(@RequestBody Feedback feedback) {
        Feedback savedFeedback = feedbackService.saveFeedback(feedback);
        return ResponseEntity.ok(savedFeedback);
    }


    @GetMapping
    public ResponseEntity<?> getAllFeedbacks() {
        try {
            List<Feedback> feedbackList = feedbackService.getAllFeedback();
            return ResponseEntity.ok(feedbackList);
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error fetching feedbacks: " + e.getMessage());
        }
    }
    
    
    
}