package com.dimitar.devolut.repository;

import com.dimitar.devolut.model.Vault;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VaultRepository extends JpaRepository<Vault, Integer> {
    public Vault findById(int id);
    public Vault findByOwnerIdAndName(int ownerId, String name);
}
