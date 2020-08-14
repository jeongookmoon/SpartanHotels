import React from 'react';
import { withRouter } from 'react-router-dom'
import axios from 'axios'

import { HotelSearchFunction, extractFromAddress } from '../Utility/HotelSearchFunction'
import Autocomplete from "../Utility/Autocomplete"

import {
	FormGroup, Table, Pagination, PaginationLink, PaginationItem
} from 'reactstrap'

import './CSS/map_autocomplete_overrides.css'
import './CSS/react_dates_overrides.css' //NEEDED in order to OVERRIDE css styling of _datepicker.css
import 'react-dates/initialize'
import { DateRangePicker } from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'
import moment from 'moment'

import { sortByDropDownData } from '../Utility/DataForMenu'
import AmenityFilterDropdown from './Components/AmenityFilterDropdown'
import { defaultMarkerImageBaseURL, selectedMarkerImageBaseURL } from './mapMarker'

class HotelSearch extends React.Component {

	constructor(props) {
		super(props);

		const params = new URLSearchParams(this.props.location.search)
		const city = params.get('city')
		const dateIn = params.get('date_in')
		const dateOut = params.get('date_out')
		const longitude = params.get('longitude')
		const latitude = params.get('latitude')
		const adult = params.get('adult')
		const children = params.get('children')
		const guest_number = params.get('guest_number')
		const sortBy = params.get('sortBy')
		const state = params.get('state')
		let amenities = ''
		let selectedOption = []
		if (params.get("amenities") && params.get("amenities") !== '') {
			amenities = params.get("amenities")
			const ifarray = amenities.split(",")
			if (ifarray.constructor === Array) {
				ifarray.forEach((amenity) => {
					const amenityobj = {}
					amenityobj.value = amenity
					amenityobj.label = amenity
					selectedOption.push(amenityobj)
				})
			}
		}

		this.state = {
			hotels: [{}],
			searchClickedToggle: false,
			sortBySelectedToggle: false,
			searchParams: {
				city,
				latitude,
				longitude,
				state,
				date_in: moment(dateIn, ('YYYY-MM-DD')),
				date_out: moment(dateOut, ('YYYY-MM-DD')),
				amenities
			},
			sortBy,
			hotel_id: 0,
			fullAddress: '',
			streetAddress: '',
			adult,
			children,
			guest_number,
			focusedInput: null,
			place: {},
			selectedOption
		};
	}

	convertSelectedOption = () => {
		let amenities = ''

		this.state.selectedOption.forEach((option, index) => {
			amenities += option.label
			if (index !== this.state.selectedOption.length - 1)
				amenities += ','
		});

		this.setState(prevState => ({
			searchParams: {
				...prevState.searchParams,
				amenities
			}
		}));
	}

	handleFilterDropdown = (selectedOption) => {
		this.setState({ selectedOption },
			() => this.convertSelectedOption())
	}

	async componentDidMount() {
		(await this.fetchSearchResult())
	}

	componentDidUpdate(prevProps) {
		if (prevProps.location.search !== this.props.location.search) {
			this.fetchSearchResult()
		}
	}

