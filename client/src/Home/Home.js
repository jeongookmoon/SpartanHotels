import React from 'react';


import { withRouter } from 'react-router-dom'

import homeImage from './Images/homeImage7.jpg';
import {
  Button,
  Form, FormGroup, Label, Input, Row, Col
} from 'reactstrap'

import { HotelSearchFunction } from '../Utility/HotelSearchFunction'



var topSectionStyle = {
  width:"100%",
  backgroundRepeat:"no-repeat",
  backgroundSize:"cover",
  backgroundPosition:"center center",
  backgroundImage: `url(${homeImage})`,
};



class Home extends React.Component {

	constructor() {
    super();
    // initial modal state : false
    this.state = {
   		city: '',
   		date_in: '',
   		date_out: '',
   		adult: 0,
   		children: 0,
   		guest_number: 0,
    	
     
    };
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
    this.adultIncrement = this.adultIncrement.bind(this);
    this.adultDecrement = this.adultDecrement.bind(this);
    this.childrenIncrement = this.childrenIncrement.bind(this);
    this.childrenDecrement = this.childrenDecrement.bind(this);

	}


  	handleChange(event) {
		const target = event.target;
    	const value = target.type === 'checkbox' ? target.checked : target.value;
    	const name = target.name;

    	this.setState({
      	[name]: value
    	});  
	}

	adultIncrement(){
		console.log("yay");
    var value = parseInt(document.getElementById('adult').value, 10);
    
    value++;
    console.log(value);

    document.getElementById('adult').value = value;
    var guest_number = parseInt(document.getElementById('adult').value, 10) + parseInt(document.getElementById('children').value, 10)


    this.setState({
    	adult:value,
    	guest_number:guest_number

    })

	}

	adultDecrement(){
		console.log("yay");
    var value = parseInt(document.getElementById('adult').value, 10);
    
    if (value != 0){
    value--;
	}
    console.log(value);

    document.getElementById('adult').value = value;
    var guest_number = parseInt(document.getElementById('adult').value, 10) + parseInt(document.getElementById('children').value, 10)


    this.setState({
    	adult:value,
    	guest_number:guest_number

    })

	}

	childrenIncrement(){
		console.log("yay");
    var value = parseInt(document.getElementById('children').value, 10);
    
    value++;
    console.log(value);

    document.getElementById('children').value = value;
    var guest_number = parseInt(document.getElementById('adult').value, 10) + parseInt(document.getElementById('children').value, 10)


    this.setState({
    	children:value,
    	guest_number:guest_number

    })

	}

	childrenDecrement(){
		console.log("yay");
    var value = parseInt(document.getElementById('children').value, 10);
    
    if (value != 0){
    value--;
	}
    console.log(value);

    document.getElementById('children').value = value;
    var guest_number = parseInt(document.getElementById('adult').value, 10) + parseInt(document.getElementById('children').value, 10)


    this.setState({
    	children:value,
    	guest_number:guest_number
    })

	}



	search = (event) => {
		console.log('Search clicked')

    	event.preventDefault()

		
	        const temp_fields = {
		        city: this.state.city,
		        date_in: this.state.date_in,
		        date_out: this.state.date_out,
		        adult: this.state.adult,
		        children: this.state.children,
		        guest_number:this.state.guest_number,
      		}

   	    HotelSearchFunction(temp_fields).then(response => {
        console.log("status number(200 success, else fail): ")
       // if(response === 200) {
          console.log("expected reponse 200  ")
          console.log(response)
          //this.props.history.push(`/HotelSearchDemo`)
          	let queryString = "city=" + this.state.city + "&" + "date_in=" + this.state.date_in + "&" + "date_out=" + this.state.date_out + "&" + "adult=" + this.state.adult + "&" + "children=" + this.state.children + "&" + "guest_number=" + this.state.guest_number;
			this.props.history.push({
			  pathname: `/HotelSearch`,
			  search:`?${queryString}`,
			  data: response, // your data array of objects
			  city: this.state.city,
		        date_in: this.state.date_in,
		        date_out: this.state.date_out,
		        adult: this.state.adult,
		        children: this.state.children,
			})

        //   loginPost(temp_fields).then(loginresponse => {
        //     if(loginresponse === "S") {
        //       console.log("login success")
        //     } else if (loginresponse === "F") {
        //       console.log("login fail")
        //     }
        //     this.props.history.push(`/`)
        // })
      //  } else if (response === 400) {
      //    console.log("expected reponse 400 ")
        //  console.log(response)
        //  this.props.history.push(`/`)
        //}  
    })
      	
	}

