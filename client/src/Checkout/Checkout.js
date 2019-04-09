import React, { Component } from "react";
// import { Button, Collapse } from "reactstrap";
import NavBar from "./../NavBar/NavBar";
import "./../App.css";
import CheckoutAddress from "./Checkout - Address";
import CheckoutPayment from "./Checkout - Payment";
import CheckoutBookingSummary from "./Checkout - BookingSummary";
import CheckoutCheck from "./Checkout - Check";

class Checkout extends Component {


  render() {
    return (

      <div class="dimScreen ">
        <NavBar />
        <form>

       
        <div class="container container-demo row ">
          <div class="w-50 ">
            <CheckoutPayment />

            <CheckoutAddress />
          </div>

          <div class="w-50 ">
            <CheckoutBookingSummary />
            <CheckoutCheck />



          </div>
        </div>
        </form>
      </div>
    );
  }
}

export default Checkout;

/* Reference for Steven



state={
  test:""
}

  handleChange(event) {
    this.setState({test: event.target.value})
  }

  <input type="text" id="firstName" class="form-control" onChange={this.handleChange.bind(this)} required />

  */
 
  /*
  npm install react-number-format --save
  npm i react-country-region-selector
  */
