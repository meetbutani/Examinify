package com.example.examinify_backend.admin;

import com.example.examinify_backend.student.StudentProfile;
import com.example.examinify_backend.student.StudentProfileRepository;
import com.example.examinify_backend.user.Role;
import com.example.examinify_backend.user.UserAccount;
import com.example.examinify_backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/createStudentProfile")
    public ResponseEntity<String> createStudentProfile(@RequestBody StudentProfile studentProfile, Authentication authentication) {
        String username = studentProfile.getEnrollmentNo() + "@" + studentProfile.getUniversityCollegeName();

        if (userRepository.existsById(username) || studentProfileRepository.findById(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User account or student profile already exists");
        }

        UserAccount userAccount = new UserAccount();
        userAccount.setUsername(username);
        userAccount.setPassword(passwordEncoder.encode(studentProfile.getEnrollmentNo()));
        userAccount.setRole(Role.EXAMINEE);
        userRepository.save(userAccount);

        studentProfile.setStudentId(username);
        studentProfile.setCreatedBy(authentication.getName());
        studentProfile.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        studentProfileRepository.save(studentProfile);

        return ResponseEntity.ok("Student profile created successfully");
    }

    // Get all student profiles
    @GetMapping("/getAllStudents")
    public ResponseEntity<List<StudentProfile>> getAllStudents() {
        List<StudentProfile> students = studentProfileRepository.findAll();
        return ResponseEntity.ok(students);
    }

    // Update student profile
    @PutMapping("/updateStudentProfile/{studentId}")
    public ResponseEntity<String> updateStudentProfile(@PathVariable String studentId, @RequestBody StudentProfile updatedProfile) {
        Optional<StudentProfile> existingProfileOpt = studentProfileRepository.findById(studentId);
        if (existingProfileOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student profile not found");
        }

        StudentProfile existingProfile = existingProfileOpt.get();
        existingProfile.setFirstname(updatedProfile.getFirstname());
        existingProfile.setLastname(updatedProfile.getLastname());
        existingProfile.setEmail(updatedProfile.getEmail());
        existingProfile.setUniversityCollegeName(updatedProfile.getUniversityCollegeName());

        studentProfileRepository.save(existingProfile);
        return ResponseEntity.ok("Student profile updated successfully");
    }

    // Search students by firstname, lastname, or email
    @GetMapping("/searchStudents")
    public ResponseEntity<List<StudentProfile>> searchStudents(@RequestParam String query) {
        List<StudentProfile> students = studentProfileRepository.findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query, query);
        return ResponseEntity.ok(students);
    }

    // Filter students by university/college name
    @GetMapping("/filterByCollege")
    public ResponseEntity<List<StudentProfile>> filterByCollege(@RequestParam String universityCollegeName) {
        List<StudentProfile> students = studentProfileRepository.findByUniversityCollegeNameContainingIgnoreCase(universityCollegeName);
        return ResponseEntity.ok(students);
    }

    // Delete student profile and associated user account
    @DeleteMapping("/deleteStudentProfile/{studentId}")
    public ResponseEntity<String> deleteStudentProfile(@PathVariable String studentId) {
        Optional<StudentProfile> existingProfileOpt = studentProfileRepository.findById(studentId);
        if (existingProfileOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student profile not found");
        }

        // Delete the associated UserAccount
        Optional<UserAccount> existingUserAccountOpt = userRepository.findById(studentId);
        // Deleting the UserAccount
        existingUserAccountOpt.ifPresent(userAccount -> userRepository.delete(userAccount));

        // Delete the StudentProfile
        studentProfileRepository.delete(existingProfileOpt.get());

        return ResponseEntity.ok("Student profile and associated user account deleted successfully");
    }

    // Delete multiple students and associated user accounts
    @DeleteMapping("/deleteMultipleStudents")
    public ResponseEntity<String> deleteMultipleStudents(@RequestBody List<String> studentIds) {
        // Delete the StudentProfiles
        studentProfileRepository.deleteAllById(studentIds);

        // Delete the associated UserAccounts first
        List<UserAccount> userAccountsToDelete = userRepository.findAllById(studentIds);

        if (userAccountsToDelete.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No students found with the given IDs.");
        }

        userRepository.deleteAll(userAccountsToDelete);

        return ResponseEntity.ok("Selected students and associated user accounts deleted successfully");
    }
//    public ResponseEntity<String> dseleteMultipleStudents(@RequestBody List<String> studentIds) {
//        // Delete the StudentProfiles
//        studentProfileRepository.deleteAllById(studentIds);
//
//        // Delete the associated UserAccounts first
//        for (String studentId : studentIds) {
//            Optional<UserAccount> userAccountOpt = userRepository.findByUsername(studentId);
//            userAccountOpt.ifPresent(userRepository::delete);
//        }
//
//        return ResponseEntity.ok("Selected students and associated user accounts deleted successfully");
//    }

}
