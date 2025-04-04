package com.dev.backdev.enrollment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dev.backdev.enrollment.model.Enrollment;
import com.dev.backdev.enrollment.service.EnrollmentService;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @PostMapping
    public ResponseEntity<Enrollment> createEnrollment(@RequestBody Enrollment enrollment) {
        Enrollment createdEnrollment = enrollmentService.createEnrollment(enrollment);
        return ResponseEntity.ok(createdEnrollment);
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<Enrollment> approveEnrollment(@PathVariable Long id) {
        Enrollment updatedEnrollment = enrollmentService.approveEnrollment(id);
        return ResponseEntity.ok(updatedEnrollment);
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<Enrollment> rejectEnrollment(@PathVariable Long id) {
        Enrollment updatedEnrollment = enrollmentService.rejectEnrollment(id);
        return ResponseEntity.ok(updatedEnrollment);
    }

    @GetMapping
    public ResponseEntity<List<Enrollment>> getAllEnrollments() {
        List<Enrollment> enrollments = enrollmentService.getAllEnrollments();
        return ResponseEntity.ok(enrollments);
    }
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByEvent(@PathVariable Long eventId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByEvent(eventId);
        return ResponseEntity.ok(enrollments);
    }
}