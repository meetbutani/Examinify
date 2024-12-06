package com.example.examinify_backend.exam;

import com.example.examinify_backend.question.Category;
import com.example.examinify_backend.question.Difficulty;

import java.util.Map;

public class DesignTestRequest {
    private Map<Category, Integer> categoryCounts; // Desired count of questions per category
    private Map<Difficulty, Integer> difficultyCounts; // Desired count of questions per difficulty

    // Getters and setters...

    public Map<Category, Integer> getCategoryCounts() {
        return categoryCounts;
    }

    public void setCategoryCounts(Map<Category, Integer> categoryCounts) {
        this.categoryCounts = categoryCounts;
    }

    public Map<Difficulty, Integer> getDifficultyCounts() {
        return difficultyCounts;
    }

    public void setDifficultyCounts(Map<Difficulty, Integer> difficultyCounts) {
        this.difficultyCounts = difficultyCounts;
    }
}
