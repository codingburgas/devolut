package com.dimitar.devolut.model;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "vaults")
public class Vault {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int ownerId;

    @Column(columnDefinition = "double default '0.0'", nullable = false)
    private double balance;

    @Column(nullable = true)
    private Double goal;

    private String name;

    private String type;

    @ElementCollection
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
