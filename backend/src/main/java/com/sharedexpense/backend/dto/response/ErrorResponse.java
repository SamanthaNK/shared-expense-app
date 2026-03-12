package com.sharedexpense.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    private int status;
    private String errorCode;
    private String message;
    private Map<String, String> fieldErrors;
    private Instant timestamp;

    private ErrorResponse() {
    }

    public static ErrorResponse of(int status, String errorCode, String message) {
        ErrorResponse r = new ErrorResponse();
        r.status = status;
        r.errorCode = errorCode;
        r.message = message;
        r.timestamp = Instant.now();
        return r;
    }

    public static ErrorResponse ofValidation(Map<String, String> fieldErrors) {
        ErrorResponse r = new ErrorResponse();
        r.status = 400;
        r.errorCode = "VALIDATION_ERROR";
        r.message = "One or more fields are invalid";
        r.fieldErrors = fieldErrors;
        r.timestamp = Instant.now();
        return r;
    }

    public int getStatus() { return status; }
    public String getErrorCode() { return errorCode; }

    public String getMessage() { return message; }

    public Map<String, String> getFieldErrors() { return fieldErrors; }

    public Instant getTimestamp() { return timestamp; }
}