package com.dimitar.devolut.controller;

import com.dimitar.devolut.model.TransactionUser;
import com.dimitar.devolut.model.TransactionView;
import com.dimitar.devolut.model.User;
import com.dimitar.devolut.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transaction")
@CrossOrigin
public class TransactionController {
    @Autowired
    private TransactionService transactionService;

    @PostMapping("/create")
    public ResponseEntity createTransaction(@RequestBody TransactionUser transactionUser) { return transactionService.createTransaction(transactionUser); };

    @PostMapping("/user")
    public ResponseEntity<List<TransactionView>> getUserTransactions(@RequestBody User user) { return transactionService.getUserTransactions(user); };
}
