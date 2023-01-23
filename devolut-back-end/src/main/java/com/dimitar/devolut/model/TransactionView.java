package com.dimitar.devolut.model;

import java.util.Date;

public class TransactionView {
    private String senderDTag;

    private String receiverDTag;

    private double amount;

    private Date created_at;

    public String getSenderDTag() {
        return senderDTag;
    }

    public void setSenderDTag(String senderDTag) {
        this.senderDTag = senderDTag;
    }

    public String getReceiverDTag() {
        return receiverDTag;
    }

    public void setReceiverDTag(String receiverDTag) {
        this.receiverDTag = receiverDTag;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }
}
