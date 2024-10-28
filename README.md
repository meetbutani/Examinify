# Examinify

**Examinify** is an online examination platform offering a robust structure to conduct exams, supporting both Multiple Choice Questions (MCQs) and programming assessments. The application includes an administrative interface for examiners to manage questions, exams, and student profiles, alongside an examinee interface that ensures a smooth and secure examination experience.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## Features

### Sections
1. **MCQ (Multiple Choice Questions)**
2. **Programming**

### MCQ Section

#### For Admin / Examiner
1. **Student Profile Management**
   - Admins can create and manage student profiles containing essential data like name, email, student ID, and other relevant information.
   
2. **Question Management**
   - **Enter Questions**: Admins can enter question text into a text area.
   - **Categorize Questions**: Questions are categorized into Logical (Aptitude), Technical, and Programming categories.
   - **Options for Questions**: Each question can have 2 to 4 options.
   - **Input Options**: Admins can enter text for each option.
   - **Correct Answer**: Admins must specify the correct answer for each question.

3. **Exam Management**
   - **Create Exams**: Admins can create a new exam by selecting a specific number of questions from each category.
   - **View Results**: Admins can view summaries and detailed results for all completed exams, with filtering options to facilitate analysis.
   - **Set Passing Criteria**: Admins can set passing criteria and identify students who pass each exam.

#### For Examinees
1. **Question Navigation**
   - **Answer Selection**: Examinees can select one answer from the available options.
   - **Change Answers**: Examinees can change their answers anytime before submitting the exam.
   - **Navigate Questions**: Examinees can move back and forth between questions.

2. **Exam Submission**
   - **Auto-Submit**: Exams will auto-submit when the set time expires.
   - **Prevent Copy-Paste**: The system restricts copy-pasting of questions and answers.

### Programming Section

#### For Admin / Examiner
1. **Programming Question Management**
   - **Enter Programming Questions**: Admins can enter programming questions and provide reference answers (for guidance only, not for automatic code comparison).
   - **Select Programming Questions**: Admins can select programming questions for each exam.
   - **Assign Difficulty Levels**: Admins can assign difficulty levels to each programming question.

2. **Exam Management**
   - Exam management features are the same as in the MCQ section, allowing admins to manage programming questions for exams.

#### For Examinees
1. **Programming Environment**
   - **Answer Input**: Examinees can write code in a programming editor, allowing copy-paste functionality only within the editor environment.

## Technologies

- **Backend**: Java (Spring Boot)
- **Frontend**: React.js
- **Database**: SQL Express
- **Authentication**: JWT-based (JSON Web Token)
- **Version Control**: GitHub

## Getting Started

### Prerequisites
- Java 17+
- Node.js and npm (for React)
- SQL Server Express
- Git

### Backend Setup
1. Clone the repository and navigate to the backend directory:
   ```bash
   git clone https://github.com/yourusername/Examinify.git
   cd Examinify/backend
   ```
2. Configure SQL Express connection in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:sqlserver://localhost;databaseName=ExaminifyDB
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```
3. Build and run the backend:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies and start the development server:
   ```bash
   npm install
   npm start
   ```

### Database Setup
1. Open SQL Server Management Studio and create a new database named `ExaminifyDB`.
2. Spring Boot will automatically generate tables based on entities upon startup.

## Project Structure

### Backend (Spring Boot)
- `src/main/java/com/examinify`: Main source folder containing controllers, services, repositories, and models.
- `src/main/resources`: Configuration files, such as `application.properties`.

### Frontend (React)
- `src/components`: Reusable components for the UI.
- `src/pages`: Main pages, such as Login, Dashboard, Exam Interface, and Results.
- `src/services`: API service files for making HTTP requests to the backend.
- `src/utils`: Utility functions, such as exam timer logic.

## API Endpoints

### Authentication
- **POST** `/api/auth/login`: Login for admins and students.

### Student Profile Management
- **GET** `/api/students`: Get list of students.
- **POST** `/api/students`: Create a new student profile.

### MCQ Question Management
- **GET** `/api/questions`: Get list of questions.
- **POST** `/api/questions`: Add a new MCQ question.

### Exam Management
- **POST** `/api/exams`: Create a new exam.
- **GET** `/api/exams/{id}/results`: View results for a specific exam.

*Note*: Full documentation of endpoints is available in the project folder.

## Contributing
1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add AmazingFeature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a pull request.
