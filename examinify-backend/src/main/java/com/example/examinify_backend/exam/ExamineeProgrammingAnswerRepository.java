package com.example.examinify_backend.exam;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamineeProgrammingAnswerRepository extends JpaRepository<ExamineeProgrammingAnswer, Integer> {
    List<ExamineeProgrammingAnswer> findByExamIdAndExamineeId(Integer examId, String examineeId);
}
