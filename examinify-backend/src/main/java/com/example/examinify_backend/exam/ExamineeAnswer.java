package com.example.examinify_backend.exam;

import com.example.examinify_backend.question.Question;
import com.example.examinify_backend.user.UserAccount;
import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@IdClass(ExamineeAnswer.ExamineeAnswerId.class)
public class ExamineeAnswer {

    @Id
    @Column(nullable = false)
    private Integer examId;

    @Id
    @Column(nullable = false)
    private Integer questionId;

    @Id
    @Column(nullable = false)
    private String examineeId;

    @Column(nullable = false)
    private String selectedAnswer;

    @ManyToOne
    @JoinColumn(name = "examId", referencedColumnName = "id", insertable = false, updatable = false)
    private Exam exam;

    @ManyToOne
    @JoinColumn(name = "questionId", referencedColumnName = "id", insertable = false, updatable = false)
    private Question question;

    @ManyToOne
    @JoinColumn(name = "examineeId", referencedColumnName = "username", insertable = false, updatable = false)
    private UserAccount examinee;

    // Getters and setters

    public Integer getExamId() {
        return examId;
    }

    public void setExamId(Integer examId) {
        this.examId = examId;
    }

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public String getExamineeId() {
        return examineeId;
    }

    public void setExamineeId(String examineeId) {
        this.examineeId = examineeId;
    }

    public String getSelectedAnswer() {
        return selectedAnswer;
    }

    public void setSelectedAnswer(String selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public UserAccount getExaminee() {
        return examinee;
    }

    public void setExaminee(UserAccount examinee) {
        this.examinee = examinee;
    }

    // Embedded static class for composite primary key
    public static class ExamineeAnswerId implements Serializable {
        private Integer examId;
        private Integer questionId;
        private String examineeId;

        // Default constructor, equals(), and hashCode()
        public ExamineeAnswerId() {}

        public ExamineeAnswerId(Integer examId, Integer questionId, String examineeId) {
            this.examId = examId;
            this.questionId = questionId;
            this.examineeId = examineeId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            ExamineeAnswerId that = (ExamineeAnswerId) o;
            return examId.equals(that.examId) &&
                    questionId.equals(that.questionId) &&
                    examineeId.equals(that.examineeId);
        }

        @Override
        public int hashCode() {
            return java.util.Objects.hash(examId, questionId, examineeId);
        }
    }
}
