import React from 'react';
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { Table } from 'reactstrap';
import './css/RoomPage.css'

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
		const something = (
			<div className="rooms">
				<div className="container">
					<div className="row">
						<div className="col">
							<div className="card-columns">

								<div className="card" onClick={this.Checkout.bind(this)} style={{ cursor: "pointer" }}>
									<img className="card-img-top" src="https://colorlib.com/preview/theme/marimar/images/room_1.jpg" alt="Room" />
									<div className="card-body">
										<div className="rooms_title"><h2>Luxury Double Suite</h2></div>
										<div className="rooms_text">
											<p>Maecenas sollicitudin tincidunt maximus. Morbi tempus malesuada erat sed pellentesque. Donec pharetra mattis nulla, id laoreet neque scelerisque at. Quisque eget sem non ligula consectetur ultrices in quis augue. Donec imperd iet leo eget tortor dictum, eget varius eros sagittis. Curabitur tempor dignissim massa ut faucibus sollicitudin tinci dunt maximus. Morbi tempus malesuada erat sed pellentesque.</p>
										</div>
										<div className="rooms_list">
											<ul>
												<li className="d-flex flex-row align-items-center justify-content-start">
													<img src="https://colorlib.com/preview/theme/marimar/images/check.png" alt="1" />
													<span>Morbi tempus malesuada erat sed</span>
												</li>
												<li className="d-flex flex-row align-items-center justify-content-start">
													<img src="https://colorlib.com/preview/theme/marimar/images/check.png" alt="2" />
													<span>Tempus malesuada erat sed</span>
												</li>
												<li className="d-flex flex-row align-items-center justify-content-start">
													<img src="https://colorlib.com/preview/theme/marimar/images/check.png" alt="" />
													<span>Pellentesque vel neque finibus elit</span>
												</li>
											</ul>
										</div>
										<div className="rooms_price">$129/<span>Night</span></div>
									</div>
								</div>

								<div className="card card-special">
									<img className="card-img-top" src="https://colorlib.com/preview/theme/marimar/images/room_4.jpg" alt="description" />
									<div className="card-special-panel">special offer</div>
									<div className="card-body">
										<div className="rooms_title"><h2>Budget Suite</h2></div>
										<div className="rooms_text">
											<p>Maecenas sollicitudin tincidunt maximus. Morbi tempus malesuada erat sed pellentesque. Donec pharetra mattis nulla, id laoreet neque scelerisque at.</p>
										</div>
										<div className="rooms_list">
											<ul>
												<li className="d-flex flex-row align-items-center justify-content-start">
													<img src="https://colorlib.com/preview/theme/marimar/images/check.png" alt="" />
													<span>Morbi tempus malesuada erat sed</span>
												</li>
												<li className="d-flex flex-row align-items-center justify-content-start">
													<img src="https://colorlib.com/preview/theme/marimar/images/check.png" alt="" />
													<span>Tempus malesuada erat sed</span>
												</li>
												<li className="d-flex flex-row align-items-center justify-content-start">
													<img src="https://colorlib.com/preview/theme/marimar/images/check.png" alt="" />
													<span>Pellentesque vel neque finibus elit</span>
												</li>
											</ul>
										</div>
										<div className="rooms_price">$129/<span>Night</span></div>
									</div>
								</div>

								<div className="card">
									<img className="card-img-top" src="https://colorlib.com/preview/theme/marimar/images/room_2.jpg" alt="Roomimage" />
									<div className="card-body">
										<div className="rooms_title"><h2>Luxury Single Room</h2></div>
										<div className="rooms_text">
											<p>Maecenas sollicitudin tincidunt maximus. Morbi tempus malesuada erat sed pellentesque. Donec pharetra mattis nulla, id laoreet neque scelerisque at.</p>
										</div>
										<div className="rooms_list">
											<ul>
												<li className="d-flex flex-row align-items-center justify-content-start">
													<img src="https://colorlib.com/preview/theme/marimar/images/check.png" alt="" />
													<span>Morbi tempus malesuada erat sed</span>
												</li>
												<li className="d-flex flex-row align-items-center justify-content-start">
													<img src="https://colorlib.com/preview/theme/marimar/images/check.png" alt="" />
													<span>Tempus malesuada erat sed</span>
												</li>
												<li className="d-flex flex-row align-items-center justify-content-start">
													<img src="https://colorlib.com/preview/theme/marimar/images/check.png" alt="" />
													<span>Pellentesque vel neque finibus elit</span>
												</li>
											</ul>
										</div>
										<div className="rooms_price">$129/<span>Night</span></div>
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>
			</div>
		)

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
							{something}

							<Table hover borderless>
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
													return (
														<tr onClick={this.Checkout.bind(this)} style={{ cursor: "pointer" }} key={index}>
															<th scope="row"><a href="#child4">{eachRoomResult.room_number}</a></th>
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
