package com.dimitar.devolut.service;

import com.dimitar.devolut.model.*;
import com.dimitar.devolut.repository.TransactionRepository;
import com.dimitar.devolut.repository.UserRepository;
import com.dimitar.devolut.repository.VaultRepository;
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

    @Autowired
    private VaultRepository vaultRepository;


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
        transaction.setType("user");

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
            switch (transaction.getType()) {
                case "user" -> {
                    transactionView.setType("user");
                    transactionView.setSenderDTag(userRepository.findById(transaction.getSenderId()).getdTag());
                    transactionView.setReceiverDTag(userRepository.findById(transaction.getReceiverId()).getdTag());
                    transactionView.setSenderAvatarSrc(userRepository.findById(transaction.getSenderId()).getAvatarSrc());
                    transactionView.setReceiverAvatarSrc(userRepository.findById(transaction.getReceiverId()).getAvatarSrc());
                }
                case "card" -> {
                    transactionView.setType("card");
                    transactionView.setCardNumber(transaction.getCardNumber());
                }
                case "vault" -> {
                    transactionView.setType("vault");
                    if (transaction.getAction().equals("withdraw")) {
                        if (vaultRepository.findById(transaction.getReceiverId()) == null) {
                            transactionView.setSenderVaultName("[ИЗТРИТ]");
                        } else {
                            transactionView.setSenderVaultName(vaultRepository.findById(transaction.getReceiverId()).getName());
                        }
                    } else if (transaction.getAction().equals("deposit")) {
                        if (vaultRepository.findById(transaction.getReceiverId()) == null) {
                            transactionView.setReceiverVaultName("[ИЗТРИТ]");
                        } else {
                            transactionView.setReceiverVaultName(vaultRepository.findById(transaction.getReceiverId()).getName());
                        }
                    }
                }
            }

            transactionView.setAmount(transaction.getAmount());
            transactionView.setCreated_at(transaction.getCreated_at());

            transactionViews.add(transactionView);
        }));

        return ResponseEntity.ok(transactionViews.subList(Math.max(transactionViews.size() - 4, 0), transactionViews.size()));
    }

    @Override
    public ResponseEntity createCardTransaction(TransactionCard transactionCard) {
        if (transactionCard.getdTag() != null && transactionCard.getPassword() != null) {
            if (userRepository.findBydTagAndIdAndPassword(transactionCard.getdTag(), transactionCard.getId(), transactionCard.getPassword()) == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        Transaction transaction = new Transaction();
        transaction.setReceiverId(transactionCard.getId());
        transaction.setCardNumber(transactionCard.getCardNumber());
        transaction.setAmount(transactionCard.getAmount());
        transaction.setType("card");

        User receiver = userRepository.findById(transaction.getReceiverId());

        if (transaction.getAmount() <= 0 || transaction.getAmount() > 1000 || receiver == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        transactionRepository.save(transaction);

        receiver.setBalance(receiver.getBalance() + transaction.getAmount());

        userRepository.save(receiver);

        return ResponseEntity.ok(null);
    }
}
