package com.example.examinify_backend.question;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Integer> {

    // Find questions by category and difficulty
    List<Question> findByCategoryAndDifficulty(Category category, Difficulty difficulty);

    // Find questions by category only
    List<Question> findByCategory(Category category);

    // Find questions by difficulty only
    List<Question> findByDifficulty(Difficulty difficulty);
}
