package com.example.examinify_backend.exam;

import com.example.examinify_backend.question.Difficulty;
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
public class ProgrammingQuestionController {

    @Autowired
    private ProgrammingQuestionRepository programmingQuestionRepository;

    @PostMapping("/addProgrammingQuestion")
    public ResponseEntity<String> addProgrammingQuestion(
            @RequestBody ProgrammingQuestion programmingQuestion,
            Authentication authentication) {

        programmingQuestion.setCreatedBy(authentication.getName());
        programmingQuestion.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        programmingQuestionRepository.save(programmingQuestion);

        return ResponseEntity.ok("Programming question added successfully.");
    }

    @GetMapping("/programmingQuestions")
    public ResponseEntity<List<ProgrammingQuestion>> getProgrammingQuestions(
            @RequestParam(required = false) Difficulty difficulty) {

        List<ProgrammingQuestion> questions;
        if (difficulty != null) {
            questions = programmingQuestionRepository.findByDifficulty(difficulty);
        } else {
            questions = programmingQuestionRepository.findAll();
        }

        return ResponseEntity.ok(questions);
    }

    @PutMapping("/updateProgrammingQuestion/{id}")
    public ResponseEntity<String> updateProgrammingQuestion(
            @PathVariable int id,
            @RequestBody ProgrammingQuestion updatedProgrammingQuestion) {

        Optional<ProgrammingQuestion> existingQuestionOpt = programmingQuestionRepository.findById(id);

        if (existingQuestionOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Programming question not found.");
        }

        ProgrammingQuestion existingQuestion = existingQuestionOpt.get();
        existingQuestion.setTitle(updatedProgrammingQuestion.getTitle());
        existingQuestion.setDescription(updatedProgrammingQuestion.getDescription());
        existingQuestion.setDifficulty(updatedProgrammingQuestion.getDifficulty());
        existingQuestion.setSampleTestCases(updatedProgrammingQuestion.getSampleTestCases());
        existingQuestion.setConstraints(updatedProgrammingQuestion.getConstraints());
        existingQuestion.setHiddenTestCases(updatedProgrammingQuestion.getHiddenTestCases());

        programmingQuestionRepository.save(existingQuestion);

        return ResponseEntity.ok("Programming question updated successfully.");
    }

    @DeleteMapping("/deleteProgrammingQuestion/{id}")
    public ResponseEntity<String> deleteProgrammingQuestion(@PathVariable int id) {
        if (!programmingQuestionRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Programming question not found.");
        }

        programmingQuestionRepository.deleteById(id);
        return ResponseEntity.ok("Programming question deleted successfully.");
    }

    @DeleteMapping("/deleteMultipleProgrammingQuestions")
    public ResponseEntity<String> deleteMultipleProgrammingQuestions(@RequestBody List<Integer> questionIds) {
        List<ProgrammingQuestion> questionsToDelete = programmingQuestionRepository.findAllById(questionIds);

        if (questionsToDelete.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No programming questions found with the given IDs.");
        }

        programmingQuestionRepository.deleteAll(questionsToDelete);
        return ResponseEntity.ok("Selected programming questions deleted successfully.");
    }
}
