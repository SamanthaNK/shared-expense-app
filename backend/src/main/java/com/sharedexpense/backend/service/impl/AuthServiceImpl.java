package com.sharedexpense.backend.service.impl;

import com.sharedexpense.backend.dto.request.LoginRequest;
import com.sharedexpense.backend.dto.request.RegisterRequest;
import com.sharedexpense.backend.dto.response.AuthResponse;
import com.sharedexpense.backend.exception.BusinessException;
import com.sharedexpense.backend.model.User;
import com.sharedexpense.backend.repository.UserRepository;
import com.sharedexpense.backend.security.JwtUtil;
import com.sharedexpense.backend.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw BusinessException.conflict(
                    "EMAIL_TAKEN",
                    "You already have an account! Try logging in."
            );
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .isEmailVerified(false)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token, user.getName(), user.getEmail(),
                "Welcome to PayBuddy, " + user.getName() + "!");
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> BusinessException.unauthorized(
                        "INVALID_CREDENTIALS",
                        "Email or password is incorrect."
                ));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw BusinessException.unauthorized(
                    "INVALID_CREDENTIALS",
                    "Email or password is incorrect."
            );
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token, user.getName(), user.getEmail(),
                "Welcome back, " + user.getName() + "!");
    }
}