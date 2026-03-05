package com.sharedexpense.backend.repository;
import com.sharedexpense.backend.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByGroupIdAndIsDeletedFalse(Long groupId);
}