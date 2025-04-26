package com.dev.backdev.Feedback.service;

import org.springframework.stereotype.Service;

import com.dev.backdev.Feedback.model.Feedback;
import com.dev.backdev.Feedback.repository.FeedbackRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    public Feedback saveFeedback(Feedback feedback) {
        feedback.setCreatedAt(LocalDateTime.now());
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll(); // Use the default JPA method
    }
    
    
}
