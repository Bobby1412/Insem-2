package com.bookmydoctor.controller;

import com.bookmydoctor.model.User;
import com.bookmydoctor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(new Message("Error: Email already registered"));
        }

        try {
            userRepository.save(user);
            return ResponseEntity.ok(new Message("User registered successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new Message("Server error during registration"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginData) {
        User user = userRepository.findByEmail(loginData.getEmail());

        if (user == null || !user.getPassword().equals(loginData.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(new Message("Error: Invalid email or password"));
        }

        // Return full user profile
        return ResponseEntity.ok(user);
    }

    static class Message {
        private String message;
        public Message(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}