import React, { Component } from 'react';
import NavBar from './NavBar/NavBar';
import Home from './Home/Home';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
      <NavBar/>
      <Home/>
      </div>
    );
  }
}

export default App;
