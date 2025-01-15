package com.example.examinify_backend.exam;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamStudentRepository extends JpaRepository<ExamStudent, Integer> {
    List<ExamStudent> findByExamId(Integer examId);

    // Finds students by exam ID and a list of student IDs
    List<ExamStudent> findByExamIdAndStudentIdIn(Integer examId, List<String> studentIds);

    List<ExamStudent> findByExamIdAndStudentId(Integer examId, String studentId);

    long countByExamId(Integer examId);

    @Query("SELECT s.studentId FROM ExamStudent s WHERE s.examId = :examId")
    List<String> findStudentIdsByExamId(@Param("examId") Integer examId);
}