  render() {


	

  return (

  	<div className="col-lg-12 home-container col-auto" style={topSectionStyle}>

  		<div className="home-form-container col-lg-12">
  		
	  		<Form className="home-form col-lg-12">
	  			<div className="top-header ">
		  			Plan your next trip 
		  		</div>

		  		<FormGroup className="form-inline home-form-inputs">

		  			  <div className="col-lg-1"></div>

		  			  <div className="col-lg-3 input-group home-location">
		  			    <div className="input-group-append">
		  			      <div className="location-input-icon input-group-text"><i className="fa fa-search"></i></div>
		  			    </div>
		  			    	<input name="city" ref={this.autocompleteInput} id="autocomplete" value={this.state.city} onChange={this.handleChange} type="text" className="location-input form-control" placeholder="Where?"></input>
		  			  </div>

	  			      <div className="col-lg-2 input-group home-date">
	  			      	  <div className="input-group-append">
	  			              <div className="check-in-icon input-group-text"><i className="fa fa-calendar"></i></div>
	  			          </div>
	  			          <input name="date_in" type="text" value={this.state.date_in} onChange={this.handleChange} className="check-in-input form-control" placeholder="Check In"/>
	  			      </div>

	  			      <div className="col-lg-2 input-group home-date">
	  			      	  <div className="input-group-append">
	  			              <div className="check-in-icon input-group-text"><i className="fa fa-calendar"></i></div>
	  			          </div>
	  			          <input name="date_out" type="text" value={this.state.date_out} onChange={this.handleChange} className="check-in-input form-control" placeholder="Check Out"/>
	  			      </div>

	  		


			  		<div className=" col-lg-2 input-group menu-container">


						<div className="col-lg-12 menu-item">
							<div className="home-guest-dropdown">{this.state.guest_number === 0 ? null : this.state.guest_number}&nbsp;Guests</div>
							<ul>
								<li>
					                	<div className="form-inline home-adults-container">
						                	<div className="col-lg-3 home-adults">
						                		Adults
						                	</div>

						                	<div className="col-lg-9 home-increments">
					  			                <i className="fa fa-minus home-guest-icon-increment" type="button" value="Decrement Value" onClick={this.adultDecrement}></i>
							                	<input readOnly className="home-guest-input" name="adult" type="text" id="adult" value={this.state.adult} onChange={this.handleChange} />
							  				 	<i className="fa fa-plus home-guest-icon-decrement" type="button" value="Increment Value" onClick={this.adultIncrement} />
						                	</div>
					                	</div>

					                	<div className="form-inline home-children-container">
						                	<div className="col-lg-3 home-children">
						                		Children
						                	</div>

						                	<div className="col-lg-9 home-increments">
					  			                <i className="fa fa-minus home-guest-icon-increment" type="button" value="Decrement Value" onClick={this.childrenDecrement}></i>
							                	<input readOnly className="home-guest-input" name="children" type="text" id="children" value={this.state.children} onChange={this.handleChange} />
							  				 	<i className="fa fa-plus home-guest-icon-decrement" type="button" value="Increment Value" onClick={this.childrenIncrement} />
						                	</div>
					                	</div>


					                </li>
							</ul>
						</div>			  		


						  		
					
		  			</div>

		  		<div className="col-lg-1 home-submit-button-container">
		  		<button onClick={this.search} className="p-2 submit-button btn btn-danger my-2 my-sm-0" type="submit">Search</button>
		  		</div>


	  			</FormGroup>

	  			

	  		</Form>
  		
  		</div>
  		
  		
	  	

  	</div>
  	  );


}
}
export default withRouter(Home);