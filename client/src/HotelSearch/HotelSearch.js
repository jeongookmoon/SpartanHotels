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
	  			<div className="col-lg-5 hotel-search-first-column table-responsive">
	  				<table className="table hotel-search-table">
	  				  
	  				  <tbody>
	  				    <tr className="search-hotel-row shadow-sm p-3 mb-5 bg-white rounded">
	  				      <th scope="row">1</th>
	  				      <td>Mark</td>
	  				      <td>Otto</td>
	  				      <td>@mdo</td>
	  				    </tr>
	  				    <tr className="search-hotel-row shadow-sm p-3 mb-5 bg-white rounded">
	  				      <th scope="row">2</th>
	  				      <td>Jacob</td>
	  				      <td>Thornton</td>
	  				      <td>@fat</td>
	  				    </tr>
	  				    <tr className="search-hotel-row shadow-sm p-3 mb-5 bg-white rounded">
	  				      <th scope="row">3</th>
	  				      <td colspan="2">Larry the Bird</td>
	  				      <td>@twitter</td>
	  				    </tr>
	  				    <tr className="search-hotel-row shadow-sm p-3 mb-5 bg-white rounded">
	  				      <th scope="row">4</th>
	  				      <td>Mark</td>
	  				      <td>Otto</td>
	  				      <td>@mdo</td>
	  				    </tr>
	  				    <tr className="search-hotel-row shadow-sm p-3 mb-5 bg-white rounded">
	  				      <th scope="row">5</th>
	  				      <td>Jacob</td>
	  				      <td>Thornton</td>
	  				      <td>@fat</td>
	  				    </tr>
	  				    <tr className="search-hotel-row shadow-sm p-3 mb-5 bg-white rounded">
	  				      <th scope="row">6</th>
	  				      <td colspan="2">Larry the Bird</td>
	  				      <td>@twitter</td>
	  				    </tr>
	  				  </tbody>
	  				</table>
	  			</div>



	  			<div className="hotel-search-second-column col-lg-7">
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

