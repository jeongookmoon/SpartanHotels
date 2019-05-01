import React from 'react';
import {
	Table, Button,
	Container, Row, Col
} from 'reactstrap';
import homeImage from './homeImage.jpg';
import "./Reservations.css";
import MoreInfo from './MoreInfo';

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
			history: []
		}
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
											<tbody>
												<tr>
													<td> holder </td>
													<td> holder </td>
													<td> holder </td>
													<td>
														holder
														<br />
														holder
													</td>
													<td> holder </td>
													<td> <Button color="warning"> Modify </Button> <Button color="danger"> Cancel </Button> </td>
													<td> holder </td>
													<td> <MoreInfo /> </td>
												</tr>
												<tr>
													<td> holder </td>
													<td> holder </td>
													<td> holder </td>
													<td>
														holder
														<br />
														holder
													</td>
													<td> holder </td>
													<td> <Button color="warning"> Modify </Button> <Button color="danger"> Cancel </Button> </td>
													<td> holder </td>
													<td> <MoreInfo /> </td>
												</tr>
												<tr>
													<td> holder </td>
													<td> holder </td>
													<td> holder </td>
													<td>
														holder
														<br />
														holder
													</td>
													<td> holder </td>
													<td> <Button color="warning"> Modify </Button> <Button color="danger"> Cancel </Button> </td>
													<td> holder </td>
													<td> <MoreInfo /> </td>
												</tr>
												<tr>
													<td> holder </td>
													<td> holder </td>
													<td> holder </td>
													<td>
														holder
														<br />
														holder
													</td>
													<td> holder </td>
													<td> <Button color="warning"> Modify </Button> <Button color="danger"> Cancel </Button> </td>
													<td> holder </td>
													<td> <MoreInfo /> </td>
												</tr>
											</tbody>
										</Table>
									</div>
								</div>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		)

		return (
			<div>
				{localStorage.accesstoken ? reservationPage : this.redirectToHome()}
			</div>
		);
	}
}

export default Reservations;