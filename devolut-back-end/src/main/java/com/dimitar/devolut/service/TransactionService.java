package com.dimitar.devolut.service;

import com.dimitar.devolut.model.Transaction;
import com.dimitar.devolut.model.User;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface TransactionService {
    public void createTransaction(Transaction transaction);

    public ResponseEntity<List<Transaction>> getUserTransactions(User user);
}
