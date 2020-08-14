import React from 'react';
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { Table, Button } from 'reactstrap';

import { getHotelInfoWithTransactionID } from '../Utility/HotelSearchFunction'
import { convertTimestampToString } from '../Utility/Conversion'

import HotelInfoCard from './Components/HotelInfoCard'
import { DateRangePicker } from 'react-dates'
import moment from 'moment'

class ModifyRoomPage extends React.Component {
	constructor(props) {
		super(props);

		const params = new URLSearchParams(this.props.location.search);
		const hotel_id = params.get('hotel_id')
		const date_in = moment(params.get('date_in'), ('YYYY-MM-DD'))
		const date_out = moment(params.get('date_out'), ('YYYY-MM-DD'))
		const reservation_days = date_out.diff(date_in, 'days')

		const transaction_id = params.get('transaction_id')

		this.state = {
			hotel: {},
			rooms: {},
			hotel_id,
			date_in,
			date_out,
			transaction_id,
			reservation_days,
			collapse: false,
			availableRooms: [],
			totalPriceWithoutTax: 0.00,
			totalPriceWithTax: 0.00,
			cancellationFee: 0.00,
			roomsMap: null
		};
	}

	componentWillMount() {
		this.fetchSearchResult()
	}

	async fetchSearchResult() {
		const params = new URLSearchParams(this.props.location.search);
		const transaction_id = parseInt(params.get('transaction_id'))
		const date_in = moment(params.get('date_in'), ('YYYY-MM-DD'))
		const date_out = moment(params.get('date_out'), ('YYYY-MM-DD'))
		const reservation_days = date_out.diff(date_in, 'days')
		const roomSearchQuery = `/api/search/hotels/${this.state.hotel_id}/?date_in=1111-01-01&date_out=1111-01-02`
		const realroomSearchQuery = `/api/search/hotels/${this.state.hotel_id}/?date_in=${this.state.date_in.format('YYYY-MM-DD')}&date_out=${this.state.date_out.format('YYYY-MM-DD')}`
		const hotelSearchQuery = `/api/search/hotels?date_in=1111-01-01&date_out=1111-01-02&hotel_id=${this.state.hotel_id}`
		const realhotelSearchQuery = `/api/search/hotels?date_in=${this.state.date_in.format('YYYY-MM-DD')}&date_out=${this.state.date_out.format('YYYY-MM-DD')}&hotel_id=${this.state.hotel_id}`
		const transactionIDparam = { transaction_id: transaction_id }

		const rooms = (await axios.get(roomSearchQuery)).data
		const realrooms = (await axios.get(realroomSearchQuery)).data
		const hotel = (await axios.get(hotelSearchQuery)).data
		const realhotel = (await axios.get(realhotelSearchQuery)).data

		const roomsFromTransaction = (await getHotelInfoWithTransactionID(transactionIDparam)).data
		const transaction_date_in = convertTimestampToString(roomsFromTransaction[0].date_in)
		const transaction_date_out = convertTimestampToString(roomsFromTransaction[0].date_out)
		const oldTotalPrice = parseFloat(roomsFromTransaction[0].total_price).toFixed(2)
		const oldAmountPaid = parseFloat(roomsFromTransaction[0].amount_paid).toFixed(2)

		let availableRooms = [...this.state.availableRooms]

		let totalPriceWithoutTax = 0.00

		const roomsMap = new Map();

		// pushing unique available rooms (type, price) as a key and available quantity to hashmap
		if (realrooms.results && realrooms.results.length > 0) {
			realrooms.results.forEach((eachRealRoomResult) => {
				const key = "" + eachRealRoomResult.bed_type.toString() + eachRealRoomResult.price.toString()
				const value = { available_quantity: eachRealRoomResult.quantity, image: eachRealRoomResult.images, capacity: eachRealRoomResult.capacity, taken_quantity: 0, bed_type: eachRealRoomResult.bed_type, price: eachRealRoomResult.price }
				roomsMap.set(key, value)
			})
		}

		// when user looking at dates that match with the dates from transaction
		// pushing taken rooms (type, price) as a key and taken quantity to hashmap
		// also calculate total price of previous transaction
		if (roomsFromTransaction && roomsFromTransaction.length > 0 && transaction_date_in === this.state.date_in.format('YYYY-MM-DD') && transaction_date_out === this.state.date_out.format('YYYY-MM-DD')) {
			roomsFromTransaction.forEach((eachRoomFromTransaction) => {
				const key = "" + eachRoomFromTransaction.bed_type.toString() + eachRoomFromTransaction.room_price.toString()
				const value = { taken_quantity: eachRoomFromTransaction.quantity, image: eachRoomFromTransaction.image, capacity: eachRoomFromTransaction.capacity, bed_type: eachRoomFromTransaction.bed_type, price: eachRoomFromTransaction.room_price }
				if (roomsMap.get(key)) {
					let currentObjValue = roomsMap.get(key)
					currentObjValue = {...currentObjValue, taken_quantity: parseInt(eachRoomFromTransaction.quantity)}
					roomsMap.set(key, currentObjValue)
				} else {
					roomsMap.set(key, value)
				}

				totalPriceWithoutTax = totalPriceWithoutTax + (eachRoomFromTransaction.room_price * eachRoomFromTransaction.quantity * 1.0)
			})
		}

		for (const entry of roomsMap) {
			let value = entry[1]
			if (entry[1].available_quantity > entry[1].taken_quantity) {
				value.option_quantity = entry[1].available_quantity
				roomsMap.set(entry[0], value)
			} else {
				value.option_quantity = entry[1].taken_quantity
				roomsMap.set(entry[0], value)
			}
		}

		// console.log("roomsMap", roomsMap)
		// calculate total prices, cancellationfee, salestax
		totalPriceWithoutTax = (totalPriceWithoutTax * 1.0 * this.state.reservation_days).toFixed(2)
		const salesTax = (totalPriceWithoutTax * .1).toFixed(2)
		const totalPriceWithTax = (totalPriceWithoutTax * 1.1).toFixed(2)
		const cancellationFee = (totalPriceWithoutTax * .2).toFixed(2)


		this.setState({
			rooms, hotel, realrooms, realhotel, roomsFromTransaction, transaction_dateIn: moment(transaction_date_in, ('YYYY-MM-DD')), transaction_dateOut: moment(transaction_date_out, ('YYYY-MM-DD')), oldTotalPrice, availableRooms
			, totalPriceWithoutTax, totalPriceWithTax, cancellationFee, salesTax, transaction_id, oldAmountPaid, roomsMap, date_in, date_out, reservation_days
		})
	}

