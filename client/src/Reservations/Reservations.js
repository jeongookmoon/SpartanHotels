import React, {Component} from 'react';
//import './ReservationsStyle.css';


class Reservations extends Component {
	constructor (props) {
		super (props)
		this.state = {
			history: []
		}
		//this.loadData = this.loadData.bind(this);
	}

	componentDidMount() {
		//this.loadData()
		let self = this;
		fetch('/history', {
			method: 'GET'
		}).then(function(response) {
			if (response.status >= 400) {
				throw new Error ("Bad response from server");
			}
			return response.json();
		}).then(function(data) {
			self.setState({history: data});
		}).catch(err => {
			console.log('caught it!', err);
		})
	}

	render() {
		var topSectionStyle = {
    		marginTop:"6.5em",
		};

		var midSectionStyle = {
			marginTop: "2em",
		};
		return (
			<div className="topheader" style={topSectionStyle}>
				<div className="col-auto pl-0">
					<h3> MY RESERVATIONS </h3>
				</div>
				<div class="container" style={midSectionStyle}>
					<table class="table table-bordered">
	    				<thead>
	      					<tr>
	       						<th>Booking ID</th>
	        					<th>Date In</th>
	        					<th>Date Out</th>
	        					<th>Hotel</th>
	        					<th>Room</th>
	        					<th>Total Price</th>
	        					<th>Edit/Cancel</th>
	        					<th>Status</th>
	      					</tr>
	    				</thead>
	    				<tbody>
				     		<td> N/A </td>
				     		<td> N/A </td>
				        	<td> N/A </td>
				        	<td> N/A </td>
				        	<td> N/A </td>
				        	<td> N/A </td>
				        	<td> </td>
				        	<td> N/A </td>
	    				</tbody>
	  			</table>
				</div>
			</div>
		);
	}
}

export default Reservations;