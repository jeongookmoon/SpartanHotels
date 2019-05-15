import React from 'react';
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import "./UserProfile.css";
import homeImage from './homeImage7.jpg';
import ProfileEditName from './ProfileEditName'
import ProfileEditPassword from './ProfileEditPassword'

import {
	Card, CardText,
	Button, CardHeader,
	Container, Row, Col
} from 'reactstrap';

var topSectionStyle = {
	width: "100%",
	height: "100vh",
	backgroundRepeat: "no-repeat",
	backgroundSize: "cover",
	backgroundPosition: "center center",
	backgroundImage: `url(${homeImage})`,

};

class UserProfile extends React.Component {
	state = {

		name: "",
		email: "",
		reward: "",
		currentDates: "",
		futureDates: "",
		rewardsEarned: "",
		transaction: "",
		currentRewardsHistory: [],
		futureRewardsHistory: [],
		user: []

	}

	RewardHistory(event) {
		event.preventDefault()
		this.props.history.push('/RewardHistory')
	}

	change = e => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	onSubmit = (e) => {//able to se values once submitted
		e.preventDefault();
		this.props.onSubmit(this.state)//possibly delete this.state
		// console.log(this.state);
	};
	fileSelectedHandler = event => {
		// console.log(event.target.files[0]);
	}


	componentDidMount() {
		axios.get('/api/profile')
			.then(res =>
				this.setState({
					name: res.data.name,
					email: res.data.email,
					reward: res.data.reward
				}))
	}

	redirectToHome() {
		this.props.history.push('/')
	}

	render() {
		const profilePage = (
			<div className="profile-form-container col-lg-12 dark-tint" >
				<div>
					<Container className="profile-form-card-container">
						<Row>
							<Col sm="12" md={{ size: 6, offset: 3 }}>
								<div className="profile-card">
									<div className="profile-center-title"> Hello {this.state.name}! </div>
									<br />
									<div className="profile-card-body profile-inner-card">
										<Col>
											<Card>
												<CardHeader className="profile-inner-cardheader" tag="h4"> ABOUT </CardHeader>
												<div className="profile-inner-cardbody">
													<Row>
														<Col xs="6" sm="4">
															<br />
															<br />
															<img className="profile-human-pic" src="https://png.pngtree.com/svg/20160308/_user_profile_icon_1108089.png" alt="profile" width="115" />
														</Col>
														<Col>
															<CardText className="profile-text-row">
																<br />
																<b> Email: </b> {this.state.email}
																<br />
																<b> Name: </b> {this.state.name}
																<br />
																<b> Password: </b> ********
							         							</CardText>
														</Col>
													</Row>
													<Row>
														<Col xs="4"></Col>
														<Col xs="8">
															<ProfileEditName />
															<ProfileEditPassword />
															<br />
														</Col>
													</Row>
												</div>
											</Card>
										</Col>
									</div>
									<div className="profile-card-body profile-inner-card">
										<Col>
											<Card>
												<CardHeader className="profile-inner-cardheader" tag="h4"> REWARDS </CardHeader>
												<div className="profile-inner-cardbody">
													<CardText>
														<br />
														Total Points: {this.state.reward}
														<br />
														<br />
														<Button onClick={this.RewardHistory.bind(this)} color="info"> See my reward history > </Button>
														<br />
														<br />
													</CardText>
												</div>
											</Card>
										</Col>
									</div>
								</div>
							</Col>
						</Row>
					</Container>
				</div>
			</div>
		)

		return (
			<div className="col-lg-12 profile-container col-auto" style={topSectionStyle}>
				{localStorage.accesstoken ? profilePage : this.redirectToHome()}
			</div>
		);
	}
}

export default withRouter(UserProfile);