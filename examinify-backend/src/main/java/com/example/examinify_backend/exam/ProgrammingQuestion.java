package com.example.examinify_backend.exam;

import com.example.examinify_backend.question.Difficulty;
import com.example.examinify_backend.user.UserAccount;
import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
public class ProgrammingQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String sampleTestCases; // JSON format for sample test cases

    @Column(nullable = false, columnDefinition = "TEXT")
    private String constraints;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String hiddenTestCases; // JSON format for hidden test cases

    @Column(nullable = false)
    private Timestamp createdDate;

    @Column(name = "createdBy", nullable = false)
    private String createdBy;

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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }

    public String getSampleTestCases() {
        return sampleTestCases;
    }

    public void setSampleTestCases(String sampleTestCases) {
        this.sampleTestCases = sampleTestCases;
    }

    public String getConstraints() {
        return constraints;
    }

    public void setConstraints(String constraints) {
        this.constraints = constraints;
    }

    public String getHiddenTestCases() {
        return hiddenTestCases;
    }

    public void setHiddenTestCases(String hiddenTestCases) {
        this.hiddenTestCases = hiddenTestCases;
    }

    public Timestamp getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Timestamp createdDate) {
        this.createdDate = createdDate;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public UserAccount getCreatedByAccount() {
        return createdByAccount;
    }

    public void setCreatedByAccount(UserAccount createdByAccount) {
        this.createdByAccount = createdByAccount;
    }
}
