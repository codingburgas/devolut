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
public class VaultServiceImpl implements VaultService {
    @Autowired
    private VaultRepository vaultRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public ResponseEntity createVault(Vault vault) {
        if (vaultRepository.findByOwnerIdAndName(vault.getOwnerId(), vault.getName()) != null) {
            return new ResponseEntity<>(null, HttpStatus.FOUND);
        }

        return ResponseEntity.ok(vaultRepository.save(vault));
    }

    @Override
    public ResponseEntity<List<Vault>> getUserVaults(User user) {
        if (user.getdTag() != null && user.getPassword() != null) {
            if (userRepository.findBydTagAndIdAndPassword(user.getdTag(), user.getId(), user.getPassword()) == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        List<Vault> vaults = new ArrayList<>();

        vaultRepository.findAll().forEach((vault -> {
            if ((vault.getOwnerId() == user.getId()) || vault.getUsersWithAccess().contains(user.getId())) {
                vaults.add(vault);
            }
        }));

        return ResponseEntity.ok(vaults);
    }

    @Override
    public ResponseEntity depositMoney(VaultUser vaultUser) {
        if (vaultUser.getdTag() != null && vaultUser.getPassword() != null) {
            if (userRepository.findBydTagAndIdAndPassword(vaultUser.getdTag(), vaultUser.getId(), vaultUser.getPassword()) == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        Transaction transaction = new Transaction();
        transaction.setSenderId(vaultUser.getId());
        transaction.setReceiverId(vaultUser.getVaultId());
        transaction.setAmount(vaultUser.getAmount());
        transaction.setAction("deposit");
        transaction.setType("vault");

        User sender = userRepository.findById(vaultUser.getId());
        Vault receiver = vaultRepository.findById(vaultUser.getVaultId());

        if ((sender.getBalance() < transaction.getAmount()) || transaction.getAmount() <= 0 || receiver == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        transactionRepository.save(transaction);

        receiver.setBalance(receiver.getBalance() + transaction.getAmount());
        sender.setBalance(sender.getBalance() - transaction.getAmount());

        userRepository.save(sender);
        vaultRepository.save(receiver);

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity withdrawMoney(VaultUser vaultUser) {
        if (vaultUser.getdTag() != null && vaultUser.getPassword() != null) {
            if (userRepository.findBydTagAndIdAndPassword(vaultUser.getdTag(), vaultUser.getId(), vaultUser.getPassword()) == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        Transaction transaction = new Transaction();
        transaction.setSenderId(vaultUser.getVaultId());
        transaction.setReceiverId(vaultUser.getId());
        transaction.setAmount(vaultUser.getAmount());
        transaction.setAction("withdraw");
        transaction.setType("vault");

        Vault sender = vaultRepository.findById(vaultUser.getVaultId());
        User receiver = userRepository.findById(vaultUser.getId());

        if (sender == null || (sender.getBalance() < transaction.getAmount()) || transaction.getAmount() <= 0) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        transactionRepository.save(transaction);

        receiver.setBalance(receiver.getBalance() + transaction.getAmount());
        sender.setBalance(sender.getBalance() - transaction.getAmount());

        vaultRepository.save(sender);
        userRepository.save(receiver);

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity shareVault(VaultShare vaultShare) {
        if (vaultShare.getdTag() != null && vaultShare.getPassword() != null) {
            if (userRepository.findBydTagAndIdAndPassword(vaultShare.getdTag(), vaultShare.getId(), vaultShare.getPassword()) == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        if (userRepository.findById(vaultShare.getUserId()) == null) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        Vault vault = vaultRepository.findById(vaultShare.getVaultId());

        if (vault == null || (vault.getOwnerId() != vaultShare.getId()) || (vault.getOwnerId() == vaultShare.getUserId()) || (!vault.getType().equals("shared"))) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        if (vault.getUsersWithAccess().contains(vaultShare.getUserId())) {
            return new ResponseEntity<>(null, HttpStatus.FOUND);
        }

        vault.getUsersWithAccess().add(vaultShare.getUserId());

        vaultRepository.save(vault);

        return ResponseEntity.ok(null);
    }
}
