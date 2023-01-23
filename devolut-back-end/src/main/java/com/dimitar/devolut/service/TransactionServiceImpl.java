package com.dimitar.devolut.service;

import com.dimitar.devolut.model.Transaction;
import com.dimitar.devolut.model.TransactionUser;
import com.dimitar.devolut.model.TransactionView;
import com.dimitar.devolut.model.User;
import com.dimitar.devolut.repository.TransactionRepository;
import com.dimitar.devolut.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;


    @Override
    public ResponseEntity createTransaction(TransactionUser transactionUser) {
        if (transactionUser.getdTag() != null && transactionUser.getPassword() != null) {
            if (userRepository.findBydTagAndIdAndPassword(transactionUser.getdTag(), transactionUser.getId(), transactionUser.getPassword()) == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        Transaction transaction = new Transaction();
        transaction.setReceiverId(transactionUser.getReceiverId());
        transaction.setSenderId(transactionUser.getSenderId());
        transaction.setAmount(transactionUser.getAmount());

        User receiver = userRepository.findById(transaction.getReceiverId());
        User sender = userRepository.findById(transaction.getSenderId());

        if ((sender.getBalance() < transaction.getAmount()) || transaction.getAmount() <= 0 || receiver == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        transactionRepository.save(transaction);

        receiver.setBalance(receiver.getBalance() + transaction.getAmount());
        sender.setBalance(sender.getBalance() - transaction.getAmount());

        userRepository.save(receiver);
        userRepository.save(sender);

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity<List<TransactionView>> getUserTransactions(User user) {
        if (user.getdTag() != null && user.getPassword() != null) {
            if (userRepository.findBydTagAndIdAndPassword(user.getdTag(), user.getId(), user.getPassword()) == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        List<TransactionView> transactionViews = new ArrayList<>();

        transactionRepository.findAllBySenderIdOrReceiverId(user.getId(), user.getId()).forEach((transaction -> {
            TransactionView transactionView = new TransactionView();
            transactionView.setSenderDTag(userRepository.findById(transaction.getSenderId()).getdTag());
            transactionView.setReceiverDTag(userRepository.findById(transaction.getReceiverId()).getdTag());
            transactionView.setAmount(transaction.getAmount());
            transactionView.setCreated_at(transaction.getCreated_at());

            transactionViews.add(transactionView);
        }));

        return ResponseEntity.ok(transactionViews);
    }
}
