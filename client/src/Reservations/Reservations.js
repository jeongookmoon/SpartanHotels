import React from 'react';
import { Table, Button, Card, 
		CardBody, CardTitle, CardHeader,
		Container, Row, Col } from 'reactstrap';
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
	constructor (props) {
		super (props)
		this.state = {
			history: [{}]
		}
	}

	componentDidMount() {
      axios.get('/api/reservation/viewres').then(res => 
          this.setState({
            history: res.data
          }))  
        console.log(this.state.history)
  }

	render() {
		return (
			<div className="col-lg-12 reservations-container col-auto" style={pageStyle}>
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
									<Card>
										<CardBody>
											<br/>
											<CardTitle> <h2> My Reservations </h2> </CardTitle>
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
													        	<td> <Button color ="warning"> Modify </Button> <Button color="danger"> Cancel </Button> </td>
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
													        	<td> <Button color ="warning"> Modify </Button> <Button color="danger"> Cancel </Button> </td>
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
													        	<td> <Button color ="warning"> Modify </Button> <Button color="danger"> Cancel </Button> </td>
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
													        	<td> <Button color ="warning"> Modify </Button> <Button color="danger"> Cancel </Button> </td>
													        	<td> holder </td>
											        	</tr>
								    				</tbody>
								    			</Table>
							    			</div>
								    	</CardBody>
								    </Card>
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