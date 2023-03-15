package com.dimitar.devolut.model;

import java.util.List;

public class VaultView {
    private int id;
    private int ownerId;
    private String ownerDTag;
    private double balance;
    private Double goal;
    private String name;
    private String type;
    private List<Integer> usersWithAccess;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerDTag() {
        return ownerDTag;
    }

    public void setOwnerDTag(String ownerDTag) {
        this.ownerDTag = ownerDTag;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public Double getGoal() {
        return goal;
    }

    public void setGoal(Double goal) {
        this.goal = goal;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<Integer> getUsersWithAccess() {
        return usersWithAccess;
    }

    public void setUsersWithAccess(List<Integer> usersWithAccess) {
        this.usersWithAccess = usersWithAccess;
    }
}
