package com.dimitar.devolut.controller;

import com.dimitar.devolut.model.User;
import com.dimitar.devolut.model.Vault;
import com.dimitar.devolut.model.VaultShare;
import com.dimitar.devolut.model.VaultUser;
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
    public ResponseEntity<List<Vault>> getUserVaults(@RequestBody User user) { return vaultService.getUserVaults(user); }

    @PostMapping("/deposit")
    public ResponseEntity depositMoney(@RequestBody VaultUser vaultUser) { return vaultService.depositMoney(vaultUser); }

    @PostMapping("/withdraw")
    public ResponseEntity withdrawMoney(@RequestBody VaultUser vaultUser) { return vaultService.withdrawMoney(vaultUser); }

    @PostMapping("/share")
    public ResponseEntity shareVault(@RequestBody VaultShare vaultShare) { return vaultService.shareVault(vaultShare); }
}
