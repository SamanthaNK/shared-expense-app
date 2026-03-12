package com.sharedexpense.backend.exception;

import org.springframework.http.HttpStatus;

public class BusinessException extends RuntimeException {

    private final HttpStatus status;
    private final String errorCode;

    public BusinessException(HttpStatus status, String errorCode, String message) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }

    public static BusinessException badRequest(String errorCode, String message) {
        return new BusinessException(HttpStatus.BAD_REQUEST, errorCode, message);
    }

    public static BusinessException notFound(String errorCode, String message) {
        return new BusinessException(HttpStatus.NOT_FOUND, errorCode, message);
    }

    public static BusinessException conflict(String errorCode, String message) {
        return new BusinessException(HttpStatus.CONFLICT, errorCode, message);
    }

    public static BusinessException unauthorized(String errorCode, String message) {
        return new BusinessException(HttpStatus.UNAUTHORIZED, errorCode, message);
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getErrorCode() {
        return errorCode;
    }
}