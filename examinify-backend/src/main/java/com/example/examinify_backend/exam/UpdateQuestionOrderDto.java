package com.example.examinify_backend.exam;

public class UpdateQuestionOrderDto {
    private Integer examQuestionId;
    private Integer newOrder;
    private Integer marks;

    // Getters and setters
    public Integer getExamQuestionId() {
        return examQuestionId;
    }

    public void setExamQuestionId(Integer examQuestionId) {
        this.examQuestionId = examQuestionId;
    }

    public Integer getNewOrder() {
        return newOrder;
    }

    public void setNewOrder(Integer newOrder) {
        this.newOrder = newOrder;
    }

    public Integer getMarks() {
        return marks;
    }

    public void setMarks(Integer marks) {
        this.marks = marks;
    }
}