import axios from "axios";

const addDummyQuestions = async () => {
    const token = "valid_JWT_token";

    const questions = [
        {
            text: "What is the capital of France?",
            category: "LOGICAL",
            difficulty: "EASY",
            options: ["Paris", "London", "Berlin", "Rome"],
            correctAnswer: "Paris",
        },
        {
            text: "Which data structure uses LIFO principle?",
            category: "TECHNICAL",
            difficulty: "MEDIUM",
            options: ["Queue", "Stack", "Array", "Heap"],
            correctAnswer: "Stack",
        },
        {
            text: "True or False: JavaScript is a statically-typed language.",
            category: "PROGRAMMING",
            difficulty: "HARD",
            options: ["True", "False"],
            correctAnswer: "False",
        },
        {
            text: "Solve: 12 + 8 ÷ 2 * 3 - 4",
            category: "LOGICAL",
            difficulty: "HARD",
            options: ["16", "22", "20", "14"],
            correctAnswer: "20",
        },
        {
            text: "What does HTML stand for?",
            category: "TECHNICAL",
            difficulty: "EASY",
            options: [
                "HyperText Markup Language",
                "HighText Machine Language",
                "HyperText and links Markup Language",
                "None of these",
            ],
            correctAnswer: "HyperText Markup Language",
        },
        {
            text: "True or False: A function in JavaScript can return multiple values.",
            category: "PROGRAMMING",
            difficulty: "MEDIUM",
            options: ["True", "False"],
            correctAnswer: "True",
        },
        {
            text: "Which sorting algorithm is the fastest in general for large datasets?",
            category: "TECHNICAL",
            difficulty: "HARD",
            options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Insertion Sort"],
            correctAnswer: "Quick Sort",
        },
        {
            text: "What is the result of 2 ** 3 in Python?",
            category: "PROGRAMMING",
            difficulty: "EASY",
            options: ["6", "8", "9", "12"],
            correctAnswer: "8",
        },
        {
            text: "True or False: SQL stands for Structured Query Language.",
            category: "TECHNICAL",
            difficulty: "EASY",
            options: ["True", "False"],
            correctAnswer: "True",
        },
        {
            text: "What is the next term in the series: 1, 1, 2, 3, 5, ?",
            category: "LOGICAL",
            difficulty: "MEDIUM",
            options: ["6", "7", "8", "9"],
            correctAnswer: "8",
        },
    ];

    for (const question of questions) {
        try {
            const response = await axios.post(
                "http://localhost:8081/api/admin/addQuestion",
                { ...question, options: JSON.stringify(question.options) },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(`Question added: ${question.text}`);
        } catch (error) {
            console.error(`Failed to add question: ${question.text}`, error.message);
        }
    }
};

addDummyQuestions();
