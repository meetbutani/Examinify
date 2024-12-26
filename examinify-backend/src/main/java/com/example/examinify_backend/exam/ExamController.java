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
import java.util.*;
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

        // Validate that if endDateTime is set, startDateTime must also be set
        if (exam.getEndDateTime() != null && exam.getStartDateTime() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Start date-time must be provided if end date-time is set.");
        }

        examRepository.save(exam);
        return ResponseEntity.ok("Exam created successfully.");
    }

    @GetMapping("/{examId}")
    public ResponseEntity<Exam> getExam(@PathVariable Integer examId) {
        return examRepository.findById(examId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @PostMapping("/addQuestion")
    public ResponseEntity<String> addQuestionToExam(@RequestBody ExamQuestion examQuestion) {
        if (examQuestionRepository.existsByExamIdAndQuestionId(examQuestion.getExamId(), examQuestion.getQuestionId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Question already added to this exam.");
        }
        examQuestionRepository.save(examQuestion);
        return ResponseEntity.ok("Question added to exam successfully.");
    }

    @PatchMapping("/updateQuestionOrder")
    public ResponseEntity<String> updateQuestionOrder(@RequestBody List<UpdateQuestionOrderDto> dtos) {
        for (UpdateQuestionOrderDto dto : dtos) {
            ExamQuestion examQuestion = examQuestionRepository.findById(dto.getExamQuestionId())
                    .orElseThrow(() -> new RuntimeException("Exam Question not found"));

            examQuestion.setQuestionOrder(dto.getNewOrder());
            examQuestion.setMarks(dto.getMarks());
            examQuestionRepository.save(examQuestion);
        }
        return ResponseEntity.ok("All changes saved successfully.");
    }

    @GetMapping("/{examId}/questions")
    public ResponseEntity<List<ExamQuestion>> getExamQuestions(@PathVariable Integer examId) {
        return ResponseEntity.ok(examQuestionRepository.findByExamIdOrderByQuestionOrder(examId));
    }

    @DeleteMapping("/removeQuestion/{examQuestionId}")
    public ResponseEntity<Void> removeQuestionFromExam(@PathVariable Integer examQuestionId) {
        examQuestionRepository.deleteById(examQuestionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{examId}/results")
    public ResponseEntity<List<ExamResult>> getExamResults(@PathVariable Integer examId) {
        return ResponseEntity.ok(examResultRepository.findByExamId(examId));
    }

    @PostMapping("/{examId}/designTest")
    public ResponseEntity<String> designTest(
            @PathVariable Integer examId,
            @RequestBody Map<String, Map<String, Integer>> categoryDifficultyCounts) {

        List<Question> questions = questionRepository.findAll();

        // Filter questions based on the new structure
        List<Question> selectedQuestions = autoPickQuestions(questions, categoryDifficultyCounts);

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
            Map<String, Map<String, Integer>> categoryDifficultyCounts) {

        List<Question> selectedQuestions = new ArrayList<>();

        // Group questions by category and difficulty
        Map<Category, Map<Difficulty, List<Question>>> questionsByCategoryAndDifficulty =
                allQuestions.stream().collect(Collectors.groupingBy(
                        Question::getCategory,
                        Collectors.groupingBy(Question::getDifficulty)
                ));

        // Pick questions for each category-difficulty combination
        for (String category : categoryDifficultyCounts.keySet()) {
            Category categoryEnum = Category.valueOf(category);
            Map<String, Integer> difficultyCounts = categoryDifficultyCounts.get(category);

            for (String difficulty : difficultyCounts.keySet()) {
                Difficulty difficultyEnum = Difficulty.valueOf(difficulty);
                int count = difficultyCounts.get(difficulty);

                List<Question> pool = questionsByCategoryAndDifficulty
                        .getOrDefault(categoryEnum, new HashMap<>())
                        .getOrDefault(difficultyEnum, new ArrayList<>());

                selectedQuestions.addAll(pickRandomQuestions(pool, count));
            }
        }

        return selectedQuestions;
    }

    private List<Question> pickRandomQuestions(List<Question> pool, int count) {
        Collections.shuffle(pool); // Shuffle for randomness
        return pool.stream().limit(count).collect(Collectors.toList());
    }

}
