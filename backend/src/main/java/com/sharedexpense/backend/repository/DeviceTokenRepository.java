package com.sharedexpense.backend.repository;
import com.sharedexpense.backend.model.DeviceToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DeviceTokenRepository extends JpaRepository<DeviceToken, Long> {
    Optional<DeviceToken> findByUserId(Long userId);
    void deleteByToken(String token);
}