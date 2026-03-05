package com.sharedexpense.backend.dto.response;

public class AuthResponse {
    private String token;
    private String name;
    private String email;
    private String message;

    public AuthResponse(String token, String name, String email, String message) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.message = message;
    }

    public String getToken() { return token; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getMessage() { return message; }
}