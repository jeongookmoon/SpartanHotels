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
      	var room_numbers = []
      	var room = 0
      	for (var i = 0; i < viewres.data.length; i++) {
      		room_numbers.push(viewres.data[i].room_number)
      	}
      	for (var x = 0; x < viewres.data.length; x++) {
      		var booking_id = viewres.data[x].transaction_id
      		var date_in = viewres.data[x].date_in
      		var date_out = viewres.data[x].date_out
      		var hotel_name = viewres.data[x].name
      		var total_price = viewres.data[x].total_price
      		var status = viewres.data[x].status
      		
      		resInfo[x] = {booking_id, date_in, date_out, hotel_name, room_info, total_price, status}
      	}
      	console.log(resInfo)
      	that.setState({
            history: resInfo
          })
      })
  }

  	renderReservationsTableData() {
		return this.state.history.map((reservations, index) => {
			const { booking_id, date_in, date_out, hotel_name, room_info, total_price, status } = reservations //destructuring
				return (
				<tr >
					<td>{booking_id}</td>
					<td>{date_in}</td>
					<td>{date_out}</td>
					<td>{hotel_name}</td>
					<td>{room_info}</td>
					<td>{total_price}</td>
					<td><Button color ="warning"> Modify </Button> <Button color="danger"> Cancel </Button></td>
					<td>{status}</td>
				</tr>
			)
			
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
														<th className="reservations-table-header">Room Type, Quantity</th>
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
					{reservationPage}
				</div>
			</div>
		);
	}
}

export default Reservations;