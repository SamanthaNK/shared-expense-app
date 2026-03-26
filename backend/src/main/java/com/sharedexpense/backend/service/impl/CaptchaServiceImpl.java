package com.sharedexpense.backend.service.impl;

import com.sharedexpense.backend.exception.CaptchaException;
import com.sharedexpense.backend.service.CaptchaService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class CaptchaServiceImpl implements CaptchaService {
    @Value("${app.recaptcha.secret}")
    private String secretKey;

    @Value("${app.recaptcha.verify-url:https://www.google.com/recaptcha/api/siteverify}")
    private String verifyUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void verify(String captchaToken) {
        if (captchaToken == null || captchaToken.isBlank()) {
            throw new CaptchaException("CAPTCHA token is missing. Please complete the security check.");
        }

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("secret", secretKey);
        params.add("response", captchaToken);

        @SuppressWarnings("unchecked")
        Map<String, Object> googleResponse =
                restTemplate.postForObject(verifyUrl, params, Map.class);

        if (googleResponse == null) {
            throw new CaptchaException("Could not reach CAPTCHA verification service. Try again.");
        }

        boolean success = Boolean.TRUE.equals(googleResponse.get("success"));

        if (!success) {
            Object errorCodes = googleResponse.get("error-codes");
            throw new CaptchaException(
                    "CAPTCHA verification failed. Please try again. Codes: " + errorCodes
            );
        }
    }
}