package com.dimitar.devolut.service;

import com.dimitar.devolut.model.User;
import com.dimitar.devolut.model.Vault;
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
}
