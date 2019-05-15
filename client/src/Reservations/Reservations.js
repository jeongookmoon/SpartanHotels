import React from 'react';
import {
	Table, Button,
	Container, Row, Col
} from 'reactstrap';
import homeImage from './homeImage.jpg';
import axios from 'axios';
import "./Reservations.css";
import MoreInfo from './MoreInfo';
import CancelConfirmation from './CancelConfirmation';


var pageStyle = {
	width: "100%",
	height: "100vh",
	backgroundRepeat: "no-repeat",
	backgroundSize: "cover",
	backgroundPosition: "center center",
	backgroundImage: `url(${homeImage})`,

};

class Reservations extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			reservations: [],
			roominfo: [],
			transaction_id: ''
		}
	}

	componentWillMount() {
		var that = this
		axios.get('/api/reservations/viewres')
			.then(function (viewres) {
				var resInfo = []
				var room_info = []
				var bed_types = []
				var room_prices = []
				var quantities = []
				var room_quan = 1
				//Putting detailed room information on the panel. Include bed type, price, and quantity
				//This stuff should now be handled in MoreInfo.js

				for (var i = 0; i < viewres.data.length; i++) {
					bed_types.push(viewres.data[i].bed_type)
					room_prices.push(viewres.data[i].price)
					quantities.push(1)
					for (var j = i + 1; j < viewres.data.length; j++) {
						if (viewres.data[j].transaction_id === viewres.data[i].transaction_id) {
							if ((viewres.data[j].bed_type === viewres.data[i].bed_type) && (viewres.data[j].price === viewres.data[i].price)) {
								room_quan++
							}
							else {
								bed_types.push(viewres.data[j].bed_type)
								room_prices.push(viewres.data[j].price)
								quantities.push(room_quan)
								room_quan = 1
							}
						}
						else {
							i = j - 1
							break
						}
					}
					room_info.push({ "beds": bed_types, "prices": room_prices, "quans": quantities })
					bed_types = []
					room_prices = []
					quantities = []
				}

				if (viewres.data[0] === undefined) {
					resInfo[0] = {}
				}
				else {
					//Information for the 'My Reservation' Table
					var booking_id = viewres.data[0].transaction_id
					var date_in = viewres.data[0].date_in
					var date_out = viewres.data[0].date_out
					var hotel_name = viewres.data[0].name
					var bed_type = room_info[0].beds.toString()
					var room_price = room_info[0].prices.toString()
					var room_quantities = room_info[0].quans.toString()
					var total_price = viewres.data[0].total_price
					var status = viewres.data[0].status
					var hotel_id = viewres.data[0].hotel_id
				}

				resInfo[0] = { booking_id, date_in, date_out, hotel_name, bed_type, room_price, room_quantities, total_price, status, hotel_id }
				var counter = 1
				for (var x = 1; x < viewres.data.length; x++) {
					if (viewres.data[x].transaction_id*1 === viewres.data[x - 1].transaction_id*1) {
						continue
					}
					booking_id = viewres.data[x].transaction_id
					date_in = viewres.data[x].date_in
					date_out = viewres.data[x].date_out
					hotel_name = viewres.data[x].name
					bed_type = room_info[counter].beds.toString()
					room_price = room_info[counter].prices.toString()
					room_quantities = room_info[counter].quans.toString()
					total_price = viewres.data[x].total_price
					status = viewres.data[x].status
					hotel_id = viewres.data[x].hotel_id
					counter++

					resInfo.push({ booking_id, date_in, date_out, hotel_name, total_price, status, hotel_id })
				}

				that.setState({
					reservations: resInfo
				})
			})
	}


	redirectToHome() {
		this.props.history.push('/')
	}

	modifyRoom = (reservation) => (event) => {
		event.preventDefault()
		const info = reservation
		const queryString = `date_in=${info.date_in}&date_out=${info.date_out}
								&hotel_id=${info.hotel_id}&transaction_id=${info.booking_id}`

		this.props.history.push({
			pathname: `/ModifyRoomPage`,
			search: `?${queryString}`,
		})
	}

	render() {
		const renderReservationsTableData = (
			<tbody>
				{
					this.state.reservations.map((reservation, index) => {
						const { booking_id, date_in, date_out, hotel_name, total_price, status } = reservation //destructuring
						if (status === 'booked') {
							return (
								<tr key={index + 11}>
									<td>{booking_id}</td>
									<td>{date_in}</td>
									<td>{date_out}</td>
									<td>{hotel_name}</td>
									<td>${total_price}</td>
									<td> <Button className="reservations-button" color="warning" value={reservation} onClick={this.modifyRoom(reservation)} > Modify </Button>
										<CancelConfirmation id={booking_id} /> </td>
									<td>{status}</td>
									<td> <MoreInfo id={booking_id} /> </td>
								</tr>
							)
						} else {
							return (
								<tr key={index + 22}>
									<td>{booking_id}</td>
									<td>{date_in}</td>
									<td>{date_out}</td>
									<td>{hotel_name}</td>
									<td>${total_price}</td>
									<td>       </td>
									<td>{status}</td>
									<td> <MoreInfo id={booking_id} /> </td>
								</tr>
							)
						}
					})
				}
			</tbody>
		)

		const reservationPage = (

			<div className="reservation-form-container col-lg-12 dark-tint">
				<br />
				<br />
				<br />
				<br />
				<br />
				<div>
					<Container>
						<Row>
							<Col>
								<div className="reservations-card">
									<div className="reservations-card-body reservations-inner-card">
										<br />
										<div className="reservations-center-title"> <h2> My Reservations </h2> </div>
										<br />
										<div className="reservations-table-wrapper-scroll-y reservations-scrollbar">
											<Table hover>
												<thead>
													<tr>
														<th>Booking ID</th>
														<th>Check-in</th>
														<th>Check-out</th>
														<th>Hotel</th>
														<th>Total Price</th>
														<th>Modify/Cancel</th>
														<th>Status</th>
														<th>Details</th>
													</tr>
												</thead>
												{renderReservationsTableData}
											</Table>
										</div>
									</div>
								</div>
							</Col>
						</Row>
					</Container>
				</div>
			</div>
		)

		return (
			<div className="col-lg-12 reservations-container col-auto" style={pageStyle}>
				{reservationPage}
			</div>
		);
	}
}

export default Reservations;