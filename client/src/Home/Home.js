import React from 'react';
import { withRouter } from 'react-router-dom'

import homeImage from './Images/homeImage2.jpg';
import {
  Button,
  Form, FormGroup, Label, Input, Row, Col
} from 'reactstrap'

import { HotelSearchFunction } from '../Utility/HotelSearchFunction'



var topSectionStyle = {
    marginTop:"4.5em",
  width:"100%",
  backgroundRepeat:"no-repeat",
  backgroundPosition: "center center",
  backgroundSize:"cover",
  backgroundImage: `url(${homeImage})`
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

    this.setState({
    	adult:value
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

    this.setState({
    	adult:value
    })

	}

	childrenIncrement(){
		console.log("yay");
    var value = parseInt(document.getElementById('children').value, 10);
    
    value++;
    console.log(value);

    document.getElementById('children').value = value;

    this.setState({
    	children:value
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

    this.setState({
    	children:value
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
      		}

   	    HotelSearchFunction(temp_fields).then(response => {
        console.log("status number(200 success, else fail): ")
       // if(response === 200) {
          console.log("expected reponse 200  ")
          console.log(response)
          //this.props.history.push(`/HotelSearchDemo`)
          	let queryString = "city=" + this.state.city + "&" + "date_in=" + this.state.date_in + "&" + "date_out=" + this.state.date_out + "&" + "adult=" + this.state.adult + "&" + "children=" + this.state.children;
			this.props.history.push({
			  pathname: `/HotelSearchDemo`,
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

  	<div className="home-container col-auto">

	  	<div className="top-section col-auto d-flex align-content-center justify-content-center flex-wrap" style={topSectionStyle}>
	  	  		

		  	<Form className="home-submit-form" onSubmit={this.search} method="get">
			{/*LOCATION*/} 
		  		<div className="top-header d-flex justify-content-start">
		  		Plan your next trip 
		  		</div>
		  		
	  			<FormGroup>
	  			  <div className="input-group">
	  			    <div className="input-group-prepend">
	  			      <div className="location-input-icon input-group-text"><i className="fa fa-search"></i></div>
	  			    </div>
	  			    	<Input name="city" value={this.state.city} onChange={this.handleChange} type="text" className="location-input form-control" placeholder="Where are you going?"></Input>
	  			  </div>
	  			</FormGroup>

		  	{/*INPUT DATE*/} 

		  		<div className="d-inline-flex flex-fill  ">

		  			<FormGroup>
			  			<div className=" flex-fill">
			  			    <div className="input-group date">
			  			    	<div className="input-group-append">
			  			            <div className="check-in-icon input-group-text"><i className="fa fa-calendar"></i></div>
			  			        </div>
			  			        <input name="date_in" type="text" value={this.state.date_in} onChange={this.handleChange} className="check-in-input form-control" placeholder="Check In"/>
			  			    </div>
			  			</div>
		  			</FormGroup>

		  			<FormGroup>
			  			<div className=" flex-fill">
			  			    <div className="input-group date">
			  			        <div className="input-group-append">
			  			                <div className="check-out-icon input-group-text"><i className="fa fa-calendar"></i></div>
			  			        </div>
			  			        <input name="date_out" value={this.state.date_out} onChange={this.handleChange} type="text" className="check-out-input form-control" placeholder="Check Out"/>
			  			           
			  			    </div>
			  			</div>
		  			</FormGroup>
		  		</div>




		  		<div className=" d-flex justify-content-start">
					<div id="vertical-menu">
					    <ul>
					        <li className="active">
					            	<h3><span className="plus">+</span>Guests</h3>

					            <ul>
					                <li>
					                	<div className="row">
						                	<div className="col-lg-4 home-guest-adult-header">
						                		Adults
						                	</div>

						                	<div className="col-lg-8">
					  			                <i className="fa fa-minus home-guest-icon-increment" type="button" value="Decrement Value" onClick={this.adultDecrement}></i>
							                	<input readonly className="home-guest-input" name="adult" type="text" id="adult" value={this.state.adult} onChange={this.handleChange} />
							  				 	<i className="fa fa-plus home-guest-icon-decrement" type="button" value="Increment Value" onClick={this.adultIncrement} />
						                	</div>
					                	</div>

					                	<div className="row">
						                	<div className="col-lg-4 home-guest-adult-header">
						                		Children
						                	</div>

						                	<div className="col-lg-8">
					  			                <i className="fa fa-minus home-guest-icon-increment" type="button" value="Decrement Value" onClick={this.childrenDecrement}></i>
							                	<input readonly className="home-guest-input" name="children" type="text" id="children" value={this.state.children} onChange={this.handleChange} />
							  				 	<i className="fa fa-plus home-guest-icon-decrement" type="button" value="Increment Value" onClick={this.childrenIncrement} />
						                	</div>
					                	</div>


					                </li>
					                
					            </ul>
					        </li>
					   
					    </ul>
					</div>		  		
					
		  		</div>

		  		<div class="home-submit-button-container">
		  		<button onClick={this.search} className="p-2 submit-button btn btn-danger my-2 my-sm-0" type="submit">Search</button>
		  		</div>

		  	</Form>	

	  	</div>

  	</div>
  	  );


}
}
export default withRouter(Home);