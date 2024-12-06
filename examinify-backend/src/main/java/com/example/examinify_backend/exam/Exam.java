package com.example.examinify_backend.exam;

import com.example.examinify_backend.user.UserAccount;
import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer passingCriteria;

    @Column(nullable = false)
    private Integer duration; // In minutes

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExamType type; // MCQ or PROGRAMMING

    @Column(name = "createdBy", nullable = false)
    private String createdBy;

    @Column(nullable = false)
    private Timestamp createdDate;

    @Column(nullable = false)
    private Timestamp lastModifiedDate;

    @ManyToOne
    @JoinColumn(name = "createdBy", referencedColumnName = "username", insertable = false, updatable = false)
    private UserAccount createdByAccount;

    // Getters and setters...

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPassingCriteria() {
        return passingCriteria;
    }

    public void setPassingCriteria(Integer passingCriteria) {
        this.passingCriteria = passingCriteria;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public ExamType getType() {
        return type;
    }

    public void setType(ExamType type) {
        this.type = type;
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

    public Timestamp getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(Timestamp lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public UserAccount getCreatedByAccount() {
        return createdByAccount;
    }

    public void setCreatedByAccount(UserAccount createdByAccount) {
        this.createdByAccount = createdByAccount;
    }
}
