package com.sharedexpense.backend.service;

import com.sharedexpense.backend.dto.request.LoginRequest;
import com.sharedexpense.backend.dto.request.RegisterRequest;
import com.sharedexpense.backend.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}