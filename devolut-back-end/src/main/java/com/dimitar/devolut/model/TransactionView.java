package com.dimitar.devolut.model;

import java.util.Date;

public class TransactionView {
    private String senderDTag;

    private String receiverDTag;

    private String cardNumber;

    private double amount;

    private Date created_at;

    private String senderAvatarSrc;

    private String receiverAvatarSrc;

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

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getSenderAvatarSrc() {
        return senderAvatarSrc;
    }

    public void setSenderAvatarSrc(String senderAvatarSrc) {
        this.senderAvatarSrc = senderAvatarSrc;
    }

    public String getReceiverAvatarSrc() {
        return receiverAvatarSrc;
    }

    public void setReceiverAvatarSrc(String receiverAvatarSrc) {
        this.receiverAvatarSrc = receiverAvatarSrc;
    }
}
