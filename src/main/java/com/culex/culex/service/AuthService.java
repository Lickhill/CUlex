package com.culex.culex.service;

import com.culex.culex.dto.AuthResponse;
import com.culex.culex.dto.LoginRequest;
import com.culex.culex.dto.RegisterRequest;
import com.culex.culex.dto.UpdateProfileRequest;
import com.culex.culex.model.User;
import com.culex.culex.repository.UserRepository;
import com.culex.culex.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        try {
            // Check if user already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                return new AuthResponse("User with this email already exists");
            }

            // Create new user
            User user = new User(
                    request.getEmail(),
                    passwordEncoder.encode(request.getPassword()),
                    request.getFirstName(),
                    request.getLastName(),
                    // Pass the phoneNumber from the request
                    request.getPhoneNumber());

            User savedUser = userRepository.save(user);

            // Generate JWT token
            String token = jwtUtil.generateToken(savedUser.getEmail());

            return new AuthResponse(
                    token,
                    savedUser.getEmail(),
                    savedUser.getFirstName(),
                    savedUser.getLastName());

        } catch (Exception e) {
            return new AuthResponse("Registration failed: " + e.getMessage());
        }
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

            if (userOptional.isEmpty()) {
                return new AuthResponse("Invalid email or password");
            }

            User user = userOptional.get();

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return new AuthResponse("Invalid email or password");
            }

            if (!user.isActive()) {
                return new AuthResponse("Account is deactivated");
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getEmail());

            return new AuthResponse(
                    token,
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName());

        } catch (Exception e) {
            return new AuthResponse("Login failed: " + e.getMessage());
        }
    }

    public AuthResponse updateProfile(String email, UpdateProfileRequest request) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(email);

            if (userOptional.isEmpty()) {
                return new AuthResponse("User not found");
            }

            User user = userOptional.get();

            // Verify current password if trying to change password
            if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
                if (request.getCurrentPassword() == null || request.getCurrentPassword().isEmpty()) {
                    return new AuthResponse("Current password is required to change password");
                }

                if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                    return new AuthResponse("Current password is incorrect");
                }

                // Update password
                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            }

            // Update other fields
            if (request.getFirstName() != null && !request.getFirstName().trim().isEmpty()) {
                user.setFirstName(request.getFirstName().trim());
            }

            if (request.getLastName() != null && !request.getLastName().trim().isEmpty()) {
                user.setLastName(request.getLastName().trim());
            }

            if (request.getPhoneNumber() != null) {
                user.setPhoneNumber(request.getPhoneNumber().trim());
            }

            user.setUpdatedAt(java.time.LocalDateTime.now());
            User updatedUser = userRepository.save(user);

            return new AuthResponse(
                    null, // No new token needed
                    updatedUser.getEmail(),
                    updatedUser.getFirstName(),
                    updatedUser.getLastName(),
                    "Profile updated successfully");

        } catch (Exception e) {
            return new AuthResponse("Profile update failed: " + e.getMessage());
        }
    }
}