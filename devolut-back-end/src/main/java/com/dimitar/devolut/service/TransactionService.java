package com.dimitar.devolut.service;

import com.dimitar.devolut.model.TransactionCard;
import com.dimitar.devolut.model.TransactionUser;
import com.dimitar.devolut.model.TransactionView;
import com.dimitar.devolut.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface TransactionService {
    public ResponseEntity createTransaction(TransactionUser transactionUser);

    public ResponseEntity<List<TransactionView>> getUserTransactions(User user);

    public ResponseEntity createCardTransaction(@RequestBody TransactionCard transactionCard);
}
