import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaBell, FaUser, FaUserPlus } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';
import { MdOutlinePendingActions } from 'react-icons/md';
import { Link } from 'react-router-dom';
import '../css/NavbarComponent.css';

export const NavbarComponent = ({ handleAddPeopleClick, handleLogoClick }) => {
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [contacts , setContacts] = useState([]);
  const [requestName , setRequestName ] = useState([]);
  const username = localStorage.getItem('username');
  const [btn , setBtn] = useState("");

  useEffect(() => {
    fetchData();
  }, [searchValue]);

  useEffect(() => {
    if (users && users.length > 0) {
      setFilteredUsers(
        users.filter(user =>
          user.userName && user.userName.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
      console.log("filter : ", filteredUsers);
    }
  }, [searchValue, users]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/users/connections/${username}`);
      if (response.data) {
        const allUsers = response.data;
        setUsers(allUsers);
        console.log("navbar", response.data);
      }
  
      const requestsResponse = await axios.get(`http://localhost:8000/user-contacts/${username}`);
      const contact = requestsResponse.data;
      setContacts(contact);
      console.log('contacts data:', contact);
  
      const requestsUsersResponse = await axios.get(`http://localhost:8000/friend-requests/sender/${username}`);
      const requestsUsers = requestsUsersResponse.data;
      console.log("reuest : ", requestsUsers);
      setRequestName(requestsUsers);
     
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleAddButtonClick = (userName, index) => {
    setBtn( userName);
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
const handleLogout=  ()=>{

  axios.post('http://localhost:8000/logout',localStorage.getItem('username'))
  .then(response=>{
   
  })
  .catch(error => {
    console.error('Error sending friend request:', error);
});

}


  return (
    <div className="navbar">
      <div className="logo" onClick={handleLogoClick}>
        Chat
      </div>
      <div className="searchBar">
        <input
          type="text"
          placeholder="Search..."
          className="searchInput"
          value={searchValue}
          onChange={handleSearchChange}
        />
        <FaSearch className="searchIcon" />
      </div>
      <div className="icons">
        <div className="addPeople" onClick={handleAddPeopleClick}>
          <FaUserPlus size={30} />
        </div>
        <div className="notification">
          <Link to={'/notification'}>
            <FaBell size={25} />
          </Link>
        </div>
        <div className="requests">
          <Link to={'/requests'}>
            <MdOutlinePendingActions size={25} />
          </Link>
        </div>
        <div className="logout">
          <Link to="/">
            <IoMdLogOut size={25}  onClick={handleLogout}/>
          </Link>
        </div>
        <div className="profile">
          <Link to="/viewprofile">
            <FaUser size={25} />
          </Link>
        </div>
      </div>
      {/* Search Modal */}
      {searchValue && (
        <div className="searchModal">
          <ul>
            {filteredUsers.map((user , index)=> (
          <li key={user.id}>
          {user.userName}
          {!contacts.some(contact => contact.receiveruser === user.userName) &&
 !requestName.some(name => name.receiverUsername === user.userName) ? (
    <button className="addButton" onClick={() => handleAddButtonClick(user.userName, index)}>
      {btn===user.userName ? "Request Sent" : "Add"}
    </button>
  ) : null}

        </li>
        
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