	showPlaceDetails(place) {
		let geoDetail = JSON.stringify(place.geometry.location, null, 2).replace(/['"]+/g, '')
		const latitude = geoDetail.substring(geoDetail.lastIndexOf("lat:") + "lat: ".length, geoDetail.lastIndexOf(","))
		const longitude = geoDetail.substring(geoDetail.lastIndexOf("lng:") + "lng: ".length, geoDetail.lastIndexOf("}"))

		const fullAddress = JSON.stringify(place.formatted_address, null, 2).replace(/['"]+/g, '')

		let address = JSON.stringify(place.adr_address, null, 2).replace(/['"]+/g, '')
		address = address.replace(/(\r\n|\n|\r)/gm, "")

		const streetAddress = extractFromAddress(address)
		const city = extractFromAddress(address, 'city')
		const state = extractFromAddress(address, 'state')

		this.setState(prevState => ({
			searchParams: {
				...prevState.searchParams,
				city,
				state,
				latitude,
				longitude
			},
			fullAddress,
			streetAddress,
			place
		}))
	}

	fetchSearchResult() {
		const queryCall = '/api/search/hotels' + this.props.location.search

		const params = new URLSearchParams(this.props.location.search)
		const sortBy = params.get("sortBy")
		if (!sortBy) {
			this.setState({ sortBy: '' })
		}

		axios.get(queryCall).then(result => {
			this.setState({
				hotels: result.data
			})
		})
			.then(() => {
				this.loadGoogleMap()
			})
	}

	loadGoogleMap() {
		const params = new URLSearchParams(this.props.location.search);
		const latitude = parseFloat(params.get('latitude'))
		const longitude = parseFloat(params.get('longitude'))

		const googleMap = new window.google.maps.Map(document.getElementById('map'), {
			center: { lat: latitude, lng: longitude },
			zoom: 14
		});

		// bounding box for map
		var bounds = new window.google.maps.LatLngBounds()
		//bounds.extend(new window.google.maps.LatLng(latitude, longitude))

		window.googleMap = googleMap
		// display each hotel's information window when clicking the marker	
		const infoWindow = new window.google.maps.InfoWindow()
		window.infoWindow = infoWindow
		window.markers = []
		this.state.hotels.results.forEach((eachHotel, index) => {
			const imageURL = this.getHotelSearchResultImages(eachHotel.images)
			//const imageURL = this.getHotelSearchResultImages(eachHotel.images).split(",")[0]
			//^^ FOR DAVID
			const hotelInfo = `

									<img src=${imageURL} style="max-width: 100%; max-height: 100%; padding-bottom: 10px"/>
									<a href="" style="padding-top:1vh; text-align:center;"><h5>${eachHotel.name}</h5></a>
									<div style="font-weight: 425;"> ${eachHotel.address}</div>
									<div style="font-weight: 425; padding-bottom: 8px;">${eachHotel.city}, ${eachHotel.state}</div>
									<p style="text-align: center"> <img src="http://www.stickpng.com/assets/images/5a4525cd546ddca7e1fcbc84.png" alt="phone"style="width: 12px; height: 12px" /> &nbsp;${eachHotel.phone_number}</p>
									<p style="font-size: 1.2em; font-weight:500"> <img src="https://static.thenounproject.com/png/18095-200.png" alt="price" style="width: 25px; height: 25px" /> ${eachHotel.min_price.toFixed(2)} ~ ${eachHotel.max_price.toFixed(2)}</p>



								`


			var defaultMarkerImage = defaultMarkerImageBaseURL + "" + (index + 1);
			var selectedMarkerImage = selectedMarkerImageBaseURL + "" + (index + 1);

			// display each hotel's marker along with index number
			const googleMapMarker = new window.google.maps.Marker({
				position: { lat: parseFloat(eachHotel.latitude), lng: parseFloat(eachHotel.longitude) },
				map: window.googleMap,
				title: eachHotel.name,
				icon: defaultMarkerImage
			})

			// https://stackoverflow.com/questions/15719951/auto-center-map-with-multiple-markers-in-google-maps-api-v3
			// https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds.extend
			// https://stackoverflow.com/questions/2437683/google-maps-api-v3-can-i-setzoom-after-fitbounds


			// add marker position to boundingbox
			bounds.extend(new window.google.maps.LatLng(eachHotel.latitude, eachHotel.longitude))
			window.googleMap.fitBounds(bounds)
			window.google.maps.event.addListenerOnce(googleMap, "idle", () => {
				if (googleMap.getZoom() > 16) googleMap.setZoom(16);
				window.markers.push(googleMapMarker)
			})

			// action listener to open information window when clicking marker
			googleMapMarker.addListener('click', () => {
				var center = new window.google.maps.LatLng(eachHotel.latitude, eachHotel.longitude);
				window.googleMap.panTo(center);
				window.markers.forEach((eachMarker, index) => {
					eachMarker.setIcon(defaultMarkerImageBaseURL + (index + 1))
					eachMarker.setAnimation(null)
				})
				// window.markers[index].setAnimation(window.google.maps.Animation.BOUNCE)
				window.markers[index].setIcon(selectedMarkerImage)
				setTimeout(() => { window.markers[index].setAnimation() }, 750);
				window.infoWindow.setContent(hotelInfo)
				window.infoWindow.open(window.googleMap, googleMapMarker);
				window.infoWindow.setOptions({ maxWidth: 250 });
			});
		})
	}

	handleChange = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	adultIncrement = () => {
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

	adultDecrement = () => {
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

	childrenIncrement = () => {
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

	childrenDecrement = () => {
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

	getHotelSearchResult = (event) => {
		event.preventDefault()

		const params = new URLSearchParams(this.props.location.search)
		const sortBy = params.get("sortBy")

		let additionalClause = ''
		if (event.target.name && event.target.name === 'sortBy') {
			additionalClause = `&sortBy=${event.target.value}`
			this.setState({ [event.target.name]: event.target.value })
		}

		if (event.target.name && event.target.name === 'pagination') {
			additionalClause = `&pageNumber=${event.target.value}`
			if (sortBy && sortBy !== '') {
				additionalClause = additionalClause + `&sortBy=${sortBy}`
			}
		}

		if (this.state.searchParams.amenities)
			additionalClause += `&amenities=${this.state.searchParams.amenities}`

		let searchParams = Object.assign({}, this.state.searchParams)
		searchParams.date_in = searchParams.date_in.format('YYYY-MM-DD')
		searchParams.date_out = searchParams.date_out.format('YYYY-MM-DD')

		HotelSearchFunction(searchParams).then(() => {
			const queryString = `latitude=${searchParams.latitude}&longitude=${searchParams.longitude}`+
								`&date_in=${searchParams.date_in}&date_out=${searchParams.date_out}`+
								`&adult=${this.state.adult}&children=${this.state.children}`+
								`&guest_number=${this.state.guest_number}&full_address=${this.state.fullAddress}`+
								`&street_address=${this.state.streetAddress}&city=${searchParams.city}`+
								`&state=${searchParams.state}`+
								`${additionalClause}`

			this.props.history.push({
				pathname: `/HotelSearch`,
				search: `?${queryString}`,
			})
		})
	}

	roomSearch = item => event => {
		const params = new URLSearchParams(this.props.location.search);
		const date_in = params.get('date_in')
		const date_out = params.get('date_out')
		const guest_number = params.get('guest_number')
		const city = params.get('city')

		const queryString = `?date_in=${date_in}&date_out=${date_out}&guest_number=${guest_number}&hotel_id=${item.hotel_id}&city=${city}`

		this.props.history.push({
			pathname: `/RoomPage`,
			search: `${queryString}`,
		})
	}

	generatePageNumbers() {
		let pageNumbers = []
		const params = new URLSearchParams(this.props.location.search)
		let pageNumber = parseInt(params.get('pageNumber'))
		if (!pageNumber) {
			pageNumber = 0;
		}
		let activeFlag = false

		if (this.state.hotels.results && this.state.hotels.results.length > 0) {
			for (let i = 0; i < this.state.hotels.totalResultCount / 10; i++) {
				activeFlag = (pageNumber === i) ? true : false
				pageNumbers.push(
					<PaginationItem active={activeFlag} key={i}>
						<PaginationLink name="pagination" onClick={this.getHotelSearchResult} key={i} value={i}>{i + 1}
						</PaginationLink>
					</PaginationItem>)
			}
		}
		return pageNumbers
	}

	moveMap(lat, lng, index) {
		var center = new window.google.maps.LatLng(lat, lng);
		window.googleMap.panTo(center);
		window.markers.forEach((eachMarker, i) => {
			if (eachMarker) {
				if (i === index) {
					eachMarker.setIcon(selectedMarkerImageBaseURL + (index + 1))
					eachMarker.setZIndex(12)
					eachMarker.setAnimation(window.google.maps.Animation.BOUNCE)
				} else {
					eachMarker.setIcon(defaultMarkerImageBaseURL + (i + 1))
					eachMarker.setZIndex(0)
					eachMarker.setAnimation(null)
				}

			}
		})
	}

	getHotelSearchResultImages(images) {
		let arraychecker = []
		if (images && images.constructor === Array) {
			arraychecker = images.split(",")
			return arraychecker[0]
		}
		return images
	}

	render() {
		if (this.state.hotels.results === undefined) {
			return <div> Loading...</div>
		}

		const searchBar = (
			<div>
				<hr className="hotel-search-hr-bottom">
				</hr>
				<FormGroup className="form-inline hotel-search-inputs">
					<div className="col-lg-3 input-group room-page-location">
						<div className="input-group-append">
							<div className="location-input-icon input-group-text"><i className="fa fa-search"></i></div>
						</div>
						<Autocomplete onPlaceChanged={this.showPlaceDetails.bind(this)} />
					</div>

					<div className="col-lg-4 field-icon-wrap input-group room-page-search-date custom-row">
						<div className="input-group-append">
							<div className="check-in-icon input-group-text"><i className="fa fa-calendar"></i></div>
						</div>
						<div className="room-page-date-check-wrap">
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
					</div>

					<div className=" col-lg-2 input-group menu-container room-page-guest-container">
						<div className="col-lg-12 hotel-search-menu-item">
							<div className="hotelsearch-dropdown">{this.state.guest_number}&nbsp;Guests</div>
							<ul className="hotelsearch-dropdown-list-style">
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
					<div className="col-lg-2 home-submit-button-container">
						<AmenityFilterDropdown value={this.state.selectedOption} handleFilterDropdown={this.handleFilterDropdown} />
					</div>
					<div className="col-lg-1 home-submit-button-container">
						<button onClick={this.getHotelSearchResult} className="p-2 submit-button btn btn-danger my-2 my-sm-0" type="submit">Search</button>
					</div>
				</FormGroup>
				<hr className="hotel-search-hr-bottom"></hr>
			</div>
		)

		const pagination = (
			<div className="hotel-search-pagination">
				<Pagination>
					{this.generatePageNumbers()}
				</Pagination>
			</div>
		)

		const sortByDropdown = (
			<select name="sortBy" onChange={this.getHotelSearchResult} value={this.state.sortBy}>
				<option value="" disabled hidden >Sort By</option>
				{sortByDropDownData.map((each, key) => {
					return <option key={key} value={each.value} label={each.label}></option>
				})}
			</select>
		)

		const HotelTable = (
			<Table hover borderless>
				<tbody>
					{this.state.hotels.results.map((eachHotelResult, index) => {
						const imageURL = this.getHotelSearchResultImages(eachHotelResult.images)

						return (
							<tr key={index} className="hotel-search-row shadow-sm p-3 mb-5" tag="a" onClick={this.roomSearch(eachHotelResult)} onMouseEnter={() => this.moveMap(eachHotelResult.latitude, eachHotelResult.longitude, index)} style={{ cursor: "pointer" }}>
								<td className="">
									<img className="hotel-search-item-image" src={imageURL} alt="logo" />
								</td>
								<td className="">
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
										<div className="hotel-search-item-row hotel-search-item-address" style={{ color: '#3b73d3' }}>{eachHotelResult.amenities}</div>

									</div>
								</td>
								<td className="">
									<div>
										<div className="hotel-search-item-row">

											{/* Min Price */}
											<div className="hotel-search-item-price">
												${eachHotelResult.min_price.toFixed(2)} &nbsp;-&nbsp; ${eachHotelResult.max_price.toFixed(2)}
											</div>
										</div>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		)
		const ResultTable = (
			<div className="col-lg-6 hotel-search-first-column">

				<div className="hotel-search-sort-container row">
					<div className="col-lg-1">
						{sortByDropdown}
					</div>
				</div>

				<div className="hotel-search-table-container">
					{HotelTable}
				</div>
				{this.state.hotels.results.length > 0 ? pagination : ''}
			</div>
		)

		const NoResultTable = (
			<div className="col-lg-6 hotel-search-first-column">No Result</div>
		)

		const hotelSearchResult = (
			<div>

				{/* Top, SearchBar */}
				{searchBar}

				{/* Two Columns */}
				<div className="hotel-search-columns-container col-lg-12 row">

					{/* Left Column, Map */}
					<div className="hotel-search-map-column col-lg-6">
						<div id="map"></div>
					</div>

					{/* Right Column, Result Table */}
					{(this.state.hotels.results.length > 0) ? ResultTable : NoResultTable}

				</div >
			</div >
		)

		return (
			<div>
				<div className="hotel-search-container">
					{hotelSearchResult}
				</div>
			</div>
		);
	}
}

export default withRouter(HotelSearch);
