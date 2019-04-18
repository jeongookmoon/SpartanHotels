import React, { Component } from "react";
// import NavBar from "./../NavBar/NavBar";
import "./../App.css";
import axios from 'axios'
import { withRouter } from 'react-router-dom'


class CheckoutBookingSummary extends Component {

  constructor(props) {
    super(props);
    console.log("this.props.location.search");
    console.log(this.props.location.search);
    let params = new URLSearchParams(this.props.location.search);
    let zipcode_value = params.get('zip')
    console.log("hotel_id");
    console.log(zipcode_value);
    this.state = {
      hotels: {},
      zipcode: zipcode_value
    };
  }

  async componentWillMount() {
    let queryCall = '/api/search/hotels' + this.props.location.search + '&zip=' + this.zipcode
    const hotelSearch = (await axios.get(queryCall)).data;
    this.setState({
      hotels: hotelSearch
    });
    console.log("hotelSearch");
    console.log(hotelSearch);
  }

  render() {
    if (!this.state.hotels.results) {
      return (
        <div className="hotel-search-container"> Loading </div>
      );
    }
    else {
      return (
        <div class="card text-center h-50">
          <h5 class="card-header">Booking Summary</h5>
          <div class="card-body">
            <div class="col" />
            <h4>
              <br />
              <p class="font-weight-bold" >{this.state.hotels.results[0].name}</p>


              <p class="font-weight-light">{this.state.hotels.results[0].country}</p>
              <p class="font-weight-light">{this.state.hotels.results[0].state}</p>
              <p class="font-weight-light">{this.state.hotels.results[0].city}</p>
              <p class="font-weight-light">{this.state.hotels.results[0].address}</p>
              <p class="font-weight-light text-muted ">2 King Beds</p>
              <small class="text-muted">{this.state.hotels.results[0].amenities}</small>
            </h4>
          </div>
        </div>
      );
    }
  }
}

export default withRouter(CheckoutBookingSummary);
