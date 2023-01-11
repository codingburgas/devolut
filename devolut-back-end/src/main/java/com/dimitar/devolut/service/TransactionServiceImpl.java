package com.dimitar.devolut.service;

import com.dimitar.devolut.model.Transaction;
import com.dimitar.devolut.model.TransactionUser;
import com.dimitar.devolut.model.User;
import com.dimitar.devolut.repository.TransactionRepository;
import com.dimitar.devolut.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;


    @Override
    public void createTransaction(TransactionUser transactionUser) {
        if (transactionUser.getdTag() != null && transactionUser.getPassword() != null) {
            if (userRepository.findBydTagAndIdAndPassword(transactionUser.getdTag(), transactionUser.getId(), transactionUser.getPassword()) == null) {
                return;
            }
        } else {
            return;
        }

        Transaction transaction = new Transaction();
        transaction.setReceiverId(transactionUser.getReceiverId());
        transaction.setSenderId(transactionUser.getSenderId());
        transaction.setAmount(transactionUser.getAmount());

        User receiver = userRepository.findById(transaction.getReceiverId());
        User sender = userRepository.findById(transaction.getSenderId());

        if ((sender.getBalance() < transaction.getAmount()) || transaction.getAmount() <= 0) {
            return;
        }

        transactionRepository.save(transaction);

        receiver.setBalance(receiver.getBalance() + transaction.getAmount());
        sender.setBalance(sender.getBalance() - transaction.getAmount());

        userRepository.save(receiver);
        userRepository.save(sender);
    }

    @Override
    public ResponseEntity<List<Transaction>> getUserTransactions(User user) {
        if (user.getdTag() != null && user.getPassword() != null) {
            if (userRepository.findBydTagAndIdAndPassword(user.getdTag(), user.getId(), user.getPassword()) == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(transactionRepository.findAllBySenderIdOrReceiverId(user.getId(), user.getId()));
    }


}
