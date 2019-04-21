import React from 'react';
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import "./UserProfile.css";
import homeImage from './homeImage7.jpg';
import ProfileEditName from './ProfileEditName'
import ProfileEditPassword from './ProfileEditPassword'
import { Card, CardText, CardBody,
		CardTitle, Button, CardHeader,
		Container, Row, Col, Table } from 'reactstrap';

var topSectionStyle = {
	width: "100%",
	backgroundRepeat: "no-repeat",
	backgroundSize: "cover",
	backgroundPosition: "center center",
	backgroundImage: `url(${homeImage})`,

};

class UserProfile extends React.Component{
  state = {
 
    name: "",
    email: "",
    reward: "",
    user : []
    
  }
  
  change = e =>{
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = (e) => {//able to se values once submitted
    e.preventDefault();
    this.props.onSubmit(this.state)//possibly delete this.state
    console.log(this.state); 
  };
  fileSelectedHandler = event =>{
      console.log(event.target.files[0]);
  }
  
  componentDidMount() {
      axios.get('/api/profile')
        .then(res => 
          this.setState({
            name: res.data[0].name,
            email: res.data[0].email,
            reward: res.data[0].reward
          }))  
  }

  
  render() {
		return (
			<div className="col-lg-12 profile-container col-auto" style={topSectionStyle}>
				<div className="profile-form-container col-lg-12">
					<br/>
					<br/>
					<br/>
					<br/>         
					<br/> 
					<div>
						<Container>
							<Row>
								<Col sm="12" md={{ size: 6, offset: 3 }}>
									<Card body className="text-center"  style={{height: "710px"}}>
										<CardBody>
											<CardTitle> <h1> Hello {this.state.name}! </h1></CardTitle>
			         						<br />
			          						<Row>
				         						<Col>
				         							<Card>
				         								<CardHeader tag="h4"> ABOUT </CardHeader>
				         								<CardBody>
				         									<Row>
					         									<Col xs="6" sm="4">	
					         										<br />				         									
							         								<img src="https://png.pngtree.com/svg/20160308/_user_profile_icon_1108089.png" width="90" />
							         							</Col>
							         							<Col>
							         								<CardText> 
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
								         							<Button size = "sm" color ="link"> <ProfileEditName /> </Button>
								         							<Button size = "sm" color = "link"> <ProfileEditPassword /> </Button>
								         						</Col>
						         							</Row>
				         								</CardBody>
				         							</Card>
				         						</Col>
				         					</Row>
				         					<br/>
				         					<Row>
				          						<Col>
				          							<Card>
				          								<CardHeader tag="h4"> REWARDS </CardHeader>
				         								<CardBody>
				         									<CardText>
				         										Total Points: {this.state.reward} 
				         										<br />
				         										<br />
				         										<div className="profile-table-wrapper-scroll-y profile-scrollbar">
				         											<Table hover>
				         												<thead>
				         													<tr>
				         														<th> Date </th>
				         														<th> Points Earned </th>
				         														<th> Transaction </th>
				         													</tr>
				         												</thead>
				         												<tbody>
				         													<tr>
				         														<td> holder </td>
				         														<td> holder </td>
				         														<td> holder </td>
				         													</tr>
				         													<tr>
				         														<td> holder </td>
				         														<td> holder </td>
				         														<td> holder </td>
				         													</tr>
				         													<tr>
				         														<td> holder </td>
				         														<td> holder </td>
				         														<td> holder </td>
				         													</tr>
				         												</tbody>
				         											</Table>
				         										</div>
				         									</CardText>
				         								</CardBody>
				         							</Card>
				          						</Col>
				          					</Row>
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
export default withRouter(UserProfile);