import React from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import { withRouter } from 'react-router-dom'
import axios from 'axios'




const mapStyles = {
  width: '100%',
  height: '100%'
};



class HotelSearchDemo extends React.Component {

	constructor(props) {


    super(props);

    	const {data} = this.props.location;


    this.state = {
        hotels: [{}]
    };

   


  }


  async componentWillMount() {
    const hotelSearch = (await axios.get('/api/search/hotels?state=California&date_in=2019-03-08&date_out=2019-03-21')).data;
    this.setState({
      hotels:hotelSearch
    });
    console.log(hotelSearch);
        	  	  console.log(this.state.hotels.results[0]);

  }


  content() {



  }

  render() {

  	if(this.state.hotels.results === undefined){
  		return <div> Loading...</div>
  	}


    return (


  	
      <div className="hotel-search-container">
  {/* FILTER

      		<div className="hotel-search-filter row">
      			<div className="col-lg-12 row">
      				<div className="col-lg-4">
      				
      				</div>
      				<div className="col-lg-4">
      				asd
      				</div>
      				<div className="col-lg-4">
      				asd
      				</div>
      			</div>
      		</div>

  */}

  		<div>
  		</div>

{/* HOTEL SEARCH TWO COLUMNS */}
  			<div className="hotel-search-columns row">

  				<div className="col-lg-4 hotel-demo-dummy-column">
  					<div className="hotel-search-table-container-demo">
  						<div className="hotel-search-first-column-demo col-lg-12">
		  				  <div>
		  				  	City {this.state.hotels.results[0].name}
		  				  </div>
		  				  <div>
		  				  	Date in
		  				  </div>
		  				  <div>
		  				  </div>
		  				  	Date out
		  				</div>
  					</div>
  				</div>
	  			<div className="col-lg-8 hotel-search-first-column-dummy table-responsive">
	  				<div className="hotel-search-table-container">
		  				<table className="table hotel-search-table">
		  				  <tbody>
		  				    <tr className="hotel-search-row shadow-sm p-3 mb-5 bg-white rounded">


		  				      <td> 
		  				      	<img className="hotel-search-row-image" src={process.env.PUBLIC_URL + '/hotel.jpeg'} alt="logo" />

		  				      </td>
		  				      <td>
		  				      	<div>
		  				      		<div className="hotel-search-item-row hotel-search-item-header">
			  				      		<div className="hotel-search-item-number">1</div>
			  				      		<div>.</div>
			  				      		<a href="#" className="hotel-search-item-name">The Grand Hotel</a>
		  				      		</div>

		  				      		<div className="hotel-search-item-row hotel-search-item-rating"> 

			  				      		<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star"></span>

									</div>

		  				      		<div className="hotel-search-item-row">231 Dixon Landing Rd</div>
		  				      		<div className="hotel-search-item-row">San Francisco</div>
		  				      		<div className="hotel-search-item-row"> 408-726-2698 </div>

		  				      	</div>

		  				      </td>
		  				      <td>
		  				      	<div>
		  				      		<div className="hotel-search-item-row">
				  				      	<div className="hotel-search-item-min-price">
				  				      		$200
				  				      	</div>

				  				      	<div className="hotel-search-item-min-price">
				  				      		-
				  				      	</div> 

				  				      	<div className="hotel-search-item-min-price">
				  				      		$200
				  				      	</div>
			  				      	</div>

			  				      	<br></br>

			  				      	<div className="">
                 						<button className="p-2 hotel-search-item-button btn my-2 my-sm-0 hotel-search-item-row" type="submit">Choose Room</button>
		  				      		</div>
		  				      	</div>
		  				      	

		  				      </td>

		  				    </tr>

		  				    <tr className="hotel-search-row shadow-sm p-3 mb-5 bg-white rounded">


		  				      <td> 
		  				      	<img className="hotel-search-row-image" src={process.env.PUBLIC_URL + '/hotel.jpeg'} alt="logo" />

		  				      </td>
		  				      <td>
		  				      	<div>
		  				      		<div className="hotel-search-item-row hotel-search-item-header">
			  				      		<div className="hotel-search-item-number">1</div>
			  				      		<div>.</div>
			  				      		<a href="#" className="hotel-search-item-name">The Grand Hotel</a>
		  				      		</div>

		  				      		<div className="hotel-search-item-row hotel-search-item-rating"> 

			  				      		<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star"></span>

									</div>

		  				      		<div className="hotel-search-item-row">231 Dixon Landing Rd</div>
		  				      		<div className="hotel-search-item-row">San Francisco</div>
		  				      		<div className="hotel-search-item-row"> 408-726-2698 </div>

		  				      	</div>

		  				      </td>
		  				      <td>
		  				      	<div>
		  				      		<div className="hotel-search-item-row">
				  				      	<div className="hotel-search-item-min-price">
				  				      		$200
				  				      	</div>

				  				      	<div className="hotel-search-item-min-price">
				  				      		-
				  				      	</div> 

				  				      	<div className="hotel-search-item-min-price">
				  				      		$200
				  				      	</div>
			  				      	</div>

			  				      	<br></br>

			  				      	<div className="">
                 						<button className="p-2 hotel-search-item-button btn my-2 my-sm-0 hotel-search-item-row" type="submit">Choose Room</button>
		  				      		</div>
		  				      	</div>
		  				      	

		  				      </td>

		  				    </tr>

		  				    <tr className="hotel-search-row shadow-sm p-3 mb-5 bg-white rounded">


		  				      <td> 
		  				      	<img className="hotel-search-row-image" src={process.env.PUBLIC_URL + '/hotel.jpeg'} alt="logo" />

		  				      </td>
		  				      <td>
		  				      	<div>
		  				      		<div className="hotel-search-item-row hotel-search-item-header">
			  				      		<div className="hotel-search-item-number">1</div>
			  				      		<div>.</div>
			  				      		<a href="#" className="hotel-search-item-name">The Grand Hotel</a>
		  				      		</div>

		  				      		<div className="hotel-search-item-row hotel-search-item-rating"> 

			  				      		<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star"></span>

									</div>

		  				      		<div className="hotel-search-item-row">231 Dixon Landing Rd</div>
		  				      		<div className="hotel-search-item-row">San Francisco</div>
		  				      		<div className="hotel-search-item-row"> 408-726-2698 </div>

		  				      	</div>

		  				      </td>
		  				      <td>
		  				      	<div>
		  				      		<div className="hotel-search-item-row">
				  				      	<div className="hotel-search-item-min-price">
				  				      		$200
				  				      	</div>

				  				      	<div className="hotel-search-item-min-price">
				  				      		-
				  				      	</div> 

				  				      	<div className="hotel-search-item-min-price">
				  				      		$200
				  				      	</div>
			  				      	</div>

			  				      	<br></br>

			  				      	<div className="">
                 						<button className="p-2 hotel-search-item-button btn my-2 my-sm-0 hotel-search-item-row" type="submit">Choose Room</button>
		  				      		</div>
		  				      	</div>
		  				      	

		  				      </td>

		  				    </tr>

		  				    <tr className="hotel-search-row shadow-sm p-3 mb-5 bg-white rounded">


		  				      <td> 
		  				      	<img className="hotel-search-row-image" src={process.env.PUBLIC_URL + '/hotel.jpeg'} alt="logo" />

		  				      </td>
		  				      <td>
		  				      	<div>
		  				      		<div className="hotel-search-item-row hotel-search-item-header">
			  				      		<div className="hotel-search-item-number">1</div>
			  				      		<div>.</div>
			  				      		<a href="#" className="hotel-search-item-name">The Grand Hotel</a>
		  				      		</div>

		  				      		<div className="hotel-search-item-row hotel-search-item-rating"> 

			  				      		<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star"></span>

									</div>

		  				      		<div className="hotel-search-item-row">231 Dixon Landing Rd</div>
		  				      		<div className="hotel-search-item-row">San Francisco</div>
		  				      		<div className="hotel-search-item-row"> 408-726-2698 </div>

		  				      	</div>

		  				      </td>
		  				      <td>
		  				      	<div>
		  				      		<div className="hotel-search-item-row">
				  				      	<div className="hotel-search-item-min-price">
				  				      		$200
				  				      	</div>

				  				      	<div className="hotel-search-item-min-price">
				  				      		-
				  				      	</div> 

				  				      	<div className="hotel-search-item-min-price">
				  				      		$200
				  				      	</div>
			  				      	</div>

			  				      	<br></br>

			  				      	<div className="">
                 						<button className="p-2 hotel-search-item-button btn my-2 my-sm-0 hotel-search-item-row" type="submit">Choose Room</button>
		  				      		</div>
		  				      	</div>
		  				      	

		  				      </td>

		  				    </tr>

		  				    <tr className="hotel-search-row shadow-sm p-3 mb-5 bg-white rounded">


		  				      <td> 
		  				      	<img className="hotel-search-row-image" src={process.env.PUBLIC_URL + '/hotel.jpeg'} alt="logo" />

		  				      </td>
		  				      <td>
		  				      	<div>
		  				      		<div className="hotel-search-item-row hotel-search-item-header">
			  				      		<div className="hotel-search-item-number">1</div>
			  				      		<div>.</div>
			  				      		<a href="#" className="hotel-search-item-name">The Grand Hotel</a>
		  				      		</div>

		  				      		<div className="hotel-search-item-row hotel-search-item-rating"> 

			  				      		<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star"></span>

									</div>

		  				      		<div className="hotel-search-item-row">231 Dixon Landing Rd</div>
		  				      		<div className="hotel-search-item-row">San Francisco</div>
		  				      		<div className="hotel-search-item-row"> 408-726-2698 </div>

		  				      	</div>

		  				      </td>
		  				      <td>
		  				      	<div>
		  				      		<div className="hotel-search-item-row">
				  				      	<div className="hotel-search-item-min-price">
				  				      		$200
				  				      	</div>

				  				      	<div className="hotel-search-item-min-price">
				  				      		-
				  				      	</div> 

				  				      	<div className="hotel-search-item-min-price">
				  				      		$200
				  				      	</div>
			  				      	</div>

			  				      	<br></br>

			  				      	<div className="">
                 						<button className="p-2 hotel-search-item-button btn my-2 my-sm-0 hotel-search-item-row" type="submit">Choose Room</button>
		  				      		</div>
		  				      	</div>
		  				      	

		  				      </td>

		  				    </tr>

		  				    <tr className="hotel-search-row shadow-sm p-3 mb-5 bg-white rounded">


		  				      <td> 
		  				      	<img className="hotel-search-row-image" src={process.env.PUBLIC_URL + '/hotel.jpeg'} alt="logo" />

		  				      </td>
		  				      <td>
		  				      	<div>
		  				      		<div className="hotel-search-item-row hotel-search-item-header">
			  				      		<div className="hotel-search-item-number">1</div>
			  				      		<div>.</div>
			  				      		<a href="#" className="hotel-search-item-name">The Grand Hotel</a>
		  				      		</div>

		  				      		<div className="hotel-search-item-row hotel-search-item-rating"> 

			  				      		<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star hotel-search-item-rating-checked"></span>
										<span className="fa fa-star"></span>

									</div>

		  				      		<div className="hotel-search-item-row">231 Dixon Landing Rd</div>
		  				      		<div className="hotel-search-item-row">San Francisco</div>
		  				      		<div className="hotel-search-item-row"> 408-726-2698 </div>

		  				      	</div>

		  				      </td>
		  				      <td>
		  				      	<div>
		  				      		<div className="hotel-search-item-row">
				  				      	<div className="hotel-search-item-min-price">
				  				      		$200
				  				      	</div>

				  				      	<div className="hotel-search-item-min-price">
				  				      		-
				  				      	</div> 

				  				      	<div className="hotel-search-item-min-price">
				  				      		$200
				  				      	</div>
			  				      	</div>

			  				      	<br></br>

			  				      	<div className="">
                 						<button className="p-2 hotel-search-item-button btn my-2 my-sm-0 hotel-search-item-row" type="submit">Choose Room</button>
		  				      		</div>
		  				      	</div>
		  				      	

		  				      </td>

		  				    </tr>

		  				    
	    
		  				    
		  				    

		  				  </tbody>
		  				</table>
	  				</div>
	  				<div className="hotel-search-pagination">
	  				1 2 3 4 5 6
	  				</div>
	  			</div>

{/*

	  			<div className="hotel-search-second-column col-lg-6">
		  			<Map
		  			  google={this.props.google}
		  			  zoom={14}
		  			  style={mapStyles}
		  			  initialCenter={{
		  			   lat: -1.2884,
		  			   lng: 36.8233
		  			  }}
		  			/>
	  			</div>

*/}
  			</div>


  		</div>
    );
  }

}

export default withRouter(HotelSearchDemo);

