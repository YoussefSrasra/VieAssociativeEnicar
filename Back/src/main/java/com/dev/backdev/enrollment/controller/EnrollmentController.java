package com.dev.backdev.enrollment.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dev.backdev.enrollment.model.Enrollment;
//commenntaire 
import com.dev.backdev.enrollment.service.EnrollmentService;

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
    @GetMapping("/{id}")
    public ResponseEntity<Enrollment> getEnrollmentById(@PathVariable Long id) {
        Optional<Enrollment> enrollment = enrollmentService.getEnrollmentById(id);
        return enrollment.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }
    

    // Suppression de la méthode getEnrollmentsByEvent qui n'est plus nécessaire
}