package com.dimitar.devolut.service;

import com.dimitar.devolut.model.User;
import com.dimitar.devolut.model.Vault;
import com.dimitar.devolut.model.VaultUser;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface VaultService {
    public ResponseEntity createVault(Vault vault);

    public ResponseEntity<List<Vault>> getUserVaults(User user);

    public ResponseEntity depositMoney(VaultUser vaultUser);

    public ResponseEntity withdrawMoney(VaultUser vaultUser);
}
