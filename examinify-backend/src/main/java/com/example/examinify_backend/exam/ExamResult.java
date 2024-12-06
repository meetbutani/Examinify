package com.example.examinify_backend.exam;

import com.example.examinify_backend.user.UserAccount;
import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
public class ExamResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "examId", nullable = false)
    private Integer examId;

    @Column(name = "studentId", nullable = false)
    private String studentId;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false)
    private Boolean isPassed;

    @Column(nullable = false)
    private Timestamp submittedOn;

    @ManyToOne
    @JoinColumn(name = "examId", referencedColumnName = "id", insertable = false, updatable = false)
    private Exam exam;

    @ManyToOne
    @JoinColumn(name = "studentId", referencedColumnName = "username", insertable = false, updatable = false)
    private UserAccount student;

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

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Boolean getPassed() {
        return isPassed;
    }

    public void setPassed(Boolean passed) {
        isPassed = passed;
    }

    public Timestamp getSubmittedOn() {
        return submittedOn;
    }

    public void setSubmittedOn(Timestamp submittedOn) {
        this.submittedOn = submittedOn;
    }

    public Exam getExam() {
        return exam;
    }

    public UserAccount getStudent() {
        return student;
    }
}
