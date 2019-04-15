import React from 'react';
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { Table } from 'reactstrap';


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

	Checkout = (event) => {
		event.preventDefault()
		let queryString = this.props.location.search
		this.props.history.push({
			pathname: `/Checkout`,
			search: `${queryString}`,
		})
	}

	async componentDidMount() {
		const roomSearchQuery = `/api/search/hotels/${this.state.hotel_id}/?date_in=${this.state.date_in}&date_out=${this.state.date_out}`
		const hotelSearchQuery = `/api/search/hotels?city=${this.state.city}&date_in=${this.state.date_in}&date_out=${this.state.date_out}&hotel_id=${this.state.hotel_id}`

		const rooms = (await axios.get(roomSearchQuery)).data
		const hotel = (await axios.get(hotelSearchQuery)).data
		
		this.setState({
			rooms, hotel
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

							<Table hover>
								<thead>
									<tr>
										<th>Room #</th>
										<th>Bed #</th>
										<th>Bed Type</th>
										<th>Price</th>
									</tr>
								</thead>

								{
									this.state.rooms.results.length > 0 ?
										<tbody>
											{
												this.state.rooms.results.map((eachRoomResult, index) => {
													console.log("eachRoomResult", eachRoomResult)
													console.log("index", index)
													return (
														<tr onClick={this.Checkout.bind(this)}>
															<th scope="row">{eachRoomResult.room_number}</th>
															<td>{eachRoomResult.bed_number}</td>
															<td>{eachRoomResult.bed_type}</td>
															<td>${eachRoomResult.price}</td>
														</tr>
													)
												})
											}
										</tbody> :
										<tbody><tr>no result</tr></tbody>
								}
								
							</Table>
						</div>
					</div>


				</div>
			);
		}
	}
}

export default withRouter(RoomPage);
