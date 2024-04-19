package com.example.chatBackend.Repository;

import com.example.chatBackend.Entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderUsernameAndReceiverUsernameOrSenderUsernameAndReceiverUsernameOrderByTimestamp(
            String senderUsername1, String receiverUsername1, String senderUsername2, String receiverUsername2);
}
