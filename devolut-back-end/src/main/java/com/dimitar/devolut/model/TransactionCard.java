package com.dimitar.devolut.model;

public class TransactionCard {
    private String cardNumber;
    private double amount;

    private int id;
    private String dTag;
    private String password;

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
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
