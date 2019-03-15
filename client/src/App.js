import React, { Component } from 'react';
import NavBar from './NavBar/NavBar';
import Home from './Home/Home';
import HotelSearch from './HotelSearch/HotelSearch';
import HotelSearchDemo from './HotelSearchDemo/HotelSearchDemo';
import UserProfile from './UserProfile/UserProfile';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
      <NavBar/>
      <HotelSearchDemo/>
      </div>
    );
  }
}

export default App;
