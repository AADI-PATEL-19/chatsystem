import React, { useState, useEffect } from 'react';
import '../css/ChatComponent.css';
import chatImg from '../chatbot.jpg';
import axios from 'axios';

export default function ChatComponent() {
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchConnectedUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/user-contacts/${username}`);
        const usernames = response.data.map(user => user.senderuser !== username ? user.senderuser : user.receiveruser);
        setConnectedUsers(usernames);
      } catch (error) {
        console.error('Error fetching connected users:', error);
      }
    };
    fetchConnectedUsers();
  }, [username]);

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (username && selectedUser) {
        try {
          const response = await axios.get(`http://localhost:8000/messages/${username}/${selectedUser}`);
          setChatMessages(response.data);
        } catch (error) {
          console.error('Error fetching chat messages:', error);
        }
      }
    };
    fetchChatMessages();
  }, [  selectedUser , messageInput , chatMessages  ]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const sendMessage = async () => {
    if (messageInput.trim() !== '' && selectedUser !== null) {
      const timestamp = new Date();
      const message = {
        senderUsername: username,
        receiverUsername: selectedUser,
        messageText: messageInput,
        timestamp: timestamp
      };
    
      try {
        const response = await axios.post('http://localhost:8000/messages', message);
        if (response.status === 200) {
          setMessageInput('');
          setSelectedUser(selectedUser); // Refresh chat messages
          // alert("Message sent successfully!");
        } else {
          console.error('Failed to send message. Unexpected response:', response);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="contacts-panel">
        <div className="contacts">Contacts</div>
        <div className="contact-lists">
          {connectedUsers.map((username, index) => (
            <div
              className="contact-list"
              style={{ backgroundColor: getRandomColor() }}
              key={index}
              onClick={() => handleUserClick(username)}
            >
              {username}
            </div>
          ))}
        </div>
      </div>
      <div className="chat-panel">
        {selectedUser ? (
          <div className="selected-contact">
            <div className="selectedUser">{selectedUser}</div>
            <div className="chat-messages">
              {chatMessages.map((message, index) => (
                <div
                  className={`message-bubble ${message.senderUsername === username ? 'sent' : 'received'}`}
                  key={index}
                >
                  <div className='msg'>{message.messageText}</div>
                  <div className='timestamp'>{new Date(message.timestamp).toLocaleString()}</div>
                </div>
              ))}
              </div>

              <div className="message-input">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            
          </div>
        ) : (
          <div className="no-chat">
            <img src={chatImg} alt="No Chat Image" />
            <p>No chat selected</p>
          </div>
        )}
      </div>
    </div>
  );
}
