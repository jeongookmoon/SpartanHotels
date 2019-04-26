import React from 'react';
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { Table} from 'reactstrap';
import './css/RoomPage.css'



class RoomPage extends React.Component {
	constructor(props) {
		super(props);


		const params = new URLSearchParams(this.props.location.search);
		const hotel_id = params.get('hotel_id')
		const date_in = params.get('date_in')
		const date_out = params.get('date_out')
		const city = params.get('city')

		this.state = {
			hotel: {},
			rooms: {},
			hotel_id,
			date_in,
			date_out,
			city,
			King: 0,
			KingPrice: 0,
			Queen: 0,
			QueenPrice: 0,
			totalPrice: 0,
		};

		this.KingPrice = 0;
		this.QueenPrice = 0;
		this.kingID = 0;
		this.queenID = 0;
	}

	Checkout = (event) => {
		event.preventDefault()
		let queryString = this.props.location.search + `&country=${this.state.hotel.results[0].country}&state=${this.state.hotel.results[0].state}&address=${this.state.hotel.results[0].address}&king=${this.state.King}&kingID=${this.kingID}&queen=${this.state.Queen}&queenID=${this.queenID}&totalPrice=${this.KingPrice * this.state.King + this.QueenPrice * this.state.Queen}`
		this.props.history.push({
			pathname: `/Checkout`,
			search: `${queryString}`,
		})
	}

	async componentDidMount() {
		const roomSearchQuery = `/api/search/hotels/${this.state.hotel_id}/?date_in=${this.state.date_in}&date_out=${this.state.date_out}`
		const hotelSearchQuery = `/api/search/hotels?city=${this.state.city}&date_in=${this.state.date_in}&date_out=${this.state.date_out}&hotel_id=${this.state.hotel_id}`

		const rooms = (await axios.get(roomSearchQuery)).data
		const hotel = (await axios.get(hotelSearchQuery)).data
		this.setState({
			rooms, hotel
		})
	}

	handleEachRoomQuantity = (event) => {
		const target = event.target;
		const value = target.value;
		const name = target.name; //King? Queen?
		this.setState({
			[name]: value
		});

	}


	handleRoomPrice(room) {

		if (room.bed_type === "King" && this.state.King > 0){
			this.KingPrice = room.price;
			this.kingID = room.room_id;
		}

		if (room.bed_type === "King" && this.state.King === 0){
			this.KingPrice = 0;
			this.kingID = room.room_id;

		}

		if (room.bed_type === "Queen" && this.state.Queen > 0){
			this.QueenPrice = room.price;
			this.queenID = room.room_id;


		}

		if (room.bed_type === "Queen" && this.state.Queen === 0){
			this.QueenPrice = 0;
			this.queenID = room.room_id;

		}

	}

