package com.example.chatBackend.Service;

import com.example.chatBackend.Entity.Message;
import com.example.chatBackend.Repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public List<Message> getChatMessages(String senderUsername, String receiverUsername) {
        // Implement logic to fetch chat messages between sender and receiver
        return messageRepository.findBySenderUsernameAndReceiverUsernameOrSenderUsernameAndReceiverUsernameOrderByTimestamp(
                senderUsername, receiverUsername, receiverUsername, senderUsername);
    }

    public void saveMessage(Message message) {
        // You can perform any additional operations here before saving
        messageRepository.save(message);
    }

}
