import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/ViewProfileComponent.css';

export default function ViewProfile() {
  const [user, setUser] = useState({
    username: '',
    nickname: '',
    email: '',
    about: '',
    dateOfBirth: '',
    country: ''
  });

  const username = localStorage.getItem('username');

  useEffect(() => {
    // Fetch user data from the backend and populate the form
    axios.get(`http://localhost:8000/users/${username}`)
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [username]);

  return (
    <div className="view-profile-container">
      <h2>Profile</h2>
      <div className="profile-box">
        <div className="button-group">
          <Link to="/editprofile" className="edit-profile-link">Edit</Link>
          <Link to="/home" className="back-link">Back</Link>
        </div>
        <div className="view-profile-form">
          <div className="form-group">
            <label>Username:</label>
            <div>{username}</div>
          </div>
          <div className="form-group">
            <label>Nickname:</label>
            <div>{user.nickname}</div>
          </div>
          <div className="form-group">
            <label>Email:</label>
            <div>{user.email}</div>
          </div>
          <div className="form-group">
            <label>Date of Birth:</label>
            <div>{user.dateOfBirth}</div>
          </div>
          <div className="form-group">
            <label>Country:</label>
            <div>{user.country}</div>
          </div>
          <div className="form-group">
            <label>About:</label>
            <div>{user.about}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
