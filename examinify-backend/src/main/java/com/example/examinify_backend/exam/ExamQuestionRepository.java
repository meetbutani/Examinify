package com.example.examinify_backend.exam;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamQuestionRepository extends JpaRepository<ExamQuestion, Integer> {
    List<ExamQuestion> findByExamId(Integer examId);
    boolean existsByExamIdAndQuestionId(Integer examId, Integer questionId);
    List<ExamQuestion> findByExamIdOrderByQuestionOrder(Integer examId);
}