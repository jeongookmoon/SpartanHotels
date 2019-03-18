import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import NavBar from './NavBar/NavBar';
import Home from './Home/Home';
import HotelSearch from './HotelSearch/HotelSearch';
import HotelSearchDemo from './HotelSearchDemo/HotelSearchDemo';
import UserProfile from './UserProfile/UserProfile';
import Reservations from './Reservations/Reservations'
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <NavBar />
          <Route exact path="/" component={Home} />
          <Route exact path="/UserProfile" component={UserProfile}/>
          <Route exact path="/Reservations" component={Reservations}/>
          <Route exact path="/HotelSearchDemo" component={HotelSearchDemo}/>
        </div>
      </Router>

    );
  }
}

export default App;
