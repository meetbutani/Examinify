package com.example.examinify_backend.student;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, String> {
    Optional<StudentProfile> findByStudentId(String studentId);

    // Search by firstname, lastname, or email containing the given query (case-insensitive)
    List<StudentProfile> findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String firstname, String lastname, String email);

    // Filter by university/college name
    List<StudentProfile> findByUniversityCollegeName(String universityCollegeName);
}

