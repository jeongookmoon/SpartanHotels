import React from 'react';
import { withRouter } from 'react-router-dom'
import "./UserProfile.css";
import "./RewardHistory.css";
import homeImage from './homeImage7.jpg';
import { Container, Row, Col, Table } from 'reactstrap';
import axios from 'axios';

var topSectionStyle = {
	width: "100%",
	height: "100vh",
	backgroundRepeat: "no-repeat",
	backgroundSize: "cover",
	backgroundPosition: "center center",
	backgroundImage: `url(${homeImage})`,

};

class RewardHistory extends React.Component {
	state = {
		rewardsHistory: [],
		user: []
	}

	componentDidMount() {
	  	var that = this
	  	axios.all([axios.get('/api/rewardsHistory')])
	  		.then(axios.spread(function(rewardsHistory) {
	  			// console.log(rewardsHistory.data[0])
	  			var rewardsTableData = []
	  			let today = new Date().toISOString().slice(0, 10)
	  			var points_pending = 0;
	  			var points_earned = 0;

				for (var x = 0; x < rewardsHistory.data.length; x++) {
					var booking_id = rewardsHistory.data[x].transaction_id
					var hotel = rewardsHistory.data[x].name;
					var dates = rewardsHistory.data[x].date_in + ' - ' + rewardsHistory.data[x].date_out
					if (rewardsHistory.data[x].date_active <= today) {
						points_pending = 0
						points_earned = rewardsHistory.data[x].change
					}
					else {
						points_pending = rewardsHistory.data[x].change
						points_earned = 0
					}

					rewardsTableData[x] = { booking_id, hotel, dates, points_pending, points_earned }
				}
				// console.log(rewardsTableData)

				that.setState({
					rewardsHistory: rewardsTableData
				})

			}))
			.catch(error => console.log('asdasdasd', error))

	}

	renderRewardsTableData() {
		return this.state.rewardsHistory.map((rewards, index) => {
			const { booking_id, hotel, dates, points_pending, points_earned } = rewards //destructuring
			return (
				<tr key={index+1234}>
					<td>{booking_id}</td>
					<td>{hotel}</td>
					<td>{dates}</td>
					<td>{points_pending}</td>
					<td>{points_earned}</td>
				</tr>
			)
		})
	}

	redirectToHome() {
		this.props.history.push('/')
	}

	render() {
		const rewardPage = (
			<div className="history-form-container col-lg-12 dark-tint">
				<br />
				<br />
				<br />
				<br />
				<br />
				<div>
					<Container>
						<Row>
							<Col>
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
														<th> Hotel </th>
														<th> Check-in - Check-out </th>
														<th> Points Pending </th>
														<th> Points Earned </th>
													</tr>
												</thead>
												<tbody>
													{this.renderRewardsTableData()}
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
		)

		return (
			<div className="col-lg-12 history-container col-auto" style={topSectionStyle}>
				{localStorage.accesstoken ? rewardPage : this.redirectToHome()}
			</div>
		);
	}
}

export default withRouter(RewardHistory);