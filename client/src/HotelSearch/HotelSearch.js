import React from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';



const mapStyles = {
  width: '100%',
  height: '100%'
};

class Home extends React.Component {
  render() {
    return (
      <div className="hotel-search-container">
  {/* FILTER

      		<div className="hotel-search-filter row">
      			<div className="col-lg-12 row">
      				<div className="col-lg-4">
      				asd
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

{/* HOTEL SEARCH TWO COLUMNS */}
  			<div className="hotel-search-columns row">
	  			<div className="col-lg-6 hotel-search-first-column table-responsive">
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
                 						<button className="p-2 hotel-search-item-button btn my-2 my-sm-0" type="submit">Choose Room</button>
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
                 						<button className="p-2 hotel-search-item-button btn my-2 my-sm-0" type="submit">Choose Room</button>
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
                 						<button className="p-2 hotel-search-item-button btn my-2 my-sm-0" type="submit">Choose Room</button>
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
                 						<button className="p-2 hotel-search-item-button btn my-2 my-sm-0" type="submit">Choose Room</button>
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
                 						<button className="p-2 hotel-search-item-button btn my-2 my-sm-0" type="submit">Choose Room</button>
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
                 						<button className="p-2 hotel-search-item-button btn my-2 my-sm-0" type="submit">Choose Room</button>
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
                 						<button className="p-2 hotel-search-item-button btn my-2 my-sm-0" type="submit">Choose Room</button>
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
                 						<button className="p-2 hotel-search-item-button btn my-2 my-sm-0" type="submit">Choose Room</button>
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
                 						<button className="p-2 hotel-search-item-button btn my-2 my-sm-0" type="submit">Choose Room</button>
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

{/**/}

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
  			</div>


  		</div>
    );
  }

}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDScT-hbkYMaHHMJXftylDtwehYvBkzyRk'
})(Home);

