import React, { Component } from 'react';
import NavBar from './NavBar/NavBar';
import Home from './Home/Home';
import HotelSearch from './HotelSearch/HotelSearch';
import UserProfile from './UserProfile/UserProfile';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
      <NavBar/>
      <HotelSearch/>
      </div>
    );
  }
}

export default App;
