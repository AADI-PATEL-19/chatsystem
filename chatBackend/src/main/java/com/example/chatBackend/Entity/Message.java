package com.example.chatBackend.Entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



        @Column(name = "sender_username")
        private String senderUsername;

        @Column(name = "receiver_username")
        private String receiverUsername;

        @Column(name = "message_text")
        private String messageText;

        @Column(name = "timestamp")
        @Temporal(TemporalType.TIMESTAMP)
        private Date timestamp;

        public Message() {
        }

    public Message(String senderUsername, String receiverUsername, String messageText, Date timestamp) {
        this.senderUsername = senderUsername;
        this.receiverUsername = receiverUsername;
        this.messageText = messageText;
        this.timestamp = timestamp;
    }

    public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getSenderUsername() {
            return senderUsername;
        }

        public void setSenderUsername(String senderUsername) {
            this.senderUsername = senderUsername;
        }

        public String getReceiverUsername() {
            return receiverUsername;
        }

        public void setReceiverUsername(String receiverUsername) {
            this.receiverUsername = receiverUsername;
        }

        public String getMessageText() {
            return messageText;
        }

        public void setMessageText(String messageText) {
            this.messageText = messageText;
        }

        public Date getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(Date timestamp) {
            this.timestamp = timestamp;
        }
    }

