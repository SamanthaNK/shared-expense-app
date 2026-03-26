package com.sharedexpense.backend.service.impl;

import com.sharedexpense.backend.dto.request.ForgotPasswordRequest;
import com.sharedexpense.backend.dto.request.LoginRequest;
import com.sharedexpense.backend.dto.request.RegisterRequest;
import com.sharedexpense.backend.dto.request.ResetPasswordRequest;
import com.sharedexpense.backend.dto.response.AuthResponse;
import com.sharedexpense.backend.dto.response.MessageResponse;
import com.sharedexpense.backend.exception.TokenExpiredException;
import com.sharedexpense.backend.model.User;
import com.sharedexpense.backend.repository.UserRepository;
import com.sharedexpense.backend.security.JwtUtil;
import com.sharedexpense.backend.service.AuthService;
import com.sharedexpense.backend.service.CaptchaService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CaptchaService captchaService;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String appBaseUrl;

    @Value("${app.reset-token.expiry-hours:1}")
    private int resetTokenExpiryHours;

    private final SecureRandom secureRandom = new SecureRandom();

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           CaptchaService captchaService,
                           JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.captchaService = captchaService;
        this.mailSender = mailSender;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        captchaService.verify(request.getCaptchaToken());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Looks like you already have an account! Try logging in.");
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

        captchaService.verify(request.getCaptchaToken());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("We don't recognise that email."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Wrong password! Try again.");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token, user.getName(), user.getEmail(),
                "Welcome back, " + user.getName() + "!");
    }

    @Override
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {

        String genericMessage = "If that email is registered, a reset link is on its way.";

        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {

            byte[] tokenBytes = new byte[32];
            secureRandom.nextBytes(tokenBytes);
            String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);

            user.setResetToken(passwordEncoder.encode(rawToken));
            user.setResetTokenExpires(LocalDateTime.now().plusHours(resetTokenExpiryHours));
            userRepository.save(user);

            String resetLink = appBaseUrl + "/api/auth/reset-password?token=" + rawToken;

            sendResetEmail(user.getEmail(), user.getName(), rawToken, resetLink);
        });

        return new MessageResponse(genericMessage);
    }

    @Override
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        String rawToken = request.getToken();

        User user = userRepository.findAll().stream()
                .filter(u -> u.getResetToken() != null
                        && u.getResetTokenExpires() != null
                        && u.getResetTokenExpires().isAfter(LocalDateTime.now())
                        && passwordEncoder.matches(rawToken, u.getResetToken()))
                .findFirst()
                .orElseThrow(() -> new TokenExpiredException(
                        "This reset link has expired or is invalid. Please request a new one."));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));

        user.setResetToken(null);
        user.setResetTokenExpires(null);

        userRepository.save(user);

        return new MessageResponse("Password updated successfully. You can now log in.");
    }

    private void sendResetEmail(String toEmail, String name, String rawToken, String resetLink) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(fromEmail);
        mail.setTo(toEmail);
        mail.setSubject("PayBuddy — Reset your password");
        mail.setText(
                "Hi " + name + ",\n\n" +
                        "You requested a password reset for your PayBuddy account.\n\n" +
                        "━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                        "Your reset token (copy this into the app):\n\n" +
                        rawToken + "\n\n" +
                        "━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                        "Or tap this link (valid for " + resetTokenExpiryHours + " hour):\n" +
                        resetLink + "\n\n" +
                        "If you didn't request this, you can safely ignore this email.\n\n" +
                        "— Samchi"
        );
        mailSender.send(mail);
    }
}