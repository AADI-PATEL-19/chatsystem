import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import '../css/ChatComponent.css';
import chatImg from '../chatbot.jpg';
import axios from 'axios';

export default function ChatComponent() {
  const [connectedUsers, setConnectedUsers] = useState([{userName:"", status:false}]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchConnectedUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/user-contacts/${username}`);
        const statusResponse = await axios.get("http://localhost:8000/user/status");
      
        console.log("response",response.data);
        console.log("ststusResponse",statusResponse.data);
        const usersWithStatus = response.data.map(user => {
          const userStatus = statusResponse.data.find(status =>status.username.toLowerCase()===user.receiveruser.toLowerCase());
          return {
            userName: user.receiveruser,
            status:userStatus?userStatus.online:false
          };
        });
        setConnectedUsers(usersWithStatus);
        console.log("connected users with status: ", usersWithStatus);
      } catch (error) {
        console.error('Error fetching connected users:', error);
      }
    };
    fetchConnectedUsers();
  }, [username,connectedUsers]);

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

  // const getRandomColor = () => {
  //   const letters = '0123456789ABCDEF';
  //   let color = '#';
  //   for (let i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // };

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
        <div className="contacts">Chats</div>
        <div className="contact-lists">
          {connectedUsers.map((user, index) => (
            <div
              className="contact-list"
              key={index}
              onClick={() => handleUserClick(user.userName)}
            > 
             <div className='user-icon'> <FaUser  size={25}/> </div>
             <div className='user-details'>
  <p className='user-name'>{user.userName}</p>
  <p className='status' style={{ color: user.status ? "green" : "red" }}>
    {user.status ? 'Online' : 'Offline'}
  </p>
</div>

             
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
