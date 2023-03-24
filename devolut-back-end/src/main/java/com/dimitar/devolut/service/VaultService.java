package com.dimitar.devolut.service;

import com.dimitar.devolut.model.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface VaultService {
    public ResponseEntity createVault(Vault vault);

    public ResponseEntity<List<VaultView>> getUserVaults(User user);

    public ResponseEntity depositMoney(VaultUser vaultUser);

    public ResponseEntity withdrawMoney(VaultUser vaultUser);

    public ResponseEntity shareVault(VaultShare vaultShare);

    public ResponseEntity deleteVault(VaultDelete vaultDelete);

    public ResponseEntity updateVault(VaultUpdate vaultUpdate);

    public ResponseEntity removeUserAccess(VaultAccessRemove vaultAccessRemove);

    public ResponseEntity<List<String>> getVaultUsers(VaultDelete vaultDelete);
}
