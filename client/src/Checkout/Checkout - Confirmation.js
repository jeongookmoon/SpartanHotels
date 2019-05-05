import React, {Component} from 'react';
import {CardElement, injectStripe, CardCVCElement,CardNumberElement, CardExpiryElement, PostalCodeElement} from 'react-stripe-elements';

import {withRouter} from 'react-router-dom'


var testPay;
var rewardPoint = "1000";
var cost = "59.99";
var discount;
var rewardPointUsed = "1000";
var total;
var tempTotal = cost * 1.10;
var tempReward;
var tax;




class CheckoutConfirm extends Component {




 constructor(props) {
  super(props);
  this.state = {complete: false};
}



 state={
   //Payment
    id: '',
    email: '',
    

  }

 handleChange = name => event => {
    this.setState({[name]: event.target.value});
  }
  
  
 render() {
  const { match, location, history } = this.props;

  return (
  <div class="card text-left ">
      <h5 class="card-header">Payment Method</h5>
      <div class="card-body">
        <div class="row">
         
         <h1>Purchse Complete!</h1>
         {/*
         <p>Receipt:</p>
         <p>ID: {this.state.charge}</p>
         <p>Email: {this.state.email}</p>
         
         */}


        </div>
      </div>
    </div>
  
  );
}
}

export default withRouter(CheckoutConfirm);