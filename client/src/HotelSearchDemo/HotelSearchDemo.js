import React from 'react';
import { withRouter } from 'react-router-dom'
import homeImage from './Images/homeImage7.jpg';

import axios from 'axios'
<<<<<<< HEAD
import { HotelSearchFunction } from '../Utility/HotelSearchFunction'


var topSectionStyle = {
  width:"100%",
  backgroundRepeat:"no-repeat",
  backgroundSize:"cover",
  backgroundPosition:"center center",
  backgroundImage: `url(${homeImage})`,
  position:"absolute",
};

const mapStyles = {
	width: '100%',
	height: '100%'
};
=======
>>>>>>> implemented 3 features: autocomplete for address search bar, airbnb style datepicker and google map on search result page

class HotelSearchDemo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			hotels: [{}],
			address: "",
			amenities: "",
			city: "",
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
			hotel_id: ""
		};

		this.roomSearch = this.roomSearch.bind(this);
	}

	async componentWillMount() {
		let queryCall = '/api/search/hotels' + this.props.location.search
		const hotelSearch = (await axios.get(queryCall)).data;
		this.setState({
			hotels: hotelSearch
		}, this.renderMap());
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

		this.state.hotels.results.map((eachHotel, index) => {

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
		console.log("item!!!!!!!!!!!!!");
		console.log(item);
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
			hotel_id: item.hotel_id
		})

		console.log("status number(200 success, else fail): ")
		console.log("expected reponse 200  ")
		//we don't have a query that handles the room
		let queryString = this.props.location.search + "&zip=" + item.zipcode
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

	render() {
		console.log(this.props.location.search)
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

		/*Capitalizes the first letter of each word in a phrase*/
		function toTitleCase(str) {
			return str.replace(/\w\S*/g, function (txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		}

		const showResult = (
			/* HOTEL SEARCH TWO COLUMNS, First Column */
			< div className="hotel-search-columns hotel-search-item-row">

				<div className="col-lg-4 hotel-demo-dummy-column ">
					<div id="map"></div>
				</div>

				{/* HOTEL SEARCH TWO COLUMNS, Second Column */}
				<div className="col-lg-8 hotel-search-first-column-dummy table-responsive">
					<div className="hotel-search-table-container">

						<table className="table hotel-search-table">
							<tbody>
								{this.state.hotels.results.map((eachHotelResult, index) => {
									/* Each Hotel Result */
									console.log("eachResult!!!")
									console.log(eachHotelResult)
									let imageURLS = eachHotelResult.images;
									let imageArray = imageURLS.split(",");
									console.log(imageArray[0]);

									return (
										<tr className="hotel-search-row shadow-sm p-3 mb-5 bg-white rounded">
											<td>
												<div>
												<img className="hotel-search-row-image" src={imageArray[0]} alt="logo" />
												</div>
											</td>

											<td>
												<div>

													<div className="hotel-search-item-row hotel-search-item-header">
														<div className="col-lg-1 hotel-search-item-number">{index + 1}</div>
														<div className="">.</div>
														{/* Hotel Name */}
														<a href='' onClick={this.roomSearch(eachHotelResult)} value={eachHotelResult} className="col-lg-10 hotel-search-item-name">{eachHotelResult.name}</a>
													</div>

													<div className="hotel-search-item-row hotel-search-item-rating">
														<span className="fa fa-star hotel-search-item-rating-checked"></span>
														<span className="fa fa-star hotel-search-item-rating-checked"></span>
														<span className="fa fa-star hotel-search-item-rating-checked"></span>
														<span className="fa fa-star hotel-search-item-rating-checked"></span>
														<span className="fa fa-star"></span>
													</div>
													{/* Hotel Address */}
													<div className="hotel-search-item-row">{eachHotelResult.address}</div>
													<div className="hotel-search-item-row">{eachHotelResult.city}</div>
													<div className="hotel-search-item-row">{eachHotelResult.phone_number}</div>

												</div>
											</td>

											<td>
												<div>

													<div className="hotel-search-item-row">

														{/* Min Price */}
														<div className="hotel-search-item-min-price">
															{eachHotelResult.min_price}
														</div>

														<div className="hotel-search-item-min-price">
															-
														</div>
														{/* Max Price */}
														<div className="hotel-search-item-min-price">
															{eachHotelResult.max_price}
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
							</tbody>
						</table>
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
<<<<<<< HEAD
<<<<<<< HEAD
			<div className="" style={topSectionStyle}>
			<div className="hotel-search-container"> {showNoResult} </div>
			</div>
=======

=======
>>>>>>> implemented 3 features: autocomplete for address search bar, airbnb style datepicker and google map on search result page
				<div className="hotel-search-container"> {showNoResult} </div>
>>>>>>> room page retrieve data using query url
			);
		}

		else {
<<<<<<< HEAD

<<<<<<< HEAD
		return (
					<div className="" style={topSectionStyle}>

			<div className="hotel-search-container">
			

				{showResult}
			</div>
			</div>
		);
=======
=======
>>>>>>> implemented 3 features: autocomplete for address search bar, airbnb style datepicker and google map on search result page
			return (
				<div className="hotel-search-container">
					{showResult}
				</div>
			);
>>>>>>> room page retrieve data using query url

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

export default withRouter(HotelSearchDemo);

