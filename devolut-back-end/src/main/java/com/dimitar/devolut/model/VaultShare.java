package com.dimitar.devolut.model;

public class VaultShare {
    private int vaultId;
    private int userId;

    private int id;
    private String dTag;
    private String password;

    public int getVaultId() {
        return vaultId;
    }

    public void setVaultId(int vaultId) {
        this.vaultId = vaultId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getdTag() {
        return dTag;
    }

    public void setdTag(String dTag) {
        this.dTag = dTag;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
