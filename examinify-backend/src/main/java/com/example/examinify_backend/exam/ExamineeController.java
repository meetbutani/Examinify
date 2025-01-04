package com.example.examinify_backend.exam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/examinee/exam")
@PreAuthorize("hasRole('EXAMINEE')")
public class ExamineeController {
    @Autowired
    private ExamineeAnswerRepository examineeAnswerRepository;

    @Autowired
    private ExamQuestionRepository examQuestionRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ExamResultRepository examResultRepository;

    @Autowired
    private ExamProgrammingQuestionRepository examProgrammingQuestionRepository;

    @Autowired
    private ExamineeProgrammingAnswerRepository examineeProgrammingAnswerRepository;

    @Autowired
    private ExamStudentRepository examStudentRepository;

    @GetMapping("/{examineeId}/exams")
    public ResponseEntity<?> getAvailableExams(@PathVariable String examineeId) {
        List<Exam> availableExams = examRepository.findAvailableExamsForExaminee(examineeId);
        return ResponseEntity.ok(availableExams);
    }

    @PostMapping("/{examId}/answer")
    public ResponseEntity<?> saveOrUpdateAnswer(
            @PathVariable Integer examId,
            @RequestBody ExamineeAnswer answer
    ) {
        answer.setExamId(examId);

        if (answer.getSelectedAnswer() == null || answer.getSelectedAnswer().isEmpty()) {
            return ResponseEntity.badRequest().body("Selected answer cannot be empty.");
        }

        examineeAnswerRepository.save(answer);
        return ResponseEntity.ok("Answer saved or updated successfully.");
    }

    @PostMapping("/{examId}/programming-answer")
    public ResponseEntity<?> saveOrUpdateProgrammingAnswer(
            @PathVariable Integer examId,
            @RequestBody ExamineeProgrammingAnswer answer
    ) {
        answer.setExamId(examId);

        if (answer.getSubmittedCode() == null || answer.getSubmittedCode().isEmpty()) {
            answer.setIsPassed(false);
        } else {
            // check that code is correct or not based on that set pass or not
            answer.setIsPassed(true);
        }

        examineeProgrammingAnswerRepository.save(answer);
        return ResponseEntity.ok("Answer saved or updated successfully.");
    }

