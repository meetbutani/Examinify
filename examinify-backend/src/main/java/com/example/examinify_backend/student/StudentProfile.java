package com.example.examinify_backend.student;

import com.example.examinify_backend.user.UserAccount;
import jakarta.persistence.*;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.sql.Timestamp;

@Entity
public class StudentProfile {

    @Id
    @Column(name = "studentId", nullable = false)
    private String studentId;

    @Column(nullable = false)
    private String firstname;

    @Column(nullable = false)
    private String lastname;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String enrollmentNo;

    @Column(nullable = false)
    private String universityCollegeName;

    @Column(name = "createdBy", nullable = false)
    private String createdBy;

    @Column(nullable = false)
    private Timestamp createdDate;

    @OneToOne
    @JoinColumn(name = "studentId", referencedColumnName = "username", insertable = true, updatable = true)
    @Cascade(CascadeType.ALL)
    private UserAccount studentAccount; // This maps to the UserAccount table for the foreign key

    @ManyToOne
    @JoinColumn(name = "createdBy", referencedColumnName = "username", insertable = false, updatable = false)
    private UserAccount createdByAccount; // This maps to the UserAccount table for the foreign key

    // Constructors, Getters, and Setters

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEnrollmentNo() {
        return enrollmentNo;
    }

    public void setEnrollmentNo(String enrollmentNo) {
        this.enrollmentNo = enrollmentNo;
    }

    public String getUniversityCollegeName() {
        return universityCollegeName;
    }

    public void setUniversityCollegeName(String universityCollegeName) {
        this.universityCollegeName = universityCollegeName;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Timestamp getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Timestamp createdDate) {
        this.createdDate = createdDate;
    }

    public UserAccount getStudentAccount() {
        return studentAccount;
    }

    public UserAccount getCreatedByAccount() {
        return createdByAccount;
    }
}
