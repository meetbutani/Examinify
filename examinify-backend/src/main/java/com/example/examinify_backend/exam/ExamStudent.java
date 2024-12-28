package com.example.examinify_backend.exam;

import com.example.examinify_backend.student.StudentProfile;
import jakarta.persistence.*;

@Entity
@Table(
        name = "exam_student",
        uniqueConstraints = @UniqueConstraint(columnNames = {"examId", "studentId"})
)
public class ExamStudent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "examId", nullable = false)
    private Integer examId;

    @Column(name = "studentId", nullable = false)
    private String studentId;

    @ManyToOne
    @JoinColumn(name = "examId", referencedColumnName = "id", insertable = false, updatable = false)
    private Exam exam;

    @ManyToOne
    @JoinColumn(name = "studentId", referencedColumnName = "studentId", insertable = false, updatable = false)
    private StudentProfile student;

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

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }

    public StudentProfile getStudent() {
        return student;
    }

    public void setStudent(StudentProfile student) {
        this.student = student;
    }
}
