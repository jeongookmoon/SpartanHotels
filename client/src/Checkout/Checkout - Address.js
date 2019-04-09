import React, { Component } from "react";
// import NavBar from "./../NavBar/NavBar";
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import "./../App.css";

// var firstName;
// var lastName;
// var address;
// var city;
// var zip;
// var country;
// var state;



class CheckoutAddress extends Component {
 

state={
  firstName: 'test',
  lastName: '',
  address: '',
  city: '',
  zip: '',
  country: '',
  state: ''

}
/*
  handleChange(event) {
    this.setState({firstName: event.target.value})
  }
  */

handleChange = name => event => {
  this.setState({[name]: event.target.value});
}

selectCountry (val) {
  this.setState({ country: val });
}

selectRegion (val) {
  this.setState({ state: val });
}

  render(){
    const { country, state } = this.state;
  return (
    
    <div class="card text-left ">
      <h5 class="card-header">Billing Address</h5>
      <div class="card-body">
        <div class="row">
          <div class="col-md-11">
          <form >
            <div class="form-group-demo ">
              <input type="text" id="firstName" class="form-control" onChange={this.handleChange('firstName')} required />
              <label class="form-control-placeholder" for="firstName" >
                First Name
              </label>
            </div>
          

            <div class="form-group-demo">
              <input type="text" id="lastName" class="form-control" onChange={this.handleChange('lastName')} required />
              <label class="form-control-placeholder" for="lastName">
                Last Name
              </label>
            </div>


            <div class="form-group-demo">
              <input type="text" id="address" class="form-control" onChange={this.handleChange('address')} required />
              <label class="form-control-placeholder" for="address">
                Address
              </label>
            </div>

            <div class="form-group-demo">
              <input type="text" id="city" class="form-control" onChange={this.handleChange('city')} required />
              <label class="form-control-placeholder" for="city">
                City
              </label>
            </div>

            <div class="form-group-demo">
              <input type="text" id="zip" class="form-control" onChange={this.handleChange('zip')} required />
              <label class="form-control-placeholder" for="zip">
                Zipcode
              </label>
            </div>

            <div class="form-group-demo">
        <CountryDropdown
          class = 'form-control-placeholder'
          style={{position:'relative', width: '100%'}}
          value={country}
          onChange={(val) => this.selectCountry(val)} />
      </div>
    
      <div class="form-group-demo">
        <RegionDropdown
          country={country}
          class = "form-control-placeholder"
          style={{position:'relative', width: '100%'}}
          value={state}
          onChange={(val) => this.selectRegion(val)} />
      </div>


{/*         
            <div class="form-group-demo">
              <label style={{ fontSize: 12, marginLeft: 13 }} for="country">
                <span> Country</span>
              </label>
              <div
                id="country"
                class="bfh-selectbox bfh-countries "
                data-country="US"
                data-flags="true"
              >
                <input type="hidden" value="" />
                <a
                  class="bfh-selectbox-toggle "
                  role="button"
                  data-toggle="bfh-selectbox"
                  href="#"
                >
                  {" "}
                  <span
                    class="bfh-selectbox-option input-medium "
                    data-option=""
                  />{" "}
                  <b class="caret" />{" "}
                </a>
                <div class="bfh-selectbox-options">
                  <div role="listbox">
                    <ul role="option"> </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group-demo">
              <label style={{ fontSize: 12, marginLeft: 13 }} for="country">
                <span> State</span>
              </label>
              <div
                id="country"
                class="bfh-selectbox bfh-states "
                data-country="country"
                data-state="CA"
              >
                <input type="hidden" value="" />
                <a
                  class="bfh-selectbox-toggle "
                  role="button"
                  data-toggle="bfh-selectbox"
                  href="#"
                >
                  {" "}
                  <span
                    class="bfh-selectbox-option input-medium"
                    data-option=""
                  />{" "}
                  <b class="caret" />{" "}
                </a>
                <div class="bfh-selectbox-options">
                  <div role="listbox">
                    <ul role="option"> </ul>
                  </div>
                </div>
              </div>
            </div>
            */}
            </form>
            
          </div>
         
        </div>
      </div>
    </div>
  );
}
}

export default CheckoutAddress;
