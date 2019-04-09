import React from 'react';
import axios from 'axios'
import { withRouter } from 'react-router-dom'


class RoomPage extends React.Component {


	constructor(props) {
		super(props);
		console.log("this.props.location.search");
		console.log(this.props.location.search);
		let params = new URLSearchParams(this.props.location.search);
		let hotel_id_value = params.get('hotel_id')
		let date_in_value = params.get('date_in')
		let date_out_value = params.get('date_out')
		this.state = {
			hotels: {},
			hotel_id: hotel_id_value,
			date_in: date_in_value,
			date_out: date_out_value
		};

		console.log("hotel_id", hotel_id_value);
		console.log("date_in", date_in_value);
		console.log("date_out", date_out_value);
	}

	Checkout(event) {
    event.preventDefault()
		let queryString = this.props.location.search
    this.props.history.push({
			pathname: `/Checkout`,
			search: `${queryString}`,
		})
  }

	async componentWillMount() {
		let queryCall = '/api/search/hotels/'+this.state.hotel_id+"/?date_in="+this.state.date_in+"&date_out="+this.state.date_out
		console.log("queryCall", queryCall);
		const hotelSearch = (await axios.get(queryCall)).data;
		this.setState({
			hotels: hotelSearch
		});
		console.log("hotelSearch");
		console.log(hotelSearch);
	}

	render() {
		if (!this.state.hotels.results) {
			return (
				<div className="hotel-search-container"> Loading </div>
			);
		}
		else {
			console.log("Result!!!");
			console.log(this.state.hotels.results[0]);
			let imageURLS = this.state.hotels.results[0].images;
			let imageArray = []
			if(imageURLS) {
				imageArray = imageURLS.split(",");
				console.log(imageArray[0]);
			}
			
	
		return (
			<div className="room-page-container">
				<div className="col-lg-12 room-page-hotel-image-container row">
					<div className="col-lg-3 shadow-lg room-page-hotel-desdays cription">
					<h1>{this.state.hotels.results[0].name}</h1>
					<hr></hr>
					<div> {this.state.hotels.results[0].address} </div>
					<div> {this.state.hotels.results[0].state} </div>
					<div> {this.state.hotels.results[0].zipcode} </div>
					<div> {this.state.hotels.results[0].location} </div>
					<div> {this.state.hotels.results[0].phone_number} </div>
	
					<hr></hr>
					{this.state.hotels.results[0].description}
	
					</div>
					<img className="col-lg-9 room-page-hotel-image " src={imageArray[0]} alt="logo" />
	
				</div>
	
				<div className="room-page-rooms-container">
					<div className="col-lg-12 shadow-lg room-page-rooms">
						<tbody>
	
							<tr>
								<td>
									Room Type
								</td>
								<td>
									Room Image
								</td>
								<td>
									Room Description
								</td>
								<td>
									Room Ammenities
								</td>
								<td>
									Number of Beds
								</td>
								<td>
									Room Price ($)
								</td>
								<td>
									
	
								</td>
							</tr>
	
							<tr>
								<td>
								Room A
								</td>
								<td>
									Room Image
								</td>
								<td>
									Room Description
								</td>
								
								<td>
									Room Ammenities
								</td>
								<td>
									2
								</td>
								<td>
									{this.state.hotels.results[0].min_price}
								</td>
								<td>
									<button onClick={this.Checkout.bind(this)} className="p-2 submit-button btn btn-danger my-2 my-sm-0" type="submit">Check Out</button>
	
								</td>
							</tr>
	
							<tr>
								<td>
								Room B
								</td>
								<td>
									Room Image
								</td>
								<td>
									Room Description
								</td>
								<td>
									Room Ammenities
								</td>
								<td>
									2
								</td>
								<td>
									{this.state.hotels.results[0].min_price}
								</td>
								<td>
									<button onClick={this.Checkout.bind(this)} className="p-2 submit-button btn btn-danger my-2 my-sm-0" type="submit">Check Out</button>
	
								</td>
							</tr>
	
							<tr>
								<td>
								Room C
								</td>
								<td>
									Room Image
								</td>
								<td>
									Room Description
								</td>
								<td>
									Room Ammenities
	
								</td>
								<td>
									2
								</td>
								<td>
									{this.state.hotels.results[0].max_price}
								</td>
								<td>
									<button onClick={this.Checkout.bind(this)} className="p-2 submit-button btn btn-danger my-2 my-sm-0" type="submit">Check Out</button>
	
								</td>
							</tr>
						</tbody>
					</div>
				
				</div>
	
	
			</div>
			);
		}
  }
}

export default withRouter(RoomPage);
