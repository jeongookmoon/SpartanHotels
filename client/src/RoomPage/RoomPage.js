import React from 'react';
import axios from 'axios'
import { withRouter } from 'react-router-dom'


class RoomPage extends React.Component {


	constructor(props) {
		super(props);
		const { data } = this.props.location;
		console.log(this.props.location.city);
		this.state = {
			hotels: [{}],
			address: this.props.location.address,
			amenities: this.props.location.ammenities,
			city: this.props.location.city,
			country: this.props.location.country,
			description: this.props.location.description,
			hotel_id: this.props.location.hotel_id,
			images: this.props.location.images,
			latitude: this.props.location.latitude,
			longitude: this.props.location.longitude,
			max_price: this.props.location.max_price,
			min_price: this.props.location.min_price,
			name: this.props.location.name,
			phone_number: this.props.location.phone_number,
			rating: this.props.location.rating,
			rooms_available: this.props.location.rooms_available,
			state: this.props.location.state,
			zipcode: this.props.location.zipcode,
		};
		console.log(this.state.city);

	}

	Checkout(event) {
    event.preventDefault()

    this.props.history.push(`/Checkout`)
  }

	render() {

		let imageURLS = this.state.images;
		let imageArray = imageURLS.split(",");
		console.log(imageArray[0]);


	

  return (
		<div className="room-page-container">
			<div className="col-lg-12 room-page-hotel-image-container row">
				<div className="col-lg-3 shadow-lg room-page-hotel-description">
				<h1>{this.state.name}</h1>
				<hr></hr>
				<div> {this.state.address} </div>
				<div> {this.state.state} </div>
				<div> {this.state.zipcode} </div>
				<div> {this.state.location} </div>
				<div> {this.state.phone_number} </div>

				<hr></hr>
				{this.state.description}

				</div>
				<img className="col-lg-9 room-page-hotel-image " src={imageArray[0]} alt="logo" />

			</div>

			<div className="room-page-rooms-container">
				<div className="col-lg-12 shadow-lg room-page-rooms">
					<tbody>

						<tr>
							<td>
								Room Type
							</td>
							<td>
								Room Image
							</td>
							<td>
								Room Description
							</td>
							<td>
								Room Ammenities
							</td>
							<td>
								2
							</td>
							<td>
								Room Price
							</td>
							<td>
								<button onClick={this.Checkout.bind(this)} className="p-2 submit-button btn btn-danger my-2 my-sm-0" type="submit">Check Out</button>

							</td>
						</tr>

						<tr>
							<td>
							Room A
							</td>
							<td>
								Room Image
							</td>
							<td>
								Room Description
							</td>
							
							<td>
								Room Ammenities
							</td>
							<td>
								2
							</td>
							<td>
								{this.state.min_price}
							</td>
							<td>
								<button onClick={this.Checkout.bind(this)} className="p-2 submit-button btn btn-danger my-2 my-sm-0" type="submit">Check Out</button>

							</td>
						</tr>

						<tr>
							<td>
							Room B
							</td>
							<td>
								Room Image
							</td>
							<td>
								Room Description
							</td>
							<td>
								Room Ammenities
							</td>
							<td>
								2
							</td>
							<td>
								{this.state.min_price}
							</td>
							<td>
								<button onClick={this.Checkout.bind(this)} className="p-2 submit-button btn btn-danger my-2 my-sm-0" type="submit">Check Out</button>

							</td>
						</tr>

						<tr>
							<td>
							Room C
							</td>
							<td>
								Room Image
							</td>
							<td>
								Room Description
							</td>
							<td>
								Room Ammenities

							</td>
							<td>
								2
							</td>
							<td>
								{this.state.max_price}
							</td>
							<td>
								<button onClick={this.Checkout.bind(this)} className="p-2 submit-button btn btn-danger my-2 my-sm-0" type="submit">Check Out</button>

							</td>
						</tr>
					</tbody>
				</div>
			
			</div>


		</div>
  	);
  }
}

export default withRouter(RoomPage);
