package com.example.examinify_backend.exam;

import com.example.examinify_backend.user.UserAccount;
import jakarta.persistence.*;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@IdClass(ExamResult.ExamResultKey.class)
public class ExamResult {
    @Id
    @Column(name = "examId", nullable = false)
    private Integer examId;

    @Id
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

    public static class ExamResultKey implements Serializable {
        private Integer examId;
        private String studentId;

        // Default constructor
        public ExamResultKey() {}

        public ExamResultKey(Integer examId, String studentId) {
            this.examId = examId;
            this.studentId = studentId;
        }

        // Getters and setters
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

        // Equals and hashCode (required for composite keys)
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            ExamResultKey that = (ExamResultKey) o;
            return Objects.equals(examId, that.examId) && Objects.equals(studentId, that.studentId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(examId, studentId);
        }
    }
}
