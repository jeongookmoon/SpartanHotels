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
   		date_out: ''
    	
     
    };
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);


	}



  handleChange(event) {
	const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });  
}



	search = (event) => {
		console.log('Search clicked')

    	event.preventDefault()

		
	        const temp_fields = {
		        city: this.state.city,
		        date_in: this.state.date_in,
		        date_out: this.state.date_out,
      		}

   	    HotelSearchFunction(temp_fields).then(response => {
        console.log("status number(200 success, else fail): ")
       // if(response === 200) {
          console.log("expected reponse 200  ")
          console.log(response)
          //this.props.history.push(`/HotelSearchDemo`)
          	let queryString = "city=" + this.state.city + "&" + "date_in=" + this.state.date_in + "&" + "date_out=" + this.state.date_out;
			this.props.history.push({
			  pathname: `/HotelSearchDemo`,
			  search:`?${queryString}`,
			  data: response // your data array of objects
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
	  	  		

		  	<Form onSubmit={this.search} method="get">
			{/*LOCATION*/} 
		  		<div className="top-header d-flex justify-content-start">Plan your next trip </div>
		  		

		  	

		  		

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
		  			<div className="form-group flex-fill">
		  			    <div className="input-group date" id="datetimepicker4" data-target-input="nearest">
		  			    	<div className="input-group-append" data-target="#datetimepicker4" data-toggle="datetimepicker">
		  			            <div className="check-in-icon input-group-text"><i className="fa fa-calendar"></i></div>
		  			        </div>
		  			        <input name="date_in" type="text" value={this.state.date_in} onChange={this.handleChange} className="check-in-input form-control datetimepicker-input" data-target="#datetimepicker4" placeholder="Check In"/>
		  			            
		  			    </div>
		  			</div>
		  			</FormGroup>
		  			<FormGroup>
		  			<div className="form-group flex-fill">
		  			    <div className="input-group date" id="datetimepicker5" data-target-input="nearest">
		  			        <div className="input-group-append" data-target="#datetimepicker5" data-toggle="datetimepicker">
		  			                <div className="check-out-icon input-group-text"><i className="fa fa-calendar"></i></div>
		  			        </div>
		  			        <input name="date_out" value={this.state.date_out} onChange={this.handleChange} type="text" className="check-out-input form-control datetimepicker-input" data-target="#datetimepicker5" placeholder="Check Out"/>
		  			           
		  			    </div>
		  			</div>
		  			</FormGroup>
		  		</div>




		  		<div className="form-inline d-flex justify-content-start">
					<button className="guest-dropdown p-2 flex-grow-1 bd-highlight btn btn-secondary btn-lg dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					    Guest
					  </button>
					  <div className="guest-dropdown dropdown-menu p-2 flex-grow-1 bd-highlight">
					    <a className="dropdown-item p-2 flex-grow-1 bd-highlight">1</a>
					    <a className="dropdown-item p-2 flex-grow-1 bd-highlight">2</a>
					    <a className="dropdown-item p-2 flex-grow-1 bd-highlight">3</a>
					  </div>
					
                 	<button onClick={this.search} className="p-2 submit-button btn btn-danger my-2 my-sm-0" type="submit">Search</button>
		  		</div>


		  		
		  		            
		  		                
		  		            
		  		        





		  	</Form>	
		    



	  	</div>

	  	<div className="mid-section bg-light col-auto"> 	
	  		
	  	</div>

	  	<div className="bottom-section bg-primary col-auto"> 	
	  	c
	  	</div>

  	</div>
  	  );


}
}
export default withRouter(Home);