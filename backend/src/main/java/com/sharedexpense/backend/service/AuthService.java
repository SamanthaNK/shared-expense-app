package com.sharedexpense.backend.service;

import com.sharedexpense.backend.dto.request.ForgotPasswordRequest;
import com.sharedexpense.backend.dto.request.LoginRequest;
import com.sharedexpense.backend.dto.request.RegisterRequest;
import com.sharedexpense.backend.dto.request.ResetPasswordRequest;
import com.sharedexpense.backend.dto.response.AuthResponse;
import com.sharedexpense.backend.dto.response.MessageResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    MessageResponse forgotPassword(ForgotPasswordRequest request);
    MessageResponse resetPassword(ResetPasswordRequest request);
}