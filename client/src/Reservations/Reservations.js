import React from 'react';
import {
	Table, Button,
	Container, Row, Col
} from 'reactstrap';
import homeImage from './homeImage.jpg';
import axios from 'axios';
import moment from 'moment';
import "./Reservations.css";

var pageStyle = {
	width: "100%",
	backgroundRepeat: "no-repeat",
	backgroundSize: "cover",
	backgroundPosition: "center center",
	backgroundImage: `url(${homeImage})`,

};

class Reservations extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			history: [],
			info: []
		}
	}

	componentDidMount() {
      var that = this
      axios.get('/api/reservations/viewres')
      .then(function(viewres) {
      	var resInfo = []
      	var room_info = []
      	var bed_types = []
      	var room_prices = []
      	var quantities = []
      	for (var i = 0; i < viewres.data.length; i++) {
      		bed_types.push(viewres.data[i].bed_type)
      		room_prices.push(viewres.data[i].price)
      		quantities.push(1)
      		for (var j = i + 1; j < viewres.data.length; j++) {
      			if (viewres.data[j].transaction_id == viewres.data[i].transaction_id) {
      				bed_types.push(viewres.data[j].bed_type)
      				room_prices.push(viewres.data[j].price)
      				quantities.push(1)
      			}
      			else {
      				i = j - 1
      				break
      			}
      		}
      		room_info.push({"beds": bed_types, "prices": room_prices, "quans": quantities})
      		bed_types = []
      		room_prices = []
      		quantities = []
      	}
      	console.log(room_info)
      		var booking_id = viewres.data[0].transaction_id
      		var date_in = viewres.data[0].date_in
      		var date_out = viewres.data[0].date_out
      		var hotel_name = viewres.data[0].name
      		var bed_type = room_info[0].beds.toString()
      		var room_price = room_info[0].prices.toString()
      		var room_quantities = room_info[0].quans.toString()
      		var total_price = viewres.data[0].total_price
      		var status = viewres.data[0].status

      		resInfo[0] = {booking_id, date_in, date_out, hotel_name, bed_type, room_price, room_quantities, total_price, status}
      		var counter = 1
      	for (var x = 1; x < viewres.data.length; x++) {
      		if (viewres.data[x].transaction_id == viewres.data[x - 1].transaction_id) {
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
      		counter++

      		resInfo[x] = {booking_id, date_in, date_out, hotel_name, bed_type, room_price, room_quantities, total_price, status}
      	}
      	console.log(resInfo)
      	that.setState({
            history: resInfo
          })
      })
  }

  	renderReservationsTableData() {
		return this.state.history.map((reservations, index) => {
			const {booking_id, date_in, date_out, hotel_name, bed_type, room_price, room_quantities, total_price, status} = reservations //destructuring
				if (statutus == 'booked') {
					return (
				<tr >
					<td>{booking_id}</td>
					<td>{date_in}</td>
					<td>{date_out}</td>
					<td>{hotel_name}</td>
					<td>{bed_type.replace(',', '\n')}</td>
					<td>{room_price.replace(',', '\n')}</td>
					<td>{room_quantities.replace(',', '\n')}</td>
					<td>{total_price}</td>
					<td><Button color ="warning"> Modify </Button> <Button color="danger"> Cancel </Button></td>
					<td>{status}</td>
				</tr>
					)
				}
				else {
					return (
				<tr >
					<td>{booking_id}</td>
					<td>{date_in}</td>
					<td>{date_out}</td>
					<td>{hotel_name}</td>
					<td>{bed_type.replace(',', '\n')}</td>
					<td>{room_price.replace(',', '\n')}</td>
					<td>{room_quantities.replace(',', '\n')}</td>
					<td>{total_price}</td>
					<td>{status}</td>
				</tr>
					)
				}
			
		})
	}
	redirectToHome() {
		this.props.history.push('/')
	}

	render() {
		const reservationPage = (
			<div className="reservations-form-container col-lg-12" style={pageStyle}>
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
														<th className="reservations-table-header">Booking ID</th>
														<th className="reservations-table-header">Date In</th>
														<th className="reservations-table-header">Date Out</th>
														<th className="reservations-table-header">Hotel</th>
														<th className="reservations-table-header">Bed Type</th>
														<th className="reservations-table-header">Room Price</th>
														<th className="reservations-table-header">Quantity</th>
														<th className="reservations-table-header">Total Price</th>
														<th className="reservations-table-header">Modify/Cancel</th>
														<th className="reservations-table-header">Status</th>
													</tr>
												</thead>
												<tbody>
													{this.renderReservationsTableData()}
												</tbody>
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
			<div>
				<div className="reservations-container">
					{localStorage.accesstoken ? reservationPage : this.redirectToHome()}
				</div>
			</div>
		);
	}
}

export default Reservations;