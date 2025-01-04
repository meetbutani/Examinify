package com.example.examinify_backend.exam;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Integer> {
    @Query("SELECT e FROM Exam e JOIN ExamStudent es ON e.id = es.examId WHERE es.studentId = :examineeId AND e.startDateTime IS NOT NULL")
//                  AND e.startDateTime <= CURRENT_TIMESTAMP
//                  AND (e.endDateTime IS NULL OR e.endDateTime >= CURRENT_TIMESTAMP)
    List<Exam> findAvailableExamsForExaminee(@Param("examineeId") String examineeId);

}
