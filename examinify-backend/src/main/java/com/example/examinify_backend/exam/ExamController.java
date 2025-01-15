package com.example.examinify_backend.exam;

import com.example.examinify_backend.question.Category;
import com.example.examinify_backend.question.Difficulty;
import com.example.examinify_backend.question.Question;
import com.example.examinify_backend.question.QuestionRepository;
import com.example.examinify_backend.student.StudentProfile;
import com.example.examinify_backend.student.StudentProfileRepository;
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
    private ExamProgrammingQuestionRepository examProgrammingQuestionRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamResultRepository examResultRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private ExamStudentRepository examStudentRepository;
    @Autowired
    private ProgrammingQuestionRepository programmingQuestionRepository;

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

    @PutMapping("/{examId}")
    public ResponseEntity<String> updateExam(@PathVariable Integer examId, @RequestBody Exam updatedExam, Authentication authentication) {
        return examRepository.findById(examId)
                .map(existingExam -> {
                    existingExam.setName(updatedExam.getName());
                    existingExam.setDuration(updatedExam.getDuration());
                    existingExam.setPassingCriteria(updatedExam.getPassingCriteria());
                    existingExam.setType(updatedExam.getType());
                    existingExam.setStartDateTime(updatedExam.getStartDateTime());
                    existingExam.setEndDateTime(updatedExam.getEndDateTime());
                    existingExam.setLastModifiedDate(new Timestamp(System.currentTimeMillis()));

                    examRepository.save(existingExam);
                    return ResponseEntity.ok("Exam updated successfully.");
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exam not found."));
    }

    @DeleteMapping("/{examId}")
    public ResponseEntity<String> deleteExam(@PathVariable Integer examId) {
        return examRepository.findById(examId)
                .map(exam -> {
                    examRepository.delete(exam);
                    return ResponseEntity.ok("Exam deleted successfully.");
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exam not found."));
    }

    @PostMapping("/addQuestion")
    public ResponseEntity<String> addQuestionToExam(@RequestBody ExamQuestion examQuestion) {
        if (examQuestionRepository.existsByExamIdAndQuestionId(examQuestion.getExamId(), examQuestion.getQuestionId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Question already added to this exam.");
        }
        examQuestionRepository.save(examQuestion);
        return ResponseEntity.ok("Question added to exam successfully.");
    }

    @PostMapping("/addProgrammingQuestion")
    public ResponseEntity<String> addProgrammingQuestionToExam(@RequestBody ExamProgrammingQuestion examQuestion) {
        if (examProgrammingQuestionRepository.existsByExamIdAndQuestionId(examQuestion.getExamId(), examQuestion.getQuestionId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Question already added to this exam.");
        }
        examProgrammingQuestionRepository.save(examQuestion);
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

    @PatchMapping("/updateProgrammingQuestionOrder")
    public ResponseEntity<String> updateProgrammingQuestionOrder(@RequestBody List<UpdateQuestionOrderDto> dtos) {
        for (UpdateQuestionOrderDto dto : dtos) {
            ExamProgrammingQuestion examProgrammingQuestion = examProgrammingQuestionRepository.findById(dto.getExamQuestionId())
                    .orElseThrow(() -> new RuntimeException("Exam Question not found"));

            examProgrammingQuestion.setQuestionOrder(dto.getNewOrder());
            examProgrammingQuestion.setMarks(dto.getMarks());
            examProgrammingQuestionRepository.save(examProgrammingQuestion);
        }
        return ResponseEntity.ok("All changes saved successfully.");
    }

    @GetMapping("/{examId}/questions")
    public ResponseEntity<List<ExamQuestion>> getExamQuestions(@PathVariable Integer examId) {
        return ResponseEntity.ok(examQuestionRepository.findByExamIdOrderByQuestionOrder(examId));
    }

    @GetMapping("/{examId}/programming-questions")
    public ResponseEntity<List<ExamProgrammingQuestion>> getExamProgrammingQuestions(@PathVariable Integer examId) {
        return ResponseEntity.ok(examProgrammingQuestionRepository.findByExamIdOrderByQuestionOrder(examId));
    }

    @DeleteMapping("/removeQuestion/{examQuestionId}")
    public ResponseEntity<Void> removeQuestionFromExam(@PathVariable Integer examQuestionId) {
        examQuestionRepository.deleteById(examQuestionId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/removeProgrammingQuestion/{examQuestionId}")
    public ResponseEntity<Void> removeProgrammingQuestionFromExam(@PathVariable Integer examQuestionId) {
        examProgrammingQuestionRepository.deleteById(examQuestionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{examId}/results")
    public ResponseEntity<List<ExamResult>> getExamResults(@PathVariable Integer examId) {
        return ResponseEntity.ok(examResultRepository.findByExamId(examId));
    }

    @GetMapping("/students")
    public List<StudentProfile> getAllStudents() {
        return studentProfileRepository.findAll();
    }

    @GetMapping("/students/{examId}")
    public List<ExamStudent> getStudentsForExam(@PathVariable Integer examId) {
        return examStudentRepository.findByExamId(examId);
    }

    @PostMapping("/remove-students/{examId}")
    public ResponseEntity<?> removeStudentsFromExam(@PathVariable Integer examId, @RequestBody List<String> studentIds) {
        List<ExamStudent> studentsToDelete = examStudentRepository.findByExamIdAndStudentIdIn(examId, studentIds);
        examStudentRepository.deleteAll(studentsToDelete);
        return ResponseEntity.ok("Selected students removed successfully.");
    }

    @PostMapping("/assign-students/{examId}")
    public ResponseEntity<?> assignStudentsToExam(@PathVariable Integer examId, @RequestBody List<String> studentIds) {
        List<ExamStudent> examStudents = studentIds.stream()
                .map(studentId -> {
                    ExamStudent examStudent = new ExamStudent();
                    examStudent.setExamId(examId);
                    examStudent.setStudentId(studentId);
                    return examStudent;
                })
                .collect(Collectors.toList());
        examStudentRepository.saveAll(examStudents);
        return ResponseEntity.ok("Students assigned successfully.");
    }

    // Get results for a specific exam
    @GetMapping("/results/{examId}")
    public ResponseEntity<?> getResultsByExamId(@PathVariable Integer examId) {
        List<ExamResult> results = examResultRepository.findByExamId(examId);
        if (results.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No results found for this exam.");
        }
        return ResponseEntity.ok(results);
    }

    @GetMapping("/results/{examId}/summary")
    public ResponseEntity<?> getExamSummary(@PathVariable Integer examId) {
        long totalStudents = examStudentRepository.countByExamId(examId);
        long totalPassed = examResultRepository.countByExamIdAndIsPassed(examId, true);
        long totalFailed = totalStudents - totalPassed;

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalStudents", totalStudents);
        summary.put("totalPassed", totalPassed);
        summary.put("totalFailed", totalFailed);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/{examId}/not-attempted")
    public ResponseEntity<?> getStudentsNotAttempted(@PathVariable Integer examId) {
        List<String> allAssignedStudentIds = examStudentRepository.findStudentIdsByExamId(examId);
        List<String> studentsAttempted = examResultRepository.findStudentIdsByExamId(examId);

        allAssignedStudentIds.removeAll(studentsAttempted);

        Map<String, Object> result = new HashMap<>();
        result.put("totalNotAttempted", allAssignedStudentIds.size());
        result.put("students", allAssignedStudentIds);

        return ResponseEntity.ok(result);
    }

    // Filter results by passed/failed
    @GetMapping("/results/{examId}/filter")
    public ResponseEntity<?> getResultsByFilter(@PathVariable Integer examId,
                                                @RequestParam(required = false) Boolean passed,
                                                @RequestParam(required = false) String startDate,
                                                @RequestParam(required = false) String endDate) {
        List<ExamResult> results;

        if (startDate != null && endDate != null) {
            Timestamp start = Timestamp.valueOf(startDate);
            Timestamp end = Timestamp.valueOf(endDate);
            if (passed != null) {
                results = examResultRepository.findByExamIdAndIsPassedAndSubmittedOnBetween(examId, passed, start, end);
            } else {
                results = examResultRepository.findByExamIdAndSubmittedOnBetween(examId, start, end);
            }
        } else if (passed != null) {
            results = examResultRepository.findByExamIdAndIsPassed(examId, passed);
        } else {
            results = examResultRepository.findByExamId(examId);
        }

        if (results.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No matching results found.");
        }
        return ResponseEntity.ok(results);
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

    @PostMapping("/{examId}/designProgrammingTest")
    public ResponseEntity<String> designProgrammingTest(
            @PathVariable Integer examId,
            @RequestBody Map<String, Integer> difficultyCounts) {

        List<ProgrammingQuestion> allProgrammingQuestions = programmingQuestionRepository.findAll();

        // Pick questions based on difficulty
        List<ProgrammingQuestion> selectedQuestions = autoPickProgrammingQuestions(allProgrammingQuestions, difficultyCounts);

        // Assign selected questions to the exam
        int order = 1;
        for (ProgrammingQuestion question : selectedQuestions) {
            ExamProgrammingQuestion examProgrammingQuestion = new ExamProgrammingQuestion();
            examProgrammingQuestion.setExamId(examId);
            examProgrammingQuestion.setQuestionId(question.getId());
            examProgrammingQuestion.setQuestionOrder(order++);
            examProgrammingQuestionRepository.save(examProgrammingQuestion);
        }

        return ResponseEntity.ok("Programming test designed successfully.");
    }

    private List<ProgrammingQuestion> autoPickProgrammingQuestions(
            List<ProgrammingQuestion> allQuestions,
            Map<String, Integer> difficultyCounts) {

        List<ProgrammingQuestion> selectedQuestions = new ArrayList<>();

        // Group questions by difficulty
        Map<Difficulty, List<ProgrammingQuestion>> questionsByDifficulty = allQuestions.stream()
                .collect(Collectors.groupingBy(ProgrammingQuestion::getDifficulty));

        // Pick questions for each difficulty level
        for (String difficulty : difficultyCounts.keySet()) {
            Difficulty difficultyEnum = Difficulty.valueOf(difficulty);
            int count = difficultyCounts.get(difficulty);

            List<ProgrammingQuestion> pool = questionsByDifficulty.getOrDefault(difficultyEnum, new ArrayList<>());

            selectedQuestions.addAll(pickRandomProgrammingQuestions(pool, count));
        }

        return selectedQuestions;
    }

    private List<ProgrammingQuestion> pickRandomProgrammingQuestions(List<ProgrammingQuestion> pool, int count) {
        Collections.shuffle(pool); // Shuffle for randomness
        return pool.stream().limit(count).collect(Collectors.toList());
    }
}
