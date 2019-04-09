import React from 'react';
import { withRouter } from 'react-router-dom'
// import homeImage from './Images/homeImage10.jpg';
import axios from 'axios'
import { HotelSearchFunction } from '../Utility/HotelSearchFunction'
import {
	FormGroup
} from 'reactstrap'
import './CSS/map_autocomplete_overrides.css';
import './CSS/react_dates_overrides.css'; //NEEDED in order to OVERRIDE css styling of _datepicker.css
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Autocomplete from "./Autocomplete";

class HotelSearch extends React.Component {

	constructor(props) {
		super(props);


		let search = window.location.search;
		let params = new URLSearchParams(search);
		let location = params.get('city')
		let dateIn = params.get('date_in')
		let dateOut = params.get('date_out')
		let adult = params.get('adult')
		let children = params.get('children')
		let guest_number = params.get('guest_number')

		// const { data } = this.props.location;
		this.state = {
			hotels: [{}],
			address: "",
			amenities: "",
			city: location,
			country: "",
			description: "",
			hotel_id: 0,
			images: "",
			latitude: "",
			longitude: "",
			max_price: 0,
			min_price: 0,
			name: "",
			phone_number: "",
			rating: 0,
			rooms_available: 0,
			state: "",
			zipcode: 0,
			date_in: null,
			date_out: null,
			adult: adult,
			children: children,
			guest_number: guest_number,
			focusedInput: null,
			place: {}

		};

		this.roomSearch = this.roomSearch.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.search = this.search.bind(this);
		this.adultIncrement = this.adultIncrement.bind(this);
		this.adultDecrement = this.adultDecrement.bind(this);
		this.childrenIncrement = this.childrenIncrement.bind(this);
		this.childrenDecrement = this.childrenDecrement.bind(this);
	}

