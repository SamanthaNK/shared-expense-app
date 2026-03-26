package com.sharedexpense.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex) {

        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                fieldErrors.put(error.getField(), error.getDefaultMessage())
        );

        Map<String, Object> body = new HashMap<>();
        body.put("status", 400);
        body.put("message", "Validation failed");
        body.put("fieldErrors", fieldErrors);

        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(CaptchaException.class)
    public ResponseEntity<Map<String, Object>> handleCaptcha(CaptchaException ex) {
        return buildError(HttpStatus.BAD_REQUEST, "CAPTCHA_FAILED", ex.getMessage());
    }

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<Map<String, Object>> handleTokenExpired(TokenExpiredException ex) {
        return buildError(HttpStatus.BAD_REQUEST, "TOKEN_EXPIRED", ex.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {
        return buildError(HttpStatus.BAD_REQUEST, "REQUEST_ERROR", ex.getMessage());
    }

    private ResponseEntity<Map<String, Object>> buildError(
            HttpStatus status, String errorCode, String message) {

        Map<String, Object> body = new HashMap<>();
        body.put("status", status.value());
        body.put("errorCode", errorCode);
        body.put("message", message);

        return ResponseEntity.status(status).body(body);
    }
}