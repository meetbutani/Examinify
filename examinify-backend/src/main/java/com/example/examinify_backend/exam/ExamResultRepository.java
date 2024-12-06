package com.example.examinify_backend.exam;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamResultRepository extends JpaRepository<ExamResult, Integer> {
    List<ExamResult> findByExamId(Integer examId);
    List<ExamResult> findByStudentUsername(String studentUsername);
}