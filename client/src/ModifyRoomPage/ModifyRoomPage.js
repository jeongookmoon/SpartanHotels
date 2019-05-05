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
		const dateIn = params.get('date_in')
		const dateOut = params.get('date_out')
		const transactionID = params.get('transactionID')

		this.state = {
			hotel: {},
			rooms: {},
			hotel_id,
			date_in: moment(dateIn, ('YYYY-MM-DD')),
			date_out: moment(dateOut, ('YYYY-MM-DD')),
			transactionID,
			collapse: false,
			availableRooms: [],
			totalPriceWithoutTax: 0.00,
			totalPriceWithTax: 0.00,
			cancellationFee: 0.00
		};
	}

	componentWillMount() {
		this.fetchSearchResult()
	}

	async fetchSearchResult() {
		const params = new URLSearchParams(this.props.location.search);
		const transaction_id = parseInt(params.get('transactionID'))

		const roomSearchQuery = `/api/search/hotels/${this.state.hotel_id}/?date_in=1111-01-01&date_out=1111-01-02`
		const realroomSearchQuery = `/api/search/hotels/${this.state.hotel_id}/?date_in=${this.state.date_in.format('YYYY-MM-DD')}&date_out=${this.state.date_out.format('YYYY-MM-DD')}`
		const hotelSearchQuery = `/api/search/hotels?date_in=1111-01-01&date_out=1111-01-02&hotel_id=${this.state.hotel_id}`
		const realhotelSearchQuery = `/api/search/hotels?date_in=${this.state.date_in.format('YYYY-MM-DD')}&date_out=${this.state.date_out.format('YYYY-MM-DD')}&hotel_id=${this.state.hotel_id}`
		const transactionIDparam = { transactionID: transaction_id }

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

		rooms.results.forEach((eachRoomResult, index) => {
			if (roomsFromTransaction[index] && transaction_date_in === this.state.date_in.format('YYYY-MM-DD') && transaction_date_out === this.state.date_out.format('YYYY-MM-DD')) {
				totalPriceWithoutTax = totalPriceWithoutTax + (eachRoomResult.price * roomsFromTransaction[index].quantity)
				availableRooms[index] = roomsFromTransaction[index].quantity
			} else {
				availableRooms[index] = 0
				totalPriceWithoutTax = totalPriceWithoutTax + (eachRoomResult.price * 0)
			}
		})

		const totalPriceWithTax = (totalPriceWithoutTax * 1.1).toFixed(2)
		const cancellationFee = (totalPriceWithoutTax * .2).toFixed(2)

		this.setState({
			rooms, hotel, realrooms, realhotel, roomsFromTransaction, transaction_dateIn: moment(transaction_date_in, ('YYYY-MM-DD')), transaction_dateOut: moment(transaction_date_out, ('YYYY-MM-DD')), oldTotalPrice, availableRooms
			, totalPriceWithoutTax, totalPriceWithTax, cancellationFee, transaction_id, oldAmountPaid
		})
	}

	componentDidUpdate(prevProps) {
		if (prevProps.location.search !== this.props.location.search) {
			this.fetchSearchResult()
		}
	}

	roomSearch = (event) => {
		console.log("this.state.transaction_dateIn", this.state.transaction_dateIn.format('YYYY-MM-DD'))
		console.log("this.state.transaction_dateOut", this.state.transaction_dateOut.format('YYYY-MM-DD'))
		const queryString = `?date_in=${this.state.date_in.format('YYYY-MM-DD')}&date_out=${this.state.date_out.format('YYYY-MM-DD')}
			&hotel_id=${this.state.hotel_id}
			&transactionID=${this.state.transactionID}`

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

		if (this.state.totalPriceWithTax && this.state.totalPriceWithTax > 0) {

			let roomsInfo = [...this.state.rooms.results]
			let roomsInfoFinal = []
			this.state.availableRooms.forEach((eachRoomQuantity, index) => {
				if (eachRoomQuantity > 0) {
					roomsInfo[index].desired_quantity = eachRoomQuantity
					roomsInfoFinal.push(roomsInfo[index])
				} else {
					roomsInfo[index].desired_quantity = 0
				}				
			})
			
			
			const oldTotalPrice = this.state.oldTotalPrice.toString()
			const oldAmountPaid = this.state.oldAmountPaid.toString()
			const transaction_id = this.state.transaction_id.toString()
			const totalPriceWithTax = this.state.totalPriceWithTax.toString()
			const cancellationFee = this.state.cancellationFee.toString()
			const date_in = this.state.date_in.format('YYYY-MM-DD').toString()
			const date_out = this.state.date_out.format('YYYY-MM-DD').toString()
			const hotel_id = this.state.hotel_id.toString()

			this.props.history.push({
				pathname: `/Checkout`,
				state: {
					totalPriceWithTax,
					cancellationFee,
					date_in,
					date_out,
					rooms: JSON.stringify(roomsInfoFinal),
					hotel_id,
					transaction_id,
					oldTotalPrice,
					oldAmountPaid
					}
			})
		}
	}

	handleEachRoomQuantity = (event) => {
		const target = event.target
		const value = target.value
		const ind = parseInt(target.name)

		let availableRooms = [...this.state.availableRooms]
		availableRooms[ind] = value

		let totalPriceWithoutTax = 0.00

		this.state.rooms.results.map((eachRoomResult, index) => {
			if (index === ind)
				totalPriceWithoutTax = totalPriceWithoutTax + (eachRoomResult.price * availableRooms[index])
			else
				totalPriceWithoutTax = totalPriceWithoutTax + (eachRoomResult.price * this.state.availableRooms[index])
		});

		const totalPriceWithTax = (totalPriceWithoutTax * 1.1).toFixed(2)
		const cancellationFee = (totalPriceWithoutTax * .2).toFixed(2)

		this.setState({
			availableRooms, totalPriceWithoutTax, totalPriceWithTax, cancellationFee
		});
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
									if (this.state.availableRooms[index] > 0) {
										return (

											<tr key={index}>
												<td>{eachRoomResult.bed_type}</td>
												<td>{eachRoomResult.capacity}</td>
												<td>${eachRoomResult.price.toFixed(2)}</td>
												<td>{this.state.availableRooms[index]} </td>
												<td>$ {(this.state.availableRooms[index] * eachRoomResult.price).toFixed(2)}</td>
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
								<td><strong> Selected Room Price </strong></td>
								<td> $ {this.state.totalPriceWithoutTax}</td>
							</tr>
							<tr>
								<td> </td>
								<td> </td>
								<td> </td>
								<td><strong> Estimated Total </strong></td>
								<td> $ {this.state.totalPriceWithTax}</td>
							</tr>
							<tr>
								<td> </td>
								<td> </td>
								<td> </td>
								<td> Estimated Cancellation Fee </td>
								<td value={this.state.cancellationFee}> $ {this.state.cancellationFee}</td>
							</tr>

						</tbody>
					}
				</Table>
				<Button disabled={this.state.totalPriceWithTax === this.state.oldTotalPrice} className="home-submit-button btn btn-primary py-3 px-4" onClick={this.Checkout}>Modify</Button>
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
														<div className={(this.state.availableRooms[index] && this.state.availableRooms[index] > 0) ? "room-card-active block-44" : "room-card-inactive block-44"}>
															<div className="room-page-image">
																<img src={eachRoomResult.images} alt={index + 123} />
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
																	<select className="room-page-room-quantity-dropdown" type="text" name={index} list="numbers" value={this.state.availableRooms[index]} onChange={this.handleEachRoomQuantity}>
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
