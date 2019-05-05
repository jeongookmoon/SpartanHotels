import React from 'react';
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { Table } from 'reactstrap';

import { getHotelInfoWithTransactionID } from '../Utility/HotelSearchFunction'

import HotelInfoCard from './Components/HotelInfoCard'

class ModifyRoomPage extends React.Component {
	constructor(props) {
		super(props);

		const params = new URLSearchParams(this.props.location.search);
		const hotel_id = params.get('hotel_id')
		const date_in = params.get('date_in')
		const date_out = params.get('date_out')
		const city = params.get('city')
		const guestNumber = params.get('guest_number')

		this.state = {
			hotel: {},
			rooms: {},
			hotel_id,
			date_in,
			date_out,
			city,
			totalPrice: 0,
			guest_number: guestNumber,
			verifyCheckout: false,
			verifyRooms: false,
			verifyGuests: false,
			collapse: false
		};

		this.totalPrice = 0;

	}

	async componentWillMount() {
		const params = new URLSearchParams(this.props.location.search);
		const ID = parseInt(params.get('transactionID'))

		const roomSearchQuery = `/api/search/hotels/${this.state.hotel_id}/?date_in=${this.state.date_in}&date_out=${this.state.date_out}`
		const hotelSearchQuery = `/api/search/hotels?date_in=${this.state.date_in}&date_out=${this.state.date_out}&hotel_id=${this.state.hotel_id}`
		const transactionIDparam = { transactionID: ID }

		const rooms = (await axios.get(roomSearchQuery)).data
		const hotel = (await axios.get(hotelSearchQuery)).data
		const roomsFromTransaction = (await getHotelInfoWithTransactionID(transactionIDparam)).data

		console.log("roomsFromTransaction", roomsFromTransaction)

		rooms.results.forEach((eachRoomResult, index) => {
			if(roomsFromTransaction[index]){
				rooms.results[index].desired_quantity = roomsFromTransaction[index].quantity
			}
		})
		
		this.setState({
			rooms, hotel, roomsFromTransaction
		})
	}

	toggle = () => {
		this.setState(state => ({ collapse: !state.collapse }));
	}

	Checkout = (event) => {

		let total = 0;
		let totalCapacity = 0;
		this.setState({
			verifyRooms: false,
			verifyGuests: false
		})

		this.state.rooms.results.map((eachRoomResult, index) =>
			total = total + eachRoomResult.desired_quantity + 0
		);

		this.state.rooms.results.map((eachRoomResult, index) =>
			totalCapacity = totalCapacity + (eachRoomResult.desired_quantity * eachRoomResult.capacity)
		);

		if (total === 0) {
			this.setState({
				verifyRooms: true,
			})
		}

		if (totalCapacity < this.state.guest_number) {
			this.setState({
				verifyGuests: true,
			})
		}

		if ((total > 0) && (totalCapacity >= this.state.guest_number)) {
			console.log(JSON.stringify(this.state.rooms))

			const dataObjectString = JSON.stringify(this.state.rooms);

			const queryToEncode = this.props.location.search + `&country=${this.state.hotel.results[0].country}&state=${this.state.hotel.results[0].state}&address=${this.state.hotel.results[0].address}&rooms=` + dataObjectString

			let queryString = encodeURI(queryToEncode)
			console.log(queryString)

			const decodedString = decodeURI(queryString)
			console.log(decodedString)

			this.props.history.push({
				pathname: `/Checkout`,
				search: `${queryString}`,
			})
		}
	}

	handleEachRoomQuantity = (event) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		let tempArray = [...this.state.rooms.results]
		tempArray[name].desired_quantity = value;
		
