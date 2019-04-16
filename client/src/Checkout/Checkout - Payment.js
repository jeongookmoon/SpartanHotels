import React, { Component } from "react";
// import NavBar from "./../NavBar/NavBar";
import "./../App.css";

// var cardNumber;
// var cardName;
// var cardMonth;
// var cardYear;
// var cardCVV;


class CheckoutPayment extends Component {


  state={
    cardNumber: '',
    cardName: '',
    cardMonth: '',
    cardYear: '',
    cardCVV: ''
  }

  handleChange = name => event => {
    this.setState({[name]: event.target.value});
  }

  render(){
  return (
    <div class="card text-left ">
      <h5 class="card-header">Payment Method</h5>
      <div class="card-body">
        <div class="row">
          <div class="col-md-11">
          <form>
            <div class="form-group-demo"> 
             <img src="https://images-na.ssl-images-amazon.com/images/I/61cL%2BM-SN%2BL._SL1283_.jpg"  alt="image1" width="405.5" height="153.5"/>{" "}
            </div>
            <div class="form-group-demo">
              <input
                type="text"
                id="cardNumber"
                class="form-control"
                onChange={this.handleChange('cardNumber')}
                required
              />
              <label class="form-control-placeholder" for="cardNumber">
                Card Number
              </label>
            </div>
         

            <div class="form-group-demo">
              <input type="text" id="cardName" class="form-control"  onChange={this.handleChange('cardName')} required />
              <label class="form-control-placeholder" for="cardName">
                Cardholder Name
              </label>
            </div>

           

            <div class="form-group-demo row">
              <div
                class="form-group-demo "
                style={{ paddingLeft: 15, marginTop: 8 }}
              >
                <span style={{ fontSize: 12, marginLeft: 13 }}>MM</span>

                <select
                  class="form-control"
                  id="cardMonth"
                  style={{ width: 80 }}
                  onChange={this.handleChange('cardMonth')}
                  required
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </select>
              </div>

             

              <div
                class="form-group-demo "
                style={{ paddingLeft: 30, marginTop: 8 }}
              >
                <span style={{ fontSize: 12, marginLeft: 13 }}>YYYY</span>
                <div>
                  <select
                    class="form-control"
                    id="cardYear"
                    style={{ width: 130 }}
                    onChange={this.handleChange('cardYear')}
                    required
                  >
                    <option>2019</option>
                    <option>2020</option>
                    <option>2021</option>
                    <option>2022</option>
                    <option>2023</option>
                    <option>2024</option>
                    <option>2025</option>
                    <option>2026</option>
                    <option>2027</option>
                    <option>2028</option>
                    <option>2029</option>
                    <option>2030</option>
                    <option>2031</option>
                    <option>2032</option>
                    <option>2033</option>
                    <option>2034</option>
                    <option>2035</option>
                  </select>
                </div>
              </div>

      

              <div
                class="form-group-demo"
                style={{ marginTop: 29, paddingLeft: 30 }}
              >
                <input type="text" id="cardCVV" class="form-control"  onChange={this.handleChange('cardCVV')} required />
                <label class="form-control-placeholder" for="cardCVV">
                  CVV
                </label>
              </div>


            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
}

export default CheckoutPayment;

// When Checkout is pressed, the reward Point and money is actually subtracted