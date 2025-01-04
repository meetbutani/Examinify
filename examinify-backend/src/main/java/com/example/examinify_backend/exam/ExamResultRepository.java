package com.example.examinify_backend.exam;

import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Timestamp;
import java.util.List;

public interface ExamResultRepository extends JpaRepository<ExamResult, Integer> {
    List<ExamResult> findByExamId(Integer examId);
    List<ExamResult> findByExamIdAndIsPassed(Integer examId, boolean passed);
    List<ExamResult> findByExamIdAndSubmittedOnBetween(Integer examId, Timestamp startDate, Timestamp endDate);
    List<ExamResult> findByExamIdAndIsPassedAndSubmittedOnBetween(Integer examId, boolean passed, Timestamp startDate, Timestamp endDate);

    boolean existsByExamIdAndStudentId(Integer examId, String studentId);
}