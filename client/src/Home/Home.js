import React from 'react';
import homeImage from './Images/homeImage2.jpg';

var topSectionStyle = {
    marginTop:"4.5em",
  width:"100%",
  backgroundRepeat:"no-repeat",
  backgroundPosition: "center center",
  backgroundSize:"cover",
  backgroundImage: `url(${homeImage})`
};

function Home(props) {
  return (

  	<div className="home-container col-auto">

	  	<div className="top-section col-auto d-flex align-content-center justify-content-center flex-wrap" style={topSectionStyle}>
	  	  		

		  	<form>
			{/*LOCATION*/} 
		  		<div className="top-header d-flex justify-content-start">Plan your next trip </div>
		  		

		  	

		  		


		  			  <div className="input-group">
		  			    <div className="input-group-prepend">
		  			      <div className="location-input-icon input-group-text"><i className="fa fa-search"></i></div>
		  			    </div>
		  			    <input type="location" className="location-input form-control" placeholder="Where are you going?"></input>
		  			  </div>
		  		

		  	{/*INPUT DATE*/} 
		  		<div className="d-inline-flex flex-fill  ">

		  			<div className="form-group flex-fill">
		  			    <div className="input-group date" id="datetimepicker4" data-target-input="nearest">
		  			    	<div className="input-group-append" data-target="#datetimepicker4" data-toggle="datetimepicker">
		  			            <div className="check-in-icon input-group-text"><i className="fa fa-calendar"></i></div>
		  			        </div>
		  			        <input type="text" className="check-in-input form-control datetimepicker-input" data-target="#datetimepicker4" placeholder="Check In"/>
		  			            
		  			    </div>
		  			</div>
		  			<div className="form-group flex-fill">
		  			    <div className="input-group date" id="datetimepicker5" data-target-input="nearest">
		  			        <div className="input-group-append" data-target="#datetimepicker5" data-toggle="datetimepicker">
		  			                <div className="check-out-icon input-group-text"><i className="fa fa-calendar"></i></div>
		  			        </div>
		  			        <input type="text" className="check-out-input form-control datetimepicker-input" data-target="#datetimepicker5" placeholder="Check Out"/>
		  			           
		  			    </div>
		  			</div>
		  		</div>



		  	{/*GUESTS 

		  		<div classNameName="form-inline d-flex justify-content-start">

			  		<div className="input-group">
			  		  <input type="text" className="form-control" aria-label="Text input with dropdown button"></input>
			  		  <div className="input-group-append">
			  		    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</button>
			  		    <div className="dropdown-menu">
			  		      <a className="dropdown-item" href="#">Action</a>
			  		      <a className="dropdown-item" href="#">Another action</a>
			  		      <a className="dropdown-item" href="#">Something else here</a>
			  		      <div role="separator" className="dropdown-divider"></div>
			  		      <a className="dropdown-item" href="#">Separated link</a>
			  		    </div>
			  		  </div>
			  		</div>
		  		</div>
		  		*/}

		  		<div className="form-inline d-flex justify-content-start">
					<button className="guest-dropdown p-2 flex-grow-1 bd-highlight btn btn-secondary btn-lg dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					    Guest
					  </button>
					  <div className="guest-dropdown dropdown-menu p-2 flex-grow-1 bd-highlight">
					    <a className="dropdown-item p-2 flex-grow-1 bd-highlight" href="#">Action</a>
					    <a className="dropdown-item p-2 flex-grow-1 bd-highlight" href="#">Another action</a>
					    <a className="dropdown-item p-2 flex-grow-1 bd-highlight" href="#">Something else here</a>
					  </div>
                 	<button className="p-2 submit-button btn btn-danger my-2 my-sm-0" type="submit">Search</button>
		  		</div>


		  		
		  		            
		  		                
		  		            
		  		        
{/*
		  		<div className="form-inline d-flex justify-content-center">
		  			<input></input>
		  			<div className="form-group">
		  			    <div className="input-group date" id="datetimepicker4" data-target-input="nearest">
		  			        <input type="text" className="form-control datetimepicker-input" data-target="#datetimepicker4" placeholder="Check Out"/>
		  			            <div className="input-group-append" data-target="#datetimepicker4" data-toggle="datetimepicker">
		  			                <div className="input-group-text"><i className="fa fa-calendar"></i></div>
		  			            </div>
		  			    </div>
		  			</div>
		  		</div>
*/}





		  	</form>	
		    



	  	</div>

	  	<div className="mid-section bg-light col-auto"> 	
	  		
	  	</div>

	  	<div className="bottom-section bg-primary col-auto"> 	
	  	c
	  	</div>

  	</div>
  	  );


}

export default Home;