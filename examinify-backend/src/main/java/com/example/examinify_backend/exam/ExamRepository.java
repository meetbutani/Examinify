package com.example.examinify_backend.exam;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Integer> {
    List<Exam> findByCreatedBy(String createdBy);
}
