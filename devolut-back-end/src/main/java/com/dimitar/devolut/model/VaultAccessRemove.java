package com.dimitar.devolut.model;

public class VaultAccessRemove {
    private int vaultId;
    private String userDTag;

    private int id;
    private String dTag;
    private String password;

    public int getVaultId() {
        return vaultId;
    }

    public void setVaultId(int vaultId) {
        this.vaultId = vaultId;
    }

    public String getUserDTag() {
        return userDTag;
    }

    public void setUserDTag(String userDTag) {
        this.userDTag = userDTag;
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
