package com.sharedexpense.backend.repository;
import com.sharedexpense.backend.model.ExpenseShare;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseShareRepository extends JpaRepository<ExpenseShare, Long> {
    List<ExpenseShare> findByExpenseId(Long expenseId);
}