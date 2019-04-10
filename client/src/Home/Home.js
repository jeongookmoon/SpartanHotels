import React from 'react';
import { withRouter } from 'react-router-dom'

import homeImage from './Images/homeImage7.jpg';

var topSectionStyle = {
	width: "100%",
	backgroundRepeat: "no-repeat",
	backgroundSize: "cover",
	backgroundPosition: "center center",
	backgroundImage: `url(${homeImage})`,
};

class Home extends React.Component {

	render() {
		return (
			<div className="col-lg-12 home-container col-auto" style={topSectionStyle}>
				<div className="home-form-container col-lg-12">
					<div className="home-form col-lg-12">
						<div className="top-header ">
							Plan your next trip
		  		  </div>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Home);
