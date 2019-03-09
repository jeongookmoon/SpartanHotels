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
  			<div className="hotel-search-columns row">
	  			<div className="col-lg-5 hotel-search-first-column">
	  				<table className="table table-bordered">
	  				  <thead>
	  				    <tr>
	  				      <th scope="col">#</th>
	  				      <th scope="col">First</th>
	  				      <th scope="col">Last</th>
	  				      <th scope="col">Handle</th>
	  				    </tr>
	  				  </thead>
	  				  <tbody>
	  				    <tr>
	  				      <th scope="row">1</th>
	  				      <td>Mark</td>
	  				      <td>Otto</td>
	  				      <td>@mdo</td>
	  				    </tr>
	  				    <tr>
	  				      <th scope="row">2</th>
	  				      <td>Jacob</td>
	  				      <td>Thornton</td>
	  				      <td>@fat</td>
	  				    </tr>
	  				    <tr>
	  				      <th scope="row">3</th>
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

