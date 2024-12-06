package com.example.examinify_backend.exam;

import com.example.examinify_backend.question.Category;
import com.example.examinify_backend.question.Difficulty;
import com.example.examinify_backend.question.Question;
import com.example.examinify_backend.question.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/exams")
@PreAuthorize("hasRole('ADMIN')")
public class ExamController {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ExamQuestionRepository examQuestionRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamResultRepository examResultRepository;

    // Get all student profiles
    @GetMapping("/")
    public ResponseEntity<List<Exam>> getAllExams() {
        List<Exam> exams = examRepository.findAll();
        return ResponseEntity.ok(exams);
    }

    @PostMapping("/create")
    public ResponseEntity<String> createExam(@RequestBody Exam exam, Authentication authentication) {
        exam.setCreatedBy(authentication.getName());
        exam.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        exam.setLastModifiedDate(new Timestamp(System.currentTimeMillis()));
        examRepository.save(exam);
        return ResponseEntity.ok("Exam created successfully.");
    }

    @PostMapping("/addQuestion")
    public ResponseEntity<String> addQuestionToExam(@RequestBody ExamQuestion examQuestion) {
        examQuestionRepository.save(examQuestion);
        return ResponseEntity.ok("Question added to exam successfully.");
    }

    @GetMapping("/{examId}/questions")
    public ResponseEntity<List<ExamQuestion>> getExamQuestions(@PathVariable Integer examId) {
        return ResponseEntity.ok(examQuestionRepository.findByExamId(examId));
    }

    @GetMapping("/{examId}")
    public ResponseEntity<Exam> getExam(@PathVariable Integer examId) {
        return examRepository.findById(examId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @GetMapping("/{examId}/results")
    public ResponseEntity<List<ExamResult>> getExamResults(@PathVariable Integer examId) {
        return ResponseEntity.ok(examResultRepository.findByExamId(examId));
    }

    @PostMapping("/{examId}/designTest")
    public ResponseEntity<String> designTest(
            @PathVariable Integer examId,
            @RequestBody DesignTestRequest request) {

        List<Question> questions = questionRepository.findAll();

        // Filter questions by category and difficulty
        List<Question> selectedQuestions = autoPickQuestions(
                questions, request.getCategoryCounts(), request.getDifficultyCounts());

        // Assign questions to the exam
        int order = 1;
        for (Question question : selectedQuestions) {
            ExamQuestion examQuestion = new ExamQuestion();
            examQuestion.setExamId(examId);
            examQuestion.setQuestionId(question.getId());
            examQuestion.setQuestionOrder(order++);
            examQuestionRepository.save(examQuestion);
        }

        return ResponseEntity.ok("Test designed successfully.");
    }

    private List<Question> autoPickQuestions(
            List<Question> allQuestions,
            Map<Category, Integer> categoryCounts,
            Map<Difficulty, Integer> difficultyCounts) {

        List<Question> selectedQuestions = new ArrayList<>();

        // Group questions by category and difficulty
        Map<Category, List<Question>> questionsByCategory = allQuestions.stream()
                .collect(Collectors.groupingBy(Question::getCategory));

        Map<Difficulty, List<Question>> questionsByDifficulty = allQuestions.stream()
                .collect(Collectors.groupingBy(Question::getDifficulty));

        // Pick questions for each category
        for (Category category : categoryCounts.keySet()) {
            List<Question> categoryQuestions = questionsByCategory.getOrDefault(category, new ArrayList<>());
            selectedQuestions.addAll(pickRandomQuestions(categoryQuestions, categoryCounts.get(category)));
        }

        // Pick questions for each difficulty
        for (Difficulty difficulty : difficultyCounts.keySet()) {
            List<Question> difficultyQuestions = questionsByDifficulty.getOrDefault(difficulty, new ArrayList<>());
            selectedQuestions.addAll(pickRandomQuestions(difficultyQuestions, difficultyCounts.get(difficulty)));
        }

        return selectedQuestions;
    }

    private List<Question> pickRandomQuestions(List<Question> pool, int count) {
        Collections.shuffle(pool); // Shuffle for randomness
        return pool.stream().limit(count).collect(Collectors.toList());
    }

}
