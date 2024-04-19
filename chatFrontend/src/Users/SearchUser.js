import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import '../css/SearchBarComponent.css';

export default function SearchBar() {
  const [searchText, setSearchText] = useState('');
  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
    // Fetch all registered usernames from the backend
    axios.get('http://localhost:8888/usernames')
      .then(response => {
        setUsernames(response.data);
      })
      .catch(error => {
        console.error('Error fetching usernames:', error);
      });
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredUsernames = usernames.filter(username =>
    username.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="searchBar">
      <input
        type="text"
        placeholder="Search..."
        className="searchInput"
        value={searchText}
        onChange={handleSearchInputChange}
      />
      <Link to="/searchuser">
        <FaSearch className="searchIcon" />
      </Link>
      <div className="userList">
        {filteredUsernames.map(username => (
          <div key={username} className="username">
            {username}
          </div>
        ))}
      </div>
    </div>
  );
}