	showPlaceDetails(place) {
		//console.log('formatted address in json: ', JSON.stringify(place, null, 2))
		let address = JSON.stringify(place.formatted_address, null, 2).replace(/['"]+/g, '')
		let cityName = address.substr(0, address.indexOf(','))
		// let stateAbbreviation = address.substring(
		// 	address.lastIndexOf(cityName+",") + cityName.length+2, 
		// 	address.lastIndexOf(",")
		// );

		// console.log('address: ', address)
		// console.log('cityName: ', cityName)
		// console.log('stateAbbreviation: ', stateAbbreviation)
		this.setState({ city: cityName, place })
		// console.log('cityName in state: ', this.state.city)
	}

	async componentWillMount() {
		let queryCall = '/api/search/hotels' + this.props.location.search
		const hotelSearch = (await axios.get(queryCall)).data;
		this.setState({
			hotels: hotelSearch
		}, this.renderMap());
	}

	componentWillUnmount() {
		this.setState({
			hotels: [{}]
		})
	}

	initializeMap = () => {
		let geocoder = new window.google.maps.Geocoder();

		let googleMap = new window.google.maps.Map(document.getElementById('map'), {
			center: { lat: 0, lng: 0 },
			zoom: 11
		});

		let params = new URLSearchParams(this.props.location.search);
		let city_name = params.get('city')

		// display the center of the map by city name
		geocoder.geocode({ 'address': city_name }, function (results, status) {
			if (status === 'OK') {
				googleMap.setCenter(results[0].geometry.location);
			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			}
		});

		// display each hotel's information window when clicking the marker	
		let infoWindow = new window.google.maps.InfoWindow()

		this.state.hotels.results.forEach((eachHotel, index) => {

			let hotelInfo = `<h6>${eachHotel.name}</h6>
											 <p>${eachHotel.address}</p>`

			// display each hotel's marker along with index number
			let marker = new window.google.maps.Marker({
				position: { lat: parseFloat(eachHotel.latitude), lng: parseFloat(eachHotel.longitude) },
				map: googleMap,
				label: (index + 1).toString(),
				title: eachHotel.name
			})

			// action listener to open information window when clicking marker
			marker.addListener('click', function () {
				infoWindow.setContent(hotelInfo)
				infoWindow.open(googleMap, marker);
			});
		})
	}

	renderMap() {
		const CALLBACK_URL = "https://maps.googleapis.com/maps/api/js?key="+process.env.REACT_APP_GOOGLE_MAP_API_KEY+"&callback=initMap" 
		loadGoogleMapScript(CALLBACK_URL)
		window.initMap = this.initializeMap
	}

	roomSearch = item => event => {
		//I WANT TO PASS THIS AS AN OBJECT
		// this.setState({ hotel:item })
		// but it doesn't work, so i had to do this
		this.setState({
			address: item.address,
			amenities: item.ammenities,
			city: item.city,
			country: item.country,
			description: item.description,
			hotel_id: item.hotel_id,
			images: item.images,
			latitude: item.latitude,
			longitude: item.longitude,
			max_price: item.max_price,
			min_price: item.min_price,
			name: item.name,
			phone_number: item.phone_number,
			rating: item.rating,
			rooms_available: item.rooms_available,
			state: item.state,
			zipcode: item.zipcode,
		})


		// console.log(item);

		// console.log("status number(200 success, else fail): ")
		// console.log("expected reponse 200  ")
		//we don't have a query that handles the room
		let queryString = this.props.location.search + "&hotel_id=" + item.hotel_id
		this.props.history.push({
			pathname: `/RoomPage`,
			search: `${queryString}`,
			address: item.address,
			amenities: item.ammenities,
			city: item.city,
			country: item.country,
			description: item.description,
			hotel_id: item.hotel_id,
			images: item.images,
			latitude: item.latitude,
			longitude: item.longitude,
			max_price: item.max_price,
			min_price: item.min_price,
			name: item.name,
			phone_number: item.phone_number,
			rating: item.rating,
			rooms_available: item.rooms_available,
			state: item.state,
			zipcode: item.zipcode,
		})
	}

	handleChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	adultIncrement() {
		// console.log("yay");
		var value = parseInt(document.getElementById('adult').value, 10);

		value++;
		// console.log(value);

		document.getElementById('adult').value = value;
		var guest_number = parseInt(document.getElementById('adult').value, 10) + parseInt(document.getElementById('children').value, 10)

		this.setState({
			adult: value,
			guest_number: guest_number

		})
	}

	adultDecrement() {
		// console.log("yay");
		var value = parseInt(document.getElementById('adult').value, 10);

		if (value !== 0) {
			value--;
		}
		// console.log(value);

		document.getElementById('adult').value = value;
		var guest_number = parseInt(document.getElementById('adult').value, 10) + parseInt(document.getElementById('children').value, 10)


		this.setState({
			adult: value,
			guest_number: guest_number

		})

	}

	childrenIncrement() {
		// console.log("yay");
		var value = parseInt(document.getElementById('children').value, 10);

		value++;
		// console.log(value);

		document.getElementById('children').value = value;
		var guest_number = parseInt(document.getElementById('adult').value, 10) + parseInt(document.getElementById('children').value, 10)


		this.setState({
			children: value,
			guest_number: guest_number
		})

	}

	childrenDecrement() {
		// console.log("yay");
		var value = parseInt(document.getElementById('children').value, 10);

		if (value !== 0) {
			value--;
		}
		// console.log(value);

		document.getElementById('children').value = value;
		var guest_number = parseInt(document.getElementById('adult').value, 10) + parseInt(document.getElementById('children').value, 10)

		this.setState({
			children: value,
			guest_number: guest_number
		})

	}



	search = (event) => {
		// console.log('Search clicked')

		event.preventDefault()


		const temp_fields = {
			city: this.state.city,
			date_in: this.state.date_in,
			date_out: this.state.date_out,
			adult: this.state.adult,
			children: this.state.children,
		}

		HotelSearchFunction(temp_fields).then(response => {
			// console.log("status number(200 success, else fail): ")
			// // if(response === 200) {
			// console.log("expected reponse 200  ")
			// console.log(response)
			//this.props.history.push(`/HotelSearchDemo`)
			let queryString = `city=${this.state.city}&date_in=${this.state.date_in}&date_out=${this.state.date_out}&adult=${this.state.adult}&children=${this.state.children}&guest_number=${this.state.guest_number}`
			this.props.history.push({
				pathname: `/HotelSearch`,
				search: `?${queryString}`,
				data: response, // your data array of objects
				city: this.state.city,
				date_in: this.state.date_in,
				date_out: this.state.date_out,
				adult: this.state.adult,
				children: this.state.children,
			})

			window.location.reload();
			//   loginPost(temp_fields).then(loginresponse => {
			//     if(loginresponse === "S") {
			//       console.log("login success")
			//     } else if (loginresponse === "F") {
			//       console.log("login fail")
			//     }
			//     this.props.history.push(`/`)
			// })
			//  } else if (response === 400) {
			//    console.log("expected reponse 400 ")
			//  console.log(response)
			//  this.props.history.push(`/`)
			//}  
		})
	}

	render() {


		// console.log(this.props.location.search)
		if (this.state.hotels.results === undefined) {
			return <div> Loading...</div>
		}

		let search = window.location.search;
		let params = new URLSearchParams(search);
		let location = params.get('city')
		let dateIn = params.get('date_in')
		let dateOut = params.get('date_out')
		let adult = params.get('adult')
		let children = params.get('children')
		// let guest_number = params.get('guest_number')

		/*Capitalizes the first letter of each word in a phrase*/
		function toTitleCase(str) {
			return str.replace(/\w\S*/g, function (txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		}


		const showResult = (

			<div className="hotel-search-container">

				<FormGroup className="form-inline hotel-search-inputs">

					<div className="col-lg-1"></div>

					<div className="col-lg-3 input-group home-location">
						<div className="input-group-append">
							<div className="location-input-icon input-group-text"><i className="fa fa-search"></i></div>
						</div>
						<Autocomplete onPlaceChanged={this.showPlaceDetails.bind(this)} />
					</div>

					<div className="col-lg-4 input-group home-date">
								<div className="input-group-append">
									<div className="check-in-icon input-group-text"><i className="fa fa-calendar"></i></div>
								</div>
								<DateRangePicker
									startDate={this.state.date_in} // momentPropTypes.momentObj or null,
									startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
									endDate={this.state.date_out} // momentPropTypes.momentObj or null,
									endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
									onDatesChange={({ startDate, endDate }) => this.setState({ date_in: startDate, date_out: endDate })} // PropTypes.func.isRequired,
									focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
									onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
								/>
							</div>




					<div className=" col-lg-2 input-group menu-container">


						<div className="col-lg-12 menu-item">
							<div className="home-guest-dropdown">{this.state.guest_number}&nbsp;Guests</div>
							<ul>
								<li>
									<div className="form-inline home-adults-container">
										<div className="col-lg-3 home-adults">
											Adults
						                	</div>

										<div className="col-lg-9 home-increments">
											<i className="fa fa-minus home-guest-icon-increment" type="button" value="Decrement Value" onClick={this.adultDecrement}></i>
											<input readOnly className="home-guest-input" name="adult" type="text" id="adult" value={this.state.adult} onChange={this.handleChange} />
											<i className="fa fa-plus home-guest-icon-decrement" type="button" value="Increment Value" onClick={this.adultIncrement} />
										</div>
									</div>

									<div className="form-inline home-children-container">
										<div className="col-lg-3 home-children">
											Children
						                	</div>

										<div className="col-lg-9 home-increments">
											<i className="fa fa-minus home-guest-icon-increment" type="button" value="Decrement Value" onClick={this.childrenDecrement}></i>
											<input readOnly className="home-guest-input" name="children" type="text" id="children" value={this.state.children} onChange={this.handleChange} />
											<i className="fa fa-plus home-guest-icon-decrement" type="button" value="Increment Value" onClick={this.childrenIncrement} />
										</div>
									</div>


								</li>
							</ul>
						</div>




					</div>

					<div className="col-lg-1 home-submit-button-container">
						<button onClick={this.search} className="p-2 submit-button btn btn-danger my-2 my-sm-0" type="submit">Search</button>
					</div>


				</FormGroup>


				<hr className="hotel-search-hr-bottom"></hr>

				{/* HOTEL SEARCH TWO COLUMNS */}


				<div className="hotel-search-columns row">

					<div className="hotel-search-columns-container col-lg-12 row">

						<div className="hotel-search-map-column col-lg-6">
							<div id="map"></div>
						</div>

						<div className="col-lg-6 hotel-search-first-column">
							<div className="hotel-search-sort-container row">
								<div className="col-lg-1"> </div>
								<div className="col-lg-2"> Sort by: </div>
								<div className="col-lg-2">
									<select>
										<option value="Price (High to Low)">Price (High to Low)</option>
										<option value="Price (Low to High)">Price (Low to High)</option>
										<option value="Rating">Rating</option>
										<option value="Distance">Distance</option>
									</select>
								</div>
							</div>
							<div className="hotel-search-table-container">
								<table className="table hotel-search-table">
									<tbody>
										{this.state.hotels.results.map((eachHotelResult, index) => {
											/* Each Hotel Result */

											let imageURLS = eachHotelResult.images;
											let imageArray = imageURLS.split(",");
											// console.log(imageArray[0]);
											return (

												<tr className="hotel-search-row shadow-sm p-3 mb-5">


													<td className="col-lg-6">
														<img className="hotel-search-item-image" src={imageArray[0]} alt="logo" />

													</td>
													<td className="col-lg-4">
														<div>
															<div className="hotel-search-item-row hotel-search-item-header">
																<div className="hotel-search-item-number">{index + 1}.</div>
																<div className="hotel-search-item-name"> {/* Hotel Name */} </div>
																<a href=" " className="col-lg-10 hotel-search-item-name">{eachHotelResult.name}</a>
															</div>

															<div className="hotel-search-item-row hotel-search-item-rating">

																<span className="fa fa-star hotel-search-item-rating-checked"></span>
																<span className="fa fa-star hotel-search-item-rating-checked"></span>
																<span className="fa fa-star hotel-search-item-rating-checked"></span>
																<span className="fa fa-star hotel-search-item-rating-checked"></span>
																<span className="fa fa-star"></span>

															</div>

															{/* Hotel Address */}
															<div className="hotel-search-item-row hotel-search-item-address">{eachHotelResult.address}</div>
															<div className="hotel-search-item-row hotel-search-item-address">{eachHotelResult.city}</div>
															<div className="hotel-search-item-row hotel-search-item-address">{eachHotelResult.phone_number}</div>

														</div>

													</td>
													<td className="col-lg-2">
														<div>
															<div className="hotel-search-item-row">

																{/* Min Price */}

																<div className="hotel-search-item-price">
																	${eachHotelResult.min_price} &nbsp;-&nbsp; ${eachHotelResult.min_price}

																</div>
															</div>

															<br></br>

															<div className="">
																<button onClick={this.roomSearch(eachHotelResult)} value={eachHotelResult} className="p-2 hotel-search-item-button btn my-2 my-sm-0 hotel-search-item-row" type="submit">Choose Room</button>
															</div>
														</div>


													</td>

												</tr>
											);
										})}

										<tr>
											<td>
												a
									</td>
										</tr>
										<tr>
											<td>
												a
									</td>
										</tr>
										<tr>
											<td>
												a
									</td>
										</tr>

									</tbody>
								</table>
							</div>
							<div className="hotel-search-pagination">
								1 2 3 4 5 6
		  				</div>
						</div>

						{/**/}


					</div>



				</div>




			</div>
		)

		const showNoResult = (

			< div className="hotel-search-columns hotel-search-item-row" >

				<div className="col-lg-4 hotel-demo-dummy-column ">
					<div className="col-lg-12 hotel-search-table-container-demo">
						<div className="hotel-search-first-column-demo col-lg-12 shadow-sm">

							<h1 className="hotel-search-header-demo">Search By</h1>
							<hr></hr>
							<div className="col-lg-12">

								<div className="hotel-search-location-header-container-demo">
									<div className="hotel-search-location-header-demo">
										Location:
										</div>

									<div className="hotel-search-location-demo">
										{toTitleCase(location)}
									</div>
								</div>

								<div className="row hotel-search-date-container-demo">

									<div className="col-lg-6">
										<div className="hotel-search-date-in-header-demo">
											Date In:
											</div>

										<div className="hotel-search-date-in-demo">
											{dateIn}
										</div>
									</div>

									<div className="col-lg-6">
										<div className="hotel-search-date-out-header-demo">
											Date Out:
											</div>

										<div className="hotel-search-date-out-demo">
											{dateOut}
										</div>
									</div>

									<div className="hotel-search-date-out-demo">
										{children}
									</div>
								</div>

								<div className="row hotel-search-guest-container-demo">

									<div className="col-lg-6">
										<div className="hotel-search-date-in-header-demo">
											Adults #:
											</div>

										<div className="hotel-search-date-in-demo">
											{adult}
										</div>
									</div>

									<div className="col-lg-6">
										<div className="hotel-search-date-out-header-demo">
											Children #:
											</div>

										<div className="hotel-search-date-out-demo">
											{children}
										</div>
									</div>

								</div>

							</div>
						</div>
					</div>
				</div>
				<div className="col-lg-8 hotel-search-first-column-dummy table-responsive">
					<div className="hotel-search-container-no-result">
						Sorry, unable to find any hotels.
					</div>
				</div>

			</div>
		)

		if (this.state.hotels.results.length === 0) {
			return (
				<div className="">
					<div className="hotel-search-container"> 
						{showNoResult} 
					</div>
				</div>
			);
		}

		else {
			return (
				<div className="">
					<div className="hotel-search-container">
						{showResult}
					</div>
				</div>
			);
		}
	}
}

function loadGoogleMapScript(src) {
	let index = window.document.getElementsByTagName("script")[0]
	let script = window.document.createElement("script")
	script.src = src
	script.async = true
	script.defer = true
	index.parentNode.insertBefore(script, index) // insert google map script before any script in index html
}

export default withRouter(HotelSearch);
