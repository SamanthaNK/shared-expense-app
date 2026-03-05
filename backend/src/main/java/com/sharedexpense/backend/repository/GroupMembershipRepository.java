package com.sharedexpense.backend.repository;
import com.sharedexpense.backend.model.GroupMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface GroupMembershipRepository extends JpaRepository<GroupMembership, Long> {
    List<GroupMembership> findByGroupId(Long groupId);
    Optional<GroupMembership> findByGroupIdAndUserId(Long groupId, Long userId);
}