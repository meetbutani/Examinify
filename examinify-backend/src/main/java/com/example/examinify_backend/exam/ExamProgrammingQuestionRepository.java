package com.example.examinify_backend.exam;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamProgrammingQuestionRepository extends JpaRepository<ExamProgrammingQuestion, Integer> {
    List<ExamProgrammingQuestion> findByExamId(Integer examId);
    boolean existsByExamIdAndQuestionId(Integer examId, Integer questionId);
    List<ExamProgrammingQuestion> findByExamIdOrderByQuestionOrder(Integer examId);
}
