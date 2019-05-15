import React from 'react';
import { withRouter } from 'react-router-dom'



import homeImage from './Images/homeImage14.jpeg';


var topSectionStyle = {
	height: "100vh",
	backgroundRepeat: "no-repeat",
	backgroundSize: "cover",
	backgroundPosition: "center center",
	backgroundImage: `url(${homeImage})`,
};



class Confirmation extends React.Component {

	Home(event) {
	  event.preventDefault()

	  this.props.history.push(`/`)
	}

	render() {


			const confirmation = (
					<div className="home-form-container col-lg-12">
						<div className="confirmation-container col-lg-12" onSubmit={this.search}>
								<div className="col-lg-12 custom-row">
									<div className="col-lg-3"> </div>
									<div className="col-lg-6 top-header">
										{/*<div className="subheading-sm">Confirmation</div>*/}
										<div className="confirmation-message text-center">
											<div className="confirmation-message-header">
												<i className="confirmation-message-icon far fa-check-circle"></i>
												<div> Great! Your booking is set. </div>
												<div className="confirmation-message-header-sub"> A confirmation has been sent to your email.</div>

											</div>

											<div className="confirmation-message-footer">
												<div>Thank you for booking with Spartan Hotels.</div>
												<div>And we hope you enjoy your stay!</div>
												<br></br>
												<p className="confirmation-submit-button btn btn-primary py-3 px-5 mb-5"  style={{ cursor: "pointer"}} onClick={this.Home.bind(this)} >Book Again</p>

											</div>
										</div>
										
					  				</div>
					  				<div className="col-lg-3"> </div>

					  				<div className="" style={{ width: 0, height: 0 }} id="map"></div>
				  				</div>
				  		</div>
				  	</div>
				)

				return(
					<div className="home-container" style={topSectionStyle}>{confirmation}</div>
				);
			
	}
}

export default withRouter(Confirmation);