    @GetMapping("/{examId}/questions")
    public ResponseEntity<?> getQuestionsForExaminee(@PathVariable Integer examId) {
        List<ExamQuestion> questions = examQuestionRepository.findByExamId(examId);
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/{examId}/programming-questions")
    public ResponseEntity<?> getProgrammingQuestionsForExaminee(@PathVariable Integer examId) {
        List<ExamProgrammingQuestion> questions = examProgrammingQuestionRepository.findByExamId(examId);
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/{examId}/status/{studentId}")
    public ResponseEntity<Map<String, Object>> checkExamStatus(
            @PathVariable Integer examId,
            @PathVariable String studentId,
            @RequestHeader("IP-Address") String ipAddress) {

        Map<String, Object> response = new HashMap<>();

        boolean hasSubmitted = examResultRepository.existsByExamIdAndStudentId(examId, studentId);

        if (hasSubmitted) {
            response.put("status", "error");
            response.put("message", "Exam already taken.");
            return ResponseEntity.ok(response);
        }

        List<ExamStudent> optionalExamStudent = examStudentRepository.findByExamIdAndStudentId(examId, studentId);

        if (optionalExamStudent.isEmpty()) {
            response.put("status", "error");
            response.put("message", "Examinee is not registered for this exam.");
            return ResponseEntity.ok(response);
        }

        ExamStudent examStudent = optionalExamStudent.getFirst();

        long examDuration = examRepository.findById(examId)
                .map(Exam::getDuration) // Duration in minutes
                .orElse(0);

        if (examStudent.getStartedAt() == null) {
            // Start the exam for the first time
            examStudent.setStartedAt(new Timestamp(System.currentTimeMillis()));
            examStudent.setIpAddress(ipAddress);
            examStudentRepository.save(examStudent);

            response.put("status", "success");
            response.put("message", "Exam started successfully.");
            response.put("timeLeft", (examDuration * 60));
            return ResponseEntity.ok(response);
        } else {
            // Check time left and validate MAC address
            long elapsedSeconds = (System.currentTimeMillis() - examStudent.getStartedAt().getTime()) / (1000);

            if (elapsedSeconds >= (examDuration * 60)) {
                response.put("status", "error");
                response.put("message", "Exam time is over.");
                return ResponseEntity.ok(response);
            }

            if (!examStudent.getIpAddress().equals(ipAddress)) {
                response.put("status", "error");
                response.put("message", "Unauthorized device detected.");
                return ResponseEntity.ok(response);
            }

            response.put("status", "success");
            response.put("message", "Access granted.");
            response.put("timeLeft", (examDuration * 60) - elapsedSeconds);
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/{examId}/submit")
    public ResponseEntity<?> submitExam(@PathVariable Integer examId, @RequestBody String examineeId) {
        // Fetch all submitted answers for the examinee
        List<ExamineeAnswer> submittedAnswers = examineeAnswerRepository.findByExamIdAndExamineeId(examId, examineeId);

        if (submittedAnswers.isEmpty()) {
            return ResponseEntity.badRequest().body("No answers submitted for this exam.");
        }

        // Fetch the exam details
        Optional<Exam> optionalExam = examRepository.findById(examId);
        if (optionalExam.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid exam ID.");
        }

        Exam exam = optionalExam.get();

        // Fetch all exam questions
        List<ExamQuestion> examQuestions = examQuestionRepository.findByExamId(examId);

        if (examQuestions.isEmpty()) {
            return ResponseEntity.badRequest().body("No questions found for this exam.");
        }

        // Calculate the score
        AtomicInteger score = new AtomicInteger();
        for (ExamineeAnswer answer : submittedAnswers) {
            examQuestions.stream()
                    .filter(eq -> eq.getQuestionId().equals(answer.getQuestionId()))
                    .findFirst()
                    .ifPresent(eq -> {
                        if (eq.getQuestionIdQuestion().getCorrectAnswer().equals(answer.getSelectedAnswer())) {
                            score.getAndAdd(eq.getMarks()); // Increment score by the marks of the question
                        }
                    });
        }

        // Determine passing status
        boolean isPassed = score.get() >= exam.getPassingCriteria();

        // Create and save the exam result
        ExamResult result = new ExamResult();
        result.setExamId(examId);
        result.setStudentId(examineeId);
        result.setScore(score.get());
        result.setPassed(isPassed);
        result.setSubmittedOn(new Timestamp(System.currentTimeMillis()));

        examResultRepository.save(result);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/{examId}/submit-programming")
    public ResponseEntity<?> submitProgrammingExam(@PathVariable Integer examId, @RequestBody String examineeId) {
        // Fetch all submitted programming answers for the examinee
        List<ExamineeProgrammingAnswer> submittedAnswers = examineeProgrammingAnswerRepository.findByExamIdAndExamineeId(examId, examineeId);

        if (submittedAnswers.isEmpty()) {
            return ResponseEntity.badRequest().body("No answers submitted for this exam.");
        }

        // Fetch the exam details
        Optional<Exam> optionalExam = examRepository.findById(examId);
        if (optionalExam.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid exam ID.");
        }

        Exam exam = optionalExam.get();

        // Fetch all programming questions for the exam
        List<ExamProgrammingQuestion> examQuestions = examProgrammingQuestionRepository.findByExamId(examId);

        if (examQuestions.isEmpty()) {
            return ResponseEntity.badRequest().body("No questions found for this exam.");
        }

        // Calculate the score
        AtomicInteger score = new AtomicInteger();
        for (ExamineeProgrammingAnswer answer : submittedAnswers) {
            examQuestions.stream()
                    .filter(eq -> eq.getQuestionId().equals(answer.getQuestionId()))
                    .findFirst()
                    .ifPresent(eq -> {
                        if (answer.getIsPassed()) {
                            score.getAndAdd(eq.getMarks()); // Increment score by the marks of the question
                        }
                    });
        }

        // Determine passing status
        boolean isPassed = score.get() >= exam.getPassingCriteria();

        // Create and save the exam result
        ExamResult result = new ExamResult();
        result.setExamId(examId);
        result.setStudentId(examineeId);
        result.setScore(score.get());
        result.setPassed(isPassed);
        result.setSubmittedOn(new Timestamp(System.currentTimeMillis()));

        examResultRepository.save(result);

        return ResponseEntity.ok(result);
    }
}
