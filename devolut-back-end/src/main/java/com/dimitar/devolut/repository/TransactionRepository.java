package com.dimitar.devolut.repository;

import com.dimitar.devolut.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    public List<Transaction> findAllBySenderIdOrReceiverId(int senderId, int receiverId);
}
