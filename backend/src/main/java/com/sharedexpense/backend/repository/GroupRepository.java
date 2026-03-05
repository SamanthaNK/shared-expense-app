package com.sharedexpense.backend.repository;
import com.sharedexpense.backend.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<Group, Long> {
}