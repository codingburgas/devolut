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
    public ResponseEntity<List<VaultView>> getUserVaults(User user) {
        if (user.getdTag() != null && user.getPassword() != null) {
            if (userRepository.findBydTagAndIdAndPassword(user.getdTag(), user.getId(), user.getPassword()) == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        List<VaultView> vaults = new ArrayList<>();

        vaultRepository.findAll().forEach((vault -> {
            if ((vault.getOwnerId() == user.getId()) || vault.getUsersWithAccess().contains(user.getId())) {
                VaultView vaultView = new VaultView();

                vaultView.setId(vault.getId());
                vaultView.setOwnerId(vault.getOwnerId());
                vaultView.setOwnerDTag(userRepository.findById(vault.getOwnerId()).getdTag());
                vaultView.setBalance(vault.getBalance());
                vaultView.setGoal(vault.getGoal());
                vaultView.setName(vault.getName());
                vaultView.setType(vault.getType());
                vaultView.setUsersWithAccess(vault.getUsersWithAccess());

                vaults.add(vaultView);
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

    @Override
    public ResponseEntity deleteVault(VaultDelete vaultDelete) {
        if (vaultDelete.getdTag() != null && vaultDelete.getPassword() != null) {
            if (userRepository.findBydTagAndIdAndPassword(vaultDelete.getdTag(), vaultDelete.getId(), vaultDelete.getPassword()) == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        User user = userRepository.findBydTagAndIdAndPassword(vaultDelete.getdTag(), vaultDelete.getId(), vaultDelete.getPassword());
        Vault vault = vaultRepository.findById(vaultDelete.getVaultId());

        if (vault == null || vault.getOwnerId() != vaultDelete.getId()) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        if (vault.getBalance() > 0) {
            Transaction transaction = new Transaction();
            transaction.setSenderId(vaultDelete.getVaultId());
            transaction.setReceiverId(vaultDelete.getId());
            transaction.setAmount(vault.getBalance());
            transaction.setAction("withdraw");
            transaction.setType("vault");
            transactionRepository.save(transaction);

            user.setBalance(user.getBalance() + vault.getBalance());
            userRepository.save(user);
        }

        vaultRepository.delete(vault);

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity updateVault(VaultUpdate vaultUpdate) {
        if (vaultUpdate.getdTag() != null && vaultUpdate.getPassword() != null) {
            if (userRepository.findBydTagAndIdAndPassword(vaultUpdate.getdTag(), vaultUpdate.getId(), vaultUpdate.getPassword()) == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        Vault vault = vaultRepository.findById(vaultUpdate.getVaultId());

        if (vault == null || vault.getOwnerId() != vaultUpdate.getId()) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        if (vaultUpdate.getName() == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } else {
            vault.setName(vaultUpdate.getName());
        }

        if (vaultUpdate.getGoal() != null) {
            vault.setGoal(vaultUpdate.getGoal());
        } else {
            vault.setGoal(null);
        }

        if (vault.getType().equals("shared") && vaultUpdate.getType().equals("personal")) {
            vault.setUsersWithAccess(null);
            vault.setType("personal");
        } else if (vault.getType().equals("personal") && vaultUpdate.getType().equals("shared")) {
            vault.setType("shared");
        }

        vaultRepository.save(vault);

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity removeUserAccess(VaultAccessRemove vaultAccessRemove) {
        if (vaultAccessRemove.getdTag() != null && vaultAccessRemove.getPassword() != null) {
            if (userRepository.findBydTagAndIdAndPassword(vaultAccessRemove.getdTag(), vaultAccessRemove.getId(), vaultAccessRemove.getPassword()) == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        Vault vault = vaultRepository.findById(vaultAccessRemove.getVaultId());

        if (vault == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        User user = userRepository.findBydTag(vaultAccessRemove.getUserDTag());

        if (user == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        vault.getUsersWithAccess().remove(Integer.valueOf(user.getId()));

        vaultRepository.save(vault);

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity<List<String>> getVaultUsers(VaultDelete vaultDelete) {
        if (vaultDelete.getdTag() != null && vaultDelete.getPassword() != null) {
            if (userRepository.findBydTagAndIdAndPassword(vaultDelete.getdTag(), vaultDelete.getId(), vaultDelete.getPassword()) == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        Vault vault = vaultRepository.findById(vaultDelete.getVaultId());

        if (vault == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        List<String> usersDTags = new ArrayList<>();

        vault.getUsersWithAccess().forEach((user -> {
            User currentUser = userRepository.findById(user.intValue());
            if (currentUser != null) {
                usersDTags.add(currentUser.getdTag());
            }
        }));

        return ResponseEntity.ok(usersDTags);
    }


}