	render() {

		if (!this.state.hotel.results) {
			return (
				<div className="hotel-search-container"> Loading </div>
			);
		}

		else {
			const imageURLS = this.state.hotel.results[0].images;
			let imageArray = []
			if (imageURLS) {
				imageArray = imageURLS.split(",");
			}

		const roomPage = (
				<div className="room-page-container">
					{/*
					<div className="col-lg-12 custom-row room-page-hotel-image-container" style={{width: "100vw",
							height: "100vh",
							backgroundRepeat: "no-repeat",
							backgroundSize: "cover",
							backgroundPosition: "center center", backgroundImage: `url(${imageArray[0]})`}}>		
					
						<div className="col-lg-6 room-page-hotel-description">
							<p>{this.state.hotel.results[0].name}</p>
							<hr></hr>
							<div> {this.state.hotel.results[0].address} </div>
							<div> {this.state.hotel.results[0].state} </div>
							<div> {this.state.hotel.results[0].zipcode} </div>
							<div> {this.state.hotel.results[0].location} </div>
							<div> {this.state.hotel.results[0].phone_number} </div>

							<hr></hr>
							{this.state.hotel.results[0].description}
						</div>

					</div>
					*/}

					<div className="room-page-rooms-container">
						<div>
						        {
									this.state.rooms.results.length > 0 ?
										<div className="">
											<div className="col-lg-12 custom-row room-page-hotel-container">
												<div className="container">
							        				<div className="custom-row mb-5">
							          					<div className="col-md-12">
								            				<div className="block-3 d-md-flex room-page-hotel-description">
								              					
									           					<div className="col-md-4 text">

									               					<h2 className="heading">{this.state.hotel.results[0].name}</h2>

									               					<div className="room-page-item-rating">
									               						<span className="fa fa-star hotel-search-item-rating-checked"></span>
									               						<span className="fa fa-star hotel-search-item-rating-checked"></span>
									               						<span className="fa fa-star hotel-search-item-rating-checked"></span>
									               						<span className="fa fa-star hotel-search-item-rating-checked"></span>
									               						<span className="fa fa-star"></span>
									               					</div>

										                			<ul className="specs">
											                  			<li> {this.state.hotel.results[0].address}, {this.state.hotel.results[0].city}, {this.state.hotel.results[0].state}, {this.state.hotel.results[0].zipcode} </li>
											                  			<li> {this.state.hotel.results[0].phone_number}</li>
											                  			<li> <sup>{this.state.hotel.results[0].description}</sup></li>
										                			</ul>

													           	</div>

													           	<div className="col-md-8 room-page-image" style={{backgroundImage: `url(${imageArray[0]})`}}>
								              					</div>
												            </div>
					          							</div>  
					          						</div> 
		          								</div> 
	          								</div>

											<hr></hr>

	          								<div className="col-lg-12 room-page-rooms custom-row container">
											{
												this.state.rooms.results.map((eachRoomResult, index) => {

													return (
															<div className="room-page-room-item col-lg-4 mb-5" key={index}>
																<div className="block-34"  style={{ cursor: "pointer" }}>
																  	<div className="room-page-image">
																      	<a href="#child4"><img src={imageArray[0]} alt="Placeholder"/></a>
																  	</div>
																  	<div className="text">
																	    <h2 className="heading">{eachRoomResult.bed_type} Size Room</h2>
																	    <div className="price"><sup className="room-page-room-price">$</sup><span className="room-page-room-price">{eachRoomResult.price.toFixed(2)}</span><sub>/per night</sub></div>
																	    <ul className="specs">
																		     	 <li><strong>Ammenities:</strong> Closet with hangers, HD flat-screen TV, Telephone</li>
																		     	 <li><strong>Capacity Per Room:</strong> {eachRoomResult.capacity}</li>
																		     	 {/*<li><strong>Bed Number:</strong> {eachRoomResult.bed_number} </li>*/}

																		     	 {/*<a href="#child4">{eachRoomResult.room_number}</a>*/}
																	    </ul>


																	    <div >
																	    	<strong># Of Rooms </strong> 
																		    <input type="text" name={eachRoomResult.bed_type} list="numbers" value={eachRoomResult.THIS_IS_A_PLACEHOLDER} onChange={this.handleEachRoomQuantity}>
																		    </input>
																		    <datalist id="numbers">
																		      <option value="1"></option>
																		      <option value="2"></option>
																		      <option value="3"></option>
																		      <option value="4"></option>
																		      <option value="5"></option>
																		    </datalist>
																	    </div>
										                				{/*<p><a href="#" className="btn btn-primary py-3 px-5">Read More</a></p>*/}

																  	</div>
																</div>
															</div>
													)
												})			
											}
											</div>
										</div> :
										<div>no result</div>
								}

								<hr></hr>
									{/*
									<FormGroup className="form-inline ">
										<div className="col-lg-12 input-group custom-row home-date">
											<div className="input-group-append">
												<div className="check-in-icon input-group-text"><i className="fa fa-calendar"></i></div>
											</div>
											<DateRangePicker
												startDate={this.state.searchParams.date_in} // momentPropTypes.momentObj or null,
												startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
												endDate={this.state.searchParams.date_out} // momentPropTypes.momentObj or null,
												endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
												onDatesChange={({ startDate, endDate }) =>
													this.setState(prevState => ({
														searchParams: {
															...prevState.searchParams,
															date_in: startDate,
															date_out: endDate
														}
													}))
												} // PropTypes.func.isRequired,
												focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
												onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
											/>
										</div>

									</FormGroup>

									*/}

									<div className="room-page-checkout-description">

																<Table hover borderless>
																	<thead>
																		<tr>
																			<th>Room Type</th>
																			<th>Capacity</th>
																			<th>Price</th>
																			<th>Quantity</th>
																			<th>Total</th>
																		</tr>
																	</thead>

																	{
																		this.state.King || this.state.Queen > 0 ?
																			<tbody>
																				{

																					this.state.rooms.results.map((eachRoomResult, index) => {

																						{/*
																							Can't get this to work, would prefer using this than the eachRoomResult.bed_type === "King" ? this.state.King : this.state.Queen...
																						function identifyBedType(temp){

																							if(temp === "King"){
																								return {this.state.King}
																							}

																							else if(temp === "Queen"){
																								return "this.state.Queen";
																							}
																						}
																						*/}

																						if(eachRoomResult.bed_type === "King" && this.state.King > 0){
																							{this.handleRoomPrice(eachRoomResult)};
																							return (

																								<tr onClick={this.Checkout.bind(this)} key={index}>
																									<td >{eachRoomResult.bed_type}</td>
																									<td> {eachRoomResult.capacity}</td>
																									<td>${eachRoomResult.price.toFixed(2)}</td>
																									{/*<td> {identifyBedType(eachRoomResult.bed_type)}</td>*/}
																									<td>{eachRoomResult.bed_type === "King" ? this.state.King : this.state.Queen} </td>
																									<td>$ {eachRoomResult.bed_type === "King" ? this.state.King * eachRoomResult.price.toFixed(2) : this.state.Queen * eachRoomResult.price.toFixed(2)}</td>
																								</tr>
																							)


																						}

																						if(eachRoomResult.bed_type === "Queen" & this.state.Queen > 0){
																							{this.handleRoomPrice(eachRoomResult)};
																							return (
																								<tr onClick={this.Checkout.bind(this)} key={index}>
																									<td >{eachRoomResult.bed_type}</td>
																									<td> {eachRoomResult.capacity}</td>
																									<td>${eachRoomResult.price.toFixed(2)}</td>
																									{/*<td> {identifyBedType(eachRoomResult.bed_type)}</td>*/}
																									<td>{eachRoomResult.bed_type === "King" ? this.state.King : this.state.Queen} </td>
																									<td>$ {eachRoomResult.bed_type === "King" ? this.state.King * eachRoomResult.price.toFixed(2) : this.state.Queen * eachRoomResult.price.toFixed(2)}</td>
																								</tr>
																							)


																						}

																						else {
																							return (
																							<div>
																							</div>
																							)
																						}

																					})


																				}
																				<tr className="hr-row">
																								<td><hr></hr> </td>
																								<td><hr></hr> </td>
																								<td><hr></hr> </td>
																								<td><hr></hr> </td>
																								<td><hr></hr> </td>
																				</tr>

																				<tr>
																								<td> </td>
																								<td> </td>
																								<td> </td>
																								<td><strong> Estimated Total </strong></td>
																								<td> $ {this.KingPrice * this.state.King + this.QueenPrice * this.state.Queen} </td>
																				</tr>

																			</tbody> :
																			<tbody><tr></tr></tbody>
																	}
																</Table>
															</div>
									
									<p className="room-page-submit-button btn btn-primary py-3 px-5 mb-5"  style={{ cursor: "pointer" }} onClick={this.Checkout.bind(this)}>Checkout</p>

								</div>


						{/* JEONG'S
						<div className="col-lg-12 shadow-lg room-page-rooms">

							<Table hover borderless>
								<thead>
									<tr>
										<th>Room #</th>
										<th>Bed #</th>
										<th>Bed Type</th>
										<th>Price</th>
									</tr>
								</thead>

								{
									this.state.rooms.results.length > 0 ?
										<tbody>
											{
												this.state.rooms.results.map((eachRoomResult, index) => {
													return (
														<tr onClick={this.Checkout.bind(this)} style={{ cursor: "pointer" }} key={index}>
															<th scope="row"><a href="#child4">{eachRoomResult.room_number}</a></th>
															<td>{eachRoomResult.bed_number}</td>
															<td>{eachRoomResult.bed_type}</td>
															<td>${eachRoomResult.price}</td>
														</tr>
													)
												})
											}
										</tbody> :
										<tbody><tr>no result</tr></tbody>
								}
							</Table>
						</div>
						*/}
					</div>
				</div>
			)

			return(
				<div>{roomPage}</div>
			);
		}
	}
}

export default withRouter(RoomPage);
