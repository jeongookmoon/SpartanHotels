import React, { Component } from "react";
import NavBar from "./../NavBar/NavBar";
import "./../App.css";


class CheckoutBookingSummary extends Component {


  render(){
  return (
    <div class="card text-center h-50">
      <h5 class="card-header">Booking Summary</h5>
      <div class="card-body">
        <div class="col" />
        <h4>
          <br/>
        <p class="font-weight-bold" >Days Inn by Wyndham Glendale Los Angeles</p>
    

        <p class="font-weight-light">United States of America</p>
        <p class="font-weight-light">California</p>
        <p class="font-weight-light">Los Angeles</p>
        <p class="font-weight-light">450 West Pioneer Drive</p>
        <p class="font-weight-light text-muted ">2 King Beds</p>
        <small class="text-muted">WiFi, TV, Air Conditioning, Balcony, Bathtub, Pool</small>
        </h4>
      </div>
    </div>
  );
}
}

export default CheckoutBookingSummary;
