import React from 'react';
import { withRouter } from 'react-router-dom'
// import homeImage from './Images/homeImage10.jpg';
import axios from 'axios'
import './CSS/map_autocomplete_overrides.css';

class HotelSearch extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			hotels: [{}],
			streetAddress: '',
      city: '',
      state: '',
      latitude: '',
      longitude: '',
      adult: 0,
      children: 0,
      guest_number: 0
		};

		this.roomSearch = this.roomSearch.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	async componentWillMount() {
		let queryCall = '/api/search/hotels' + this.props.location.search
		const hotelSearch = (await axios.get(queryCall)).data;
		
		const search = window.location.search;
		const params = new URLSearchParams(search);
		const streetAddress = params.get('streetAddress')
		const city = params.get('city')
		const state = params.get('state')
		const latitude = params.get('latitude')
		const longitude = params.get('longitude')
		const adult = params.get('adult')
		const children = params.get('children')
		const guest_number = params.get('guest_number')
		
		this.setState({
			hotels: hotelSearch,
			streetAddress,
			city,
			state,
			latitude,
			longitude,
			adult,
			children,
			guest_number
		}, this.renderMap());
	}

	initializeMap = () => {

		const params = new URLSearchParams(this.props.location.search);
		const latitude = parseFloat(params.get('latitude'))
		const longitude = parseFloat(params.get('longitude'))


		let googleMap = new window.google.maps.Map(document.getElementById('map'), {
			center: { lat: latitude, lng: longitude },
			zoom: 11
		});

		// const city_name = params.get('city')
		// let geocoder = new window.google.maps.Geocoder();
		// // display the center of the map by city name
		// geocoder.geocode({ 'address': city_name }, function (results, status) {
		// 	if (status === 'OK') {
		// 		googleMap.setCenter(results[0].geometry.location);
		// 	} else {
		// 		alert('Geocode was not successful for the following reason: ' + status);
		// 	}
		// });

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
		const CALLBACK_URL = "https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_GOOGLE_MAP_API_KEY + "&callback=initMap"
		loadGoogleMapScript(CALLBACK_URL)
		window.initMap = this.initializeMap
	}

	roomSearch = item => event => {
		const queryString = this.props.location.search + "&hotel_id=" + item.hotel_id
		this.props.history.push({
			pathname: `/RoomPage`,
			search: `${queryString}`
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


	render() {

		// console.log(this.props.location.search)
		if (this.state.hotels.results === undefined) {
			return <div> Loading...</div>
		}

		const search = window.location.search;
		const params = new URLSearchParams(search);
		const location = params.get('city')
		const dateIn = params.get('date_in')
		const dateOut = params.get('date_out')
		const adult = params.get('adult')
		const children = params.get('children')
		// let guest_number = params.get('guest_number')

		/*Capitalizes the first letter of each word in a phrase*/
		function toTitleCase(str) {
			return str.replace(/\w\S*/g, function (txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		}


		const showResult = (

			<div className="hotel-search-container">

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
