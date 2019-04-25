import React from 'react';
import { withRouter } from 'react-router-dom'
import "./UserProfile.css";
import "./RewardHistory.css";
import homeImage from './homeImage7.jpg';
import { Container, Row, Col, Table } from 'reactstrap';

var topSectionStyle = {
	width: "100%",
	backgroundRepeat: "no-repeat",
	backgroundSize: "cover",
	backgroundPosition: "center center",
	backgroundImage: `url(${homeImage})`,

};

class RewardHistory extends React.Component {
	render () {
		return (
			<div className="col-lg-12 history-container col-auto" style={topSectionStyle}>
				<div className="history-form-container col-lg-12">
					<br/>
					<br/>
					<br/>
					<br/>         
					<br/>
					<div>
						<Container>	
							<Row>
								<Col sm="1"/>
								<Col sm="10">
									<div className="history-card">
										<div className="history-card-body history-inner-card">
											<br />
											<div className="history-center-title"> <h2> My Reward History </h2> </div>
											<br />
											<div className="history-table-wrapper-scroll-y history-scrollbar">
												<Table hover>
													<thead>
														<tr>
															<th> Booking ID </th>
															<th> Hotel || Check-in - Check-out </th>
															<th> Points Pending </th>
															<th> Points Earned </th>
														</tr>
													</thead>
													<tbody>
														<tr>
															<td> holder </td>
															<td> Sheraton || 4/3/19 - 4/4/19</td>
															<td> holder </td>
															<td> holder </td>
														</tr>
														<tr>
															<td> holder </td>
															<td> holder </td>
															<td> holder </td>
															<td> holder </td>
														</tr>
														<tr>
															<td> holder </td>
															<td> holder </td>
															<td> holder </td>
															<td> holder </td>
														</tr>
													</tbody>
												</Table>
											</div>
										</div>
										<div> 
											<p> *Disclaimer: Points are rewarded 24 hours after the completion of your stay. </p>
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

export default withRouter(RewardHistory);