package com.dimitar.devolut.controller;

import com.dimitar.devolut.model.*;
import com.dimitar.devolut.service.VaultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vault")
@CrossOrigin
public class VaultController {
    @Autowired
    private VaultService vaultService;

    @PostMapping("/create")
    public ResponseEntity createVault(@RequestBody Vault vault) { return vaultService.createVault(vault); }

    @PostMapping("/user")
    public ResponseEntity<List<VaultView>> getUserVaults(@RequestBody User user) { return vaultService.getUserVaults(user); }

    @PostMapping("/deposit")
    public ResponseEntity depositMoney(@RequestBody VaultUser vaultUser) { return vaultService.depositMoney(vaultUser); }

    @PostMapping("/withdraw")
    public ResponseEntity withdrawMoney(@RequestBody VaultUser vaultUser) { return vaultService.withdrawMoney(vaultUser); }

    @PostMapping("/share")
    public ResponseEntity shareVault(@RequestBody VaultShare vaultShare) { return vaultService.shareVault(vaultShare); }

    @PostMapping("/delete")
    public ResponseEntity deleteVault(@RequestBody VaultDelete vaultDelete) { return vaultService.deleteVault(vaultDelete); }

    @PostMapping("/update")
    public ResponseEntity updateVault(@RequestBody VaultUpdate vaultUpdate) { return vaultService.updateVault(vaultUpdate); }

    @PostMapping("/removeUserAccess")
    public ResponseEntity removeUserAccess(@RequestBody VaultAccessRemove vaultAccessRemove) { return vaultService.removeUserAccess(vaultAccessRemove); }
    @PostMapping("/getUsers")
    public ResponseEntity<List<String>> getVaultUsers(@RequestBody VaultDelete vaultDelete) { return vaultService.getVaultUsers(vaultDelete); }
}
