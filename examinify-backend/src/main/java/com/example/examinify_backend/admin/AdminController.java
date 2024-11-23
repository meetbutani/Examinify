package com.example.examinify_backend.admin;

import com.example.examinify_backend.user.UserAccount;
import com.example.examinify_backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/addUser")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> addUser(@RequestBody UserAccount newUser) {
        if (userRepository.existsById(newUser.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User already exists");
        }
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword())); // Encrypt password
        userRepository.save(newUser);
        return ResponseEntity.ok("User added successfully");
    }
}
