import React from 'react';
import axios from 'axios'
import { withRouter } from 'react-router-dom'


class RoomPage extends React.Component {


	constructor(props) {
		super(props);

		const params = new URLSearchParams(this.props.location.search);
		const hotel_id = params.get('hotel_id')
		const date_in = params.get('date_in')
		const date_out = params.get('date_out')
		const city = params.get('city')

		this.state = {
			hotel: {},
			rooms: {},
			hotel_id,
			date_in,
			date_out,
			city
		};
	}

	Checkout(event) {
		event.preventDefault()
		let queryString = this.props.location.search
		this.props.history.push({
			pathname: `/Checkout`,
			search: `${queryString}`,
		})
	}

	componentDidMount() {

		const roomSearchQuery = `/api/search/hotels/${this.state.hotel_id}/?date_in=${this.state.date_in}&date_out=${this.state.date_out}`
		const hotelSearchQuery = `/api/search/hotels?city=${this.state.city}&date_in=${this.state.date_in}&date_out=${this.state.date_out}&hotel_id=${this.state.hotel_id}`

		axios.get(roomSearchQuery)
			.then(result =>
				this.setState({
					rooms: result.data
				})
			)
			.then(() => {
				axios.get(hotelSearchQuery)
					.then(result => {
						this.setState({
							hotel: result.data
						})
					})
			})
	}

	render() {
		if (!this.state.hotel.results) {
			return (
				<div className="hotel-search-container"> Loading </div>
			);
		}
		else {

			const imageURLS = this.state.hotel.results[0].images;
			let imageArray = []
			if (imageURLS) {
				imageArray = imageURLS.split(",");
			}


			return (
				<div className="room-page-container">
					<div className="col-lg-12 room-page-hotel-image-container row">
						<div className="col-lg-3 shadow-lg room-page-hotel-desdays cription">
							<h1>{this.state.hotel.results[0].name}</h1>
							<hr></hr>
							<div> {this.state.hotel.results[0].address} </div>
							<div> {this.state.hotel.results[0].state} </div>
							<div> {this.state.hotel.results[0].zipcode} </div>
							<div> {this.state.hotel.results[0].location} </div>
							<div> {this.state.hotel.results[0].phone_number} </div>

							<hr></hr>
							{this.state.hotel.results[0].description}

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
										{this.state.hotel.results[0].min_price}
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
										{this.state.hotel.results[0].min_price}
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
										{this.state.hotel.results[0].max_price}
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
