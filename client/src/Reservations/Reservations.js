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
      	var
      	for (var x = 0; x < viewres.data.length; x++) {

      	}
      	console.log(viewres.data[0])
      	that.setState({
            history: resInfo
          })
      })
  }
	redirectToHome() {
		this.props.history.push('/')
	}

	render() {
		const reservationPage = (
			<div className="reservations-form-container col-lg-12">
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
													<tr>
														<td> holder </td>
														<td> holder </td>
														<td> holder </td>
														<td>
															holder
															<br />
															include address
														</td>
														<td>
															<Table size="sm" borderless>
																holder, 3
																<br />
																can also display room #
															</Table>
														</td>
														<td> holder </td>
														<td> <Button color="warning"> Modify </Button> <Button color="danger"> Cancel </Button> </td>
														<td> holder </td>
													</tr>
													<tr>
														<td> holder </td>
														<td> holder </td>
														<td> holder </td>
														<td> holder </td>
														<td>
															<Table size="sm" borderless>
																holder, 3
																<br />
																holder, 2
															</Table>
														</td>
														<td> holder </td>
														<td> <Button color="warning"> Modify </Button> <Button color="danger"> Cancel </Button> </td>
														<td> holder </td>
													</tr>
													<tr>
														<td> holder </td>
														<td> holder </td>
														<td> holder </td>
														<td> holder </td>
														<td>
															<Table size="sm" borderless>
																holder, 3
																<br />
																holder, 2
															</Table>
														</td>
														<td> holder </td>
														<td> <Button color="warning"> Modify </Button> <Button color="danger"> Cancel </Button> </td>
														<td> holder </td>
													</tr>
													<tr>
														<td> holder </td>
														<td> holder </td>
														<td> holder </td>
														<td> holder </td>
														<td>
															<Table size="sm" borderless>
																holder, 3
																<br />
																holder, 2
															</Table>
														</td>
														<td> holder </td>
														<td> <Button color="warning"> Modify </Button> <Button color="danger"> Cancel </Button> </td>
														<td> holder </td>
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
			</div>
		)

		return (
			<div className="col-lg-12 reservations-container col-auto" style={pageStyle}>
				{localStorage.accesstoken ? reservationPage : this.redirectToHome()}
				<div className="reservations-form-container col-lg-12">
					<br/>
					<br/>
					<br/>
					<br/>         
					<br/> 
					<div>
						<Container>
							<Row>
								<Col>
									<div className="reservations-card">
										<div className="reservations-card-body reservations-inner-card">
											<br/>
											<div className="reservations-center-title"> <h2> My Reservations </h2> </div>
											<br />
											<div className="reservations-table-wrapper-scroll-y reservations-scrollbar">
												<Table hover>
								    				<thead>
								      					<tr>
								       						<th>Booking ID</th>
								        					<th>Date In</th>
								        					<th>Date Out</th>
								        					<th>Hotel</th>
								        					<th>Room Type, Quantity</th>
								        					<th>Total Price</th>
								        					<th>Modify/Cancel</th>
								        					<th>Status</th>
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
													        	<td> 
													        		holder, 3
													        		<br />
													        		holder, 2
													        	</td>
													        	<td> holder </td>
													        	<td> <Button color ="warning"> Modify </Button> <Button color="danger"> Cancel </Button> </td>
													        	<td> holder </td>
											        	</tr>
								    					<tr>
													     		<td> holder </td>
													     		<td> holder </td>
													        	<td> holder </td>
													        	<td> holder </td>
													        	<td>
													        		holder, 3
													        	</td>
													        	<td> holder </td>
													        	<td> <Button color ="warning"> Modify </Button> <Button color="danger"> Cancel </Button> </td>
													        	<td> holder </td>
											        	</tr>
								    					<tr>
													     		<td> holder </td>
													     		<td> holder </td>
													        	<td> holder </td>
													        	<td> holder </td>
													        	<td> 
													        		holder, 3
													        	</td>
													        	<td> holder </td>
													        	<td> <Button color ="warning"> Modify </Button> <Button color="danger"> Cancel </Button> </td>
													        	<td> holder </td>
											        	</tr>
								    					<tr>
													     		<td> holder </td>
													     		<td> holder </td>
													        	<td> holder </td>
													        	<td> holder </td>
													        	<td> 
													        		holder, 3
													        	</td>
													        	<td> holder </td>
													        	<td> <Button color ="warning"> Modify </Button> <Button color="danger"> Cancel </Button> </td>
													        	<td> holder </td>
											        	</tr>
								    				</tbody>
								    			</Table>
							    			</div>
								    	</CardBody>
								    </Card>
								    	</div>
								    </div>
								    	</div>
								    </div>
								</Col>
							</Row>
						</Container>
					</div>
				</div>
			</div>
		);
	}
}

export default Reservations;