	componentDidUpdate(prevProps) {
		if (prevProps.location.search !== this.props.location.search) {
			this.fetchSearchResult()
		}
	}

	roomSearch = (event) => {
		const queryString = `?date_in=${this.state.date_in.format('YYYY-MM-DD')}&date_out=${this.state.date_out.format('YYYY-MM-DD')}`+
			`&hotel_id=${this.state.hotel_id}`+
			`&transaction_id=${this.state.transaction_id}`

		this.props.history.push({
			pathname: `/ModifyRoomPage`,
			search: `${queryString}`,
		})
	}

	toggle = () => {
		this.setState(state => ({ collapse: !state.collapse }));
	}

	Checkout = (event) => {
		event.preventDefault()

		// roomInfo[0] contains bed_type, price
		// roomInfo[1] contains image, capacity, taken_quantity, available_quantity
		let rooms = []
		for (const roomInfo of this.state.roomsMap) {
			if (roomInfo[1].taken_quantity && roomInfo[1].taken_quantity > 0) {
				rooms.push({ bed_type: roomInfo[1].bed_type.toString(), price: roomInfo[1].price, quantity: parseInt(roomInfo[1].taken_quantity) })
			}
		}
		const oldTotalPrice = this.state.oldTotalPrice.toString()
		const oldAmountPaid = this.state.oldAmountPaid.toString()
		const transaction_id = this.state.transaction_id.toString()
		const totalPriceWithTax = this.state.totalPriceWithTax.toString()
		const cancellationFee = this.state.cancellationFee.toString()
		const date_in = this.state.date_in.format('YYYY-MM-DD').toString()
		const date_out = this.state.date_out.format('YYYY-MM-DD').toString()
		const hotel_id = this.state.hotel_id.toString()
		const oldRooms = this.state.roomsFromTransaction

		this.props.history.push({
			pathname: `/Checkout`,
			state: {
				totalPriceWithTax,
				cancellationFee,
				date_in,
				date_out,
				rooms: JSON.stringify(rooms),
				hotel_id,
				transaction_id,
				oldTotalPrice,
				oldAmountPaid,
				oldRooms: JSON.stringify(oldRooms)
			}
		})
	}

