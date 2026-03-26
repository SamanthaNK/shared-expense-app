package com.sharedexpense.backend.exception;

public class CaptchaException extends RuntimeException {
    public CaptchaException(String message) {
        super(message);
    }
}
