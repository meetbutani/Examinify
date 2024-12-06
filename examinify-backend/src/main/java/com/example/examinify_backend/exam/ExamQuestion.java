package com.example.examinify_backend.exam;

import com.example.examinify_backend.question.Question;
import jakarta.persistence.*;

@Entity
public class ExamQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "examId", nullable = false)
    private Integer examId;

    @Column(nullable = false)
    private Integer questionOrder;

    @Column(name = "questionId", nullable = false)
    private Integer questionId;

    @ManyToOne
    @JoinColumn(name = "examId", referencedColumnName = "id", insertable = false, updatable = false)
    private Exam examIdExam; // This maps to the Exam table for the foreign key

    @ManyToOne
    @JoinColumn(name = "questionId", referencedColumnName = "id", insertable = false, updatable = false)
    private Question questionIdQuestion; // This maps to the Question table for the foreign key

    // Getters and setters...

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

    public Integer getQuestionOrder() {
        return questionOrder;
    }

    public void setQuestionOrder(Integer questionOrder) {
        this.questionOrder = questionOrder;
    }

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public Exam getExamIdExam() {
        return examIdExam;
    }

    public Question getQuestionIdQuestion() {
        return questionIdQuestion;
    }
}
