package com.example.examinify_backend.exam;

import com.example.examinify_backend.question.Difficulty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgrammingQuestionRepository extends JpaRepository<ProgrammingQuestion, Integer> {
    // Find programming questions by difficulty
    List<ProgrammingQuestion> findByDifficulty(Difficulty difficulty);
}