	handleEachRoomQuantity = (roomInfoForRoomMap) => (event) => {
		event.preventDefault()

		const { value } = event.target
		let { roomsMap } = this.state

		let updateTakenQuantity = roomsMap.get(roomInfoForRoomMap[0])
		updateTakenQuantity.taken_quantity = value
		roomsMap.set(roomInfoForRoomMap[0], updateTakenQuantity)

		let totalPriceWithoutTax = 0.00

		for (const roomInfo of this.state.roomsMap) {
			if (roomInfo[0] === roomInfoForRoomMap[0]) {
				totalPriceWithoutTax = totalPriceWithoutTax + (roomInfo[1].price * parseFloat(value).toFixed(2))
			} else {
				if (roomInfo[1].taken_quantity) {
					totalPriceWithoutTax = totalPriceWithoutTax + (roomInfo[1].price * roomInfo[1].taken_quantity)
				} else {
					totalPriceWithoutTax = totalPriceWithoutTax + 0.00
				}
			}
		}
		totalPriceWithoutTax = parseFloat(totalPriceWithoutTax * this.state.reservation_days).toFixed(2)
		const salesTax = (totalPriceWithoutTax * .1).toFixed(2)
		const totalPriceWithTax = (totalPriceWithoutTax * 1.1).toFixed(2)
		const cancellationFee = (totalPriceWithoutTax * .2).toFixed(2)

		this.setState({
			roomsMap, totalPriceWithoutTax, totalPriceWithTax, cancellationFee, salesTax
		});
	}

	createAvailableRooms(index) {
		let options = []
		// when user looking at dates in and out which are equal to reservation ones
		if (this.state.transaction_date_in === this.state.date_in.format('YYYY-MM-DD') && this.state.transaction_date_out === this.state.date_out.format('YYYY-MM-DD')) {
			// display rooms user

		}
		for (let i = 0; i <= index; i++) {
			options.push(<option key={i}>{i}</option>)
		}

		return options
	}

	createRoomCards() {
		let result = []

		// roomInfo[0] contains bed_type, price
		// roomInfo[1] contains image, capacity, taken_quantity, available_quantity
		for (const roomInfo of this.state.roomsMap) {
			result.push(
				<div className="col-lg-4 mb-5" key={roomInfo[1].image}>
					<div className={(roomInfo[1].taken_quantity && roomInfo[1].taken_quantity > 0) ? "room-card-active block-44" : "room-card-inactive block-44"}>
						<div className="room-page-image">
							<img src={roomInfo[1].image} alt={roomInfo[1].image} />
						</div>
						<div className="text">
							<h2>{roomInfo[1].bed_type}</h2>
							<div className="price"><sup className="room-page-room-price">$</sup><span className="room-page-room-price">{roomInfo[1].price.toFixed(2)}</span><sub>/per night</sub></div>
							<ul className="specs">
								<li><strong>Ammenities:</strong> Closet with hangers, HD flat-screen TV, Telephone</li>
								<li><strong>Capacity Per Room:</strong> {roomInfo[1].capacity}</li>
							</ul>
							<div >
								<strong># Of Rooms </strong>
								<select className="room-page-room-quantity-dropdown" name={JSON.stringify(roomInfo[0])} value={roomInfo[1].taken_quantity} onChange={this.handleEachRoomQuantity(roomInfo)}>
									{this.createAvailableRooms(roomInfo[1].option_quantity)}
								</select>
							</div>
						</div>
					</div>
				</div>
			)
			// console.log("roomInfo", roomInfo)
		}
		return result
	}

