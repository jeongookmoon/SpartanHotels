import React from 'react';
import { withRouter } from 'react-router-dom'



import homeImage from './Images/homeImage7.jpg';



var topSectionStyle = {
	width: "100%",
	height: "100vh",
	backgroundRepeat: "no-repeat",
	backgroundSize: "cover",
	backgroundPosition: "center center",
	backgroundImage: `url(${homeImage})`,
};

class Confirmation extends React.Component {

	render() {


			const roomPage = (
					<div className="col-lg-12 home-container col-auto" style={topSectionStyle}>
					<div className="home-form-container col-lg-12">
						<form className="home-form col-lg-12">
						</form>
					</div>
					</div>

				)

				return(
					<div>{roomPage}</div>
				);
			
	}
}

export default withRouter(Confirmation);
