package com.example.examinify_backend.question;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    @PostMapping("/addQuestion")
    public ResponseEntity<String> addQuestion(@RequestBody Question question, Authentication authentication) {
        question.setCreatedBy(authentication.getName());
        question.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        questionRepository.save(question);
        return ResponseEntity.ok("Question added successfully.");
    }

    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getQuestions(
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) Difficulty difficulty) {
        List<Question> questions;

        if (category != null && difficulty != null) {
            questions = questionRepository.findByCategoryAndDifficulty(category, difficulty);
        } else if (category != null) {
            questions = questionRepository.findByCategory(category);
        } else if (difficulty != null) {
            questions = questionRepository.findByDifficulty(difficulty);
        } else {
            questions = questionRepository.findAll();
        }

        return ResponseEntity.ok(questions);
    }

    @PutMapping("/updateQuestion/{id}")
    public ResponseEntity<String> updateQuestion(@PathVariable int id, @RequestBody Question updatedQuestion) {
        Optional<Question> existingQuestionOpt = questionRepository.findById(id);

        if (existingQuestionOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Question not found.");
        }

        Question existingQuestion = existingQuestionOpt.get();
        existingQuestion.setText(updatedQuestion.getText());
        existingQuestion.setCategory(updatedQuestion.getCategory());
        existingQuestion.setDifficulty(updatedQuestion.getDifficulty());
        existingQuestion.setOptions(updatedQuestion.getOptions());
        existingQuestion.setCorrectAnswer(updatedQuestion.getCorrectAnswer());
        questionRepository.save(existingQuestion);

        return ResponseEntity.ok("Question updated successfully.");
    }

    @DeleteMapping("/deleteQuestion/{id}")
    public ResponseEntity<String> deleteQuestion(@PathVariable int id) {
        if (!questionRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Question not found.");
        }

        questionRepository.deleteById(id);
        return ResponseEntity.ok("Question deleted successfully.");
    }

    @DeleteMapping("/deleteMultipleQuestions")
    public ResponseEntity<String> deleteMultipleQuestions(@RequestBody List<Integer> questionIds) {
        List<Question> questionsToDelete = questionRepository.findAllById(questionIds);

        if (questionsToDelete.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No questions found with the given IDs.");
        }

        questionRepository.deleteAll(questionsToDelete);
        return ResponseEntity.ok("Selected questions deleted successfully.");
    }
}
