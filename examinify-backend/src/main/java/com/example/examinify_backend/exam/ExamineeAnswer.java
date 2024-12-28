package com.example.examinify_backend.exam;

import com.example.examinify_backend.question.Question;
import com.example.examinify_backend.user.UserAccount;
import jakarta.persistence.*;

@Entity
public class ExamineeAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer examId;

    @Column(nullable = false)
    private Integer questionId;

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

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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
}