	createSummary() {
		let result = []

		// roomInfo[0] contains bed_type, price
		// roomInfo[1] contains image, capacity, taken_quantity, available_quantity
		for (const roomInfo of this.state.roomsMap) {
			if (roomInfo[1].taken_quantity && roomInfo[1].taken_quantity > 0) {
				result.push(
					<tr key={roomInfo[1].image}>
						<td>{roomInfo[1].bed_type}</td>
						<td>{roomInfo[1].capacity}</td>
						<td>${roomInfo[1].price.toFixed(2)}</td>
						<td>{roomInfo[1].taken_quantity} </td>
						<td>$ {roomInfo[1].taken_quantity * roomInfo[1].price.toFixed(2)}</td>
					</tr>
				)
			} else {
				result.push(
					<tr key={roomInfo[1].image}>
					</tr>)
			}
		}
		return result
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
								this.createSummary()
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
								<td><span> Total Room Price </span><span style={{ color: '#38af7b' }}><strong>({this.state.reservation_days} {this.state.reservation_days === 1 ? 'Night' : 'Nights'})</strong></span></td>
								<td> $ {parseFloat(this.state.totalPriceWithoutTax).toFixed(2)}</td>
							</tr>
							<tr>
								<td> </td>
								<td> </td>
								<td> </td>
								<td> Sales Tax </td>
								<td> $ {parseFloat(this.state.totalPriceWithoutTax*0.1).toFixed(2)}</td>
							</tr>
							<tr>
								<td> </td>
								<td> </td>
								<td> </td>
								<td style={{ color: '#3b73d3' }}><strong> Estimated Total </strong></td>
								<td><strong>$ {(this.state.totalPriceWithoutTax*1.10).toFixed(2)} </strong></td>
							</tr>
							<tr>
								<td> </td>
								<td> </td>
								<td> </td>
								<td style={{ color: '#f977a1' }}> Estimated Cancellation Fee </td>
								<td> $ {this.state.cancellationFee}</td>
							</tr>

						</tbody>
					}
				</Table>
				<Button disabled={(this.state.transaction_dateIn.format('YYYY-MM-DD') === this.state.date_in.format('YYYY-MM-DD') && this.state.transaction_dateOut.format('YYYY-MM-DD') === this.state.date_out.format('YYYY-MM-DD') && this.state.totalPriceWithTax === this.state.oldTotalPrice) || parseInt(this.state.totalPriceWithTax) === 0} className="home-submit-button btn btn-primary py-3 px-4" onClick={this.Checkout}>Modify Checkout</Button>
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
											this.createRoomCards()
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
				<div className="d-flex justify-content-center">
					<div className="block-32">

						<div className="row">
							<div className="col-md-6 mb-3 mb-lg-0 col-lg-12">
								<label className="input-labels">Check In &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      Check Out</label>
								<div className="field-icon-wrap check-wrap">
									<DateRangePicker
										startDate={this.state.date_in} // momentPropTypes.momentObj or null,
										startDateId="modify_start_date" // PropTypes.string.isRequired,
										endDate={this.state.date_out} // momentPropTypes.momentObj or null,
										endDateId="modify_end_date" // PropTypes.string.isRequired,
										onDatesChange={({ startDate, endDate }) =>
											this.setState(prevState => ({
												...prevState,
												date_in: startDate,
												date_out: endDate
											}
											))
										} // PropTypes.func.isRequired,
										focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
										onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
									/>
								</div>
							</div>
						</div>


						<div className="row">
							<div className="col-md-6 mb-3 mb-lg-0 col-lg-12">
								<label className="input-labels" style={{ color: 'darkgrey' }}>&nbsp;&nbsp;{this.state.transaction_dateIn.format('YYYY-MM-DD')} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      {this.state.transaction_dateOut.format('YYYY-MM-DD')}</label>
							</div>
						</div>

					</div>
				</div>
				<Button onClick={this.roomSearch}>Search</Button>


				<HotelInfoCard hotelData={this.state.hotel.results[0]} collapseFlag={this.state.collapse} onCollapse={() => this.toggle} />
				{roomPage}
				{checkOut}
			</div>
		);
	}
}

export default withRouter(ModifyRoomPage);