		this.setState({
			rooms: {
				results: tempArray
			},
			verifyRooms: false,
			verifyGuests: false,
		});
	}

	handleRoomPrice() {

		this.totalPrice = 0;
		this.state.rooms.results.map((eachRoomResult, index) =>
			this.totalPrice = this.totalPrice + (eachRoomResult.price * eachRoomResult.desired_quantity)
		);

		return this.totalPrice;

	}

	createAvailableRooms(index) {
		let options = []
		for (let i = 0; i <= this.state.rooms.results[0].quantity; i++) {
			options.push(<option key={i}>{i}</option>)
		}

		return options
	}

	render() {

		if (!this.state.hotel.results) {
			return (
				<div className="hotel-search-container"> Loading </div>
			);
		}
		const checkOut = (
			<div className="modify-room-page-checkout-description">

				<Table borderless>
					<thead>
						<tr>
							<th>Room Type</th>
							<th>Capacity</th>
							<th>Price</th>
							<th>Quantity</th>
							<th>Total</th>
						</tr>
					</thead>

					{
						<tbody>
							{
								this.state.rooms.results.map((eachRoomResult, index) => {
									if (eachRoomResult.desired_quantity > 0) {
										return (

											<tr key={index}>
												<td>{eachRoomResult.bed_type}</td>
												<td>{eachRoomResult.capacity}</td>
												<td>${eachRoomResult.price.toFixed(2)}</td>
												<td>{eachRoomResult.desired_quantity} </td>
												<td>$ {(eachRoomResult.desired_quantity * eachRoomResult.price).toFixed(2)}</td>
											</tr>
										)
									}

									else {
										return (
											<tr key={index}>
											</tr>
										)
									}
								})
							}
							<tr className="hr-row">
								<td><hr></hr> </td>
								<td><hr></hr> </td>
								<td><hr></hr> </td>
								<td><hr></hr> </td>
								<td><hr></hr> </td>
							</tr>
							<tr>
								<td> </td>
								<td> </td>
								<td> </td>
								<td><strong> Estimated Total </strong></td>
								<td> $ {this.handleRoomPrice()}</td>
							</tr>

						</tbody>
					}
				</Table>
				{this.state.verifyCheckout ? <div className="room-page-verify-checkout"> Unable to checkout </div> : null}
				{this.state.verifyRooms ? <div className="room-page-verify-checkout"> Please select a room </div> : null}
				{this.state.verifyGuests ? <div className="room-page-verify-checkout"> Please select enough rooms to accomodate all guests </div> : null}
				<p className="room-page-submit-button btn btn-primary py-3 px-5 mb-5" style={{ cursor: "pointer" }} onClick={this.Checkout.bind(this)}>Modify</p>
			</div>
		)

		const roomPage = (

			<div className="room-page-container">
				<div className="room-page-rooms-container">
					<div>
						{
							this.state.rooms.results.length > 0 ?
								<div>
									<hr></hr>

									<div className="col-lg-12 room-page-rooms custom-row container">
										{
											this.state.rooms.results.map((eachRoomResult, index) => {

												return (

													<div className="col-lg-4 mb-5" key={index}>
														<div className={(this.state.roomsFromTransaction[index]) ? "room-card-active block-44" : "room-card-inactive block-44"}>
															<div className="room-page-image">
																<img src={eachRoomResult.images} alt={index+123}/>
															</div>
															<div className="text">
																<h2>{eachRoomResult.bed_type}</h2>
																<div className="price"><sup className="room-page-room-price">$</sup><span className="room-page-room-price">{eachRoomResult.price.toFixed(2)}</span><sub>/per night</sub></div>
																<ul className="specs">
																	<li><strong>Ammenities:</strong> Closet with hangers, HD flat-screen TV, Telephone</li>
																	<li><strong>Capacity Per Room:</strong> {eachRoomResult.capacity}</li>
																</ul>

																<div >
																	<strong># Of Rooms </strong>
																	<select className="room-page-room-quantity-dropdown" type="text" name={index} list="numbers" value={eachRoomResult.desired_quantity} onChange={this.handleEachRoomQuantity}>
																		{this.createAvailableRooms({ index })}
																	</select>
																</div>
															</div>
														</div>
													</div>
												)
											})
										}
									</div>
								</div> :
								<div>no result</div>
						}

						<hr></hr>
					</div>
				</div>
			</div>
		)

		return (

			<div>
				<HotelInfoCard hotelData={this.state.hotel.results[0]} collapseFlag={this.state.collapse} onCollapse={() => this.toggle} />
				{roomPage}
				{checkOut}
			</div>
		);
	}
}

export default withRouter(ModifyRoomPage);
