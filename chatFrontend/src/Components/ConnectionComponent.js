import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ConnectionComponent.css';

export default function ConnectionComponent() {
    const username = localStorage.getItem('username');
    const [users, setUsers] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
   

    useEffect(() => {
        console.log('Fetching user connections...');
        axios.get(`http://localhost:8000/users/connections/${username}`)
            .then(connectionsResponse => {
                const connectionsUsers = connectionsResponse.data;
                console.log('Connections data:', connectionsUsers);
    
                console.log('Fetching friend requests...');
                axios.get(`http://localhost:8000/friend-requests/sender/${username}`)
                    .then(requestsResponse => {
                        const requestsUsers = requestsResponse.data;
                        console.log('Friend requests data:', requestsUsers);
    
                        // Filter out users from connectionsUsers if their usernames are in requestsUsers
                        const filteredUsers = connectionsUsers.filter(user =>
                            !requestsUsers.some(request => request.receiverUsername === user.userName)
                        );
                        console.log('Filtered users:', filteredUsers);

                        axios.get(`http://localhost:8000/user-contacts/${username}`)
                        .then(requestsResponse => {

                                const contacts = requestsResponse.data;
                            console.log('contacts data:', contacts);
        
                            // Filter out users from connectionsUsers if their usernames are in requestsUsers
                            const finalUsers = filteredUsers.filter(user =>
                                !contacts.some(request => request.receiveruser === user.userName)
                            );
                            console.log('final users:', finalUsers);
                            setUsers(finalUsers);
                        })
                        .catch(requestsError => {
                            console.error('Error fetching friend requests:', requestsError);
                        });
                        
                        setFriendRequests(requestsUsers);
                    })
                    .catch(requestsError => {
                        console.error('Error fetching friend requests:', requestsError);
                    });
                    console.log('Fetching Connected Users...');
            })
            .catch(connectionsError => {
                console.error('Error fetching user connections:', connectionsError);
            });
    }, []);

    const handleAddButtonClick = (userName, index) => {
        const requestData = {
            senderUsername: localStorage.getItem('username'),
            receiverUsername: userName
        };
            //    console.log(requestData);
        axios.post('http://localhost:8000/friend-requests', requestData)
            .then(response => {
                console.log('Friend request sent successfully:', response.data);
                setUsers(prevUsers => {
                    const updatedUsers = [...prevUsers];
                    updatedUsers[index].requestSent = true;
                    return updatedUsers;
                });
            })
            .catch(error => {
                console.error('Error sending friend request:', error);
            });
    };

    return (
        <div>
            <h2>ConnectionComponent</h2>
            <div className="user-cards">
                {users.map((user, index) => (
                    <div key={user.id} className="user-card">
                        <h3>Username: {user.userName}</h3>
                        <h3>Nickname: {user.nickname}</h3>
                        <h3>Date Of Birth: {user.dateOfBirth}</h3>
                        <h3>About: {user.about}</h3>
                        <h3>Country: {user.country}</h3>
                        <button
                            className="add-button"
                            onClick={() => handleAddButtonClick(user.userName, index)}
                            disabled={user.requestSent}
                        >
                            {user.requestSent ? 'Request Sent' : 'Add'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
