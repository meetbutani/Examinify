package com.example.examinify_backend.exam;

import com.example.examinify_backend.question.Question;
import com.example.examinify_backend.question.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/examinee/exam")
@PreAuthorize("hasRole('EXAMINEE')")
public class ExamineeController {
    @Autowired
    private ExamineeAnswerRepository examineeAnswerRepository;

    @Autowired
    private ExamQuestionRepository examQuestionRepository;

    @PostMapping("/{examId}/answer")
    public ResponseEntity<?> saveOrUpdateAnswer(
            @PathVariable Integer examId,
            @RequestParam String examineeId,
            @RequestBody ExamineeAnswer answer
    ) {
        answer.setExamId(examId);
        answer.setExamineeId(examineeId);
        ExamineeAnswer savedAnswer = examineeAnswerRepository.save(answer);
        return ResponseEntity.ok(savedAnswer);
    }

    @GetMapping("/{examId}/questions")
    public ResponseEntity<?> getQuestionsForExaminee(@PathVariable Integer examId) {
        List<ExamQuestion> questions = examQuestionRepository.findByExamId(examId);
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/{examId}/submit")
    public ResponseEntity<?> submitExam(@PathVariable Integer examId, @RequestParam String examineeId) {
        // Handle exam submission logic
        return ResponseEntity.ok("Exam submitted successfully.");
    }
}
