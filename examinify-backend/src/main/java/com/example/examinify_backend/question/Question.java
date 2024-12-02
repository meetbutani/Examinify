package com.example.examinify_backend.question;

import com.example.examinify_backend.user.UserAccount;
import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Lob
    @Column(nullable = false)
    private String options; // JSON format for multiple options

    @Column(nullable = false)
    private String correctAnswer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Column(name = "createdBy", nullable = false)
    private String createdBy;

    @Column(nullable = false)
    private Timestamp createdDate;

    @ManyToOne
    @JoinColumn(name = "createdBy", referencedColumnName = "username", insertable = false, updatable = false)
    private UserAccount createdByAccount; // This maps to the UserAccount table for the foreign key

    // Getters and Setters
    // Constructors

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getOptions() {
        return options;
    }

    public void setOptions(String options) {
        this.options = options;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
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

    public UserAccount getCreatedByAccount() {
        return createdByAccount;
    }
}

