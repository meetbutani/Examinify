package com.example.examinify_backend.exam;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamStudentRepository extends JpaRepository<ExamStudent, Integer> {
    List<ExamStudent> findByExamId(Integer examId);

    // Finds students by exam ID and a list of student IDs
    List<ExamStudent> findByExamIdAndStudentIdIn(Integer examId, List<String> studentIds);

    List<ExamStudent> findByExamIdAndStudentId(Integer examId, String studentId);
}
