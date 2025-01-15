package com.example.examinify_backend.exam;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;

public interface ExamResultRepository extends JpaRepository<ExamResult, Integer> {
    List<ExamResult> findByExamId(Integer examId);
    List<ExamResult> findByExamIdAndIsPassed(Integer examId, boolean passed);
    List<ExamResult> findByExamIdAndSubmittedOnBetween(Integer examId, Timestamp startDate, Timestamp endDate);
    List<ExamResult> findByExamIdAndIsPassedAndSubmittedOnBetween(Integer examId, boolean passed, Timestamp startDate, Timestamp endDate);
    long countByExamIdAndIsPassed(Integer examId, boolean passed);

    boolean existsByExamIdAndStudentId(Integer examId, String studentId);

    @Query("SELECT r.studentId FROM ExamResult r WHERE r.examId = :examId")
    List<String> findStudentIdsByExamId(@Param("examId") Integer examId);
}