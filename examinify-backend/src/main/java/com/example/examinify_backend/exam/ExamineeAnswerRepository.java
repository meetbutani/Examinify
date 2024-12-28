package com.example.examinify_backend.exam;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamineeAnswerRepository extends JpaRepository<ExamineeAnswer, Integer> {
    List<ExamineeAnswer> findByExamineeIdAndExamId(String examineeId, Integer examId);
}
