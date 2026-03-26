package com.sharedexpense.backend.service;

public interface CaptchaService {
    void verify(String captchaToken);
}