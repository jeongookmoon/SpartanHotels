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

		this.state = {
			hotels: [{}],
			searchClickedToggle: false,
			sortBySelectedToggle: false,
			searchParams: {
				city,
				latitude,
				longitude,
				state: '',
				date_in: moment(dateIn, ('YYYY-MM-DD')),
				date_out: moment(dateOut, ('YYYY-MM-DD')),
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
		};

		this.roomSearch = this.roomSearch.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.getHotelSearchResult = this.getHotelSearchResult.bind(this)
		this.adultIncrement = this.adultIncrement.bind(this)
		this.adultDecrement = this.adultDecrement.bind(this)
		this.childrenIncrement = this.childrenIncrement.bind(this)
		this.childrenDecrement = this.childrenDecrement.bind(this)
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

		let googleMap = new window.google.maps.Map(document.getElementById('map'), {
			center: { lat: latitude, lng: longitude },
			zoom: 14
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

			let imageURL = ''
			if (eachHotel.images && eachHotel.images.constructor === Array) {
				imageURL = eachHotel.images.split(",")[0]
			} else {
				imageURL = eachHotel.images
			}

			let hotelInfo = `<img src=${imageURL} style="width: 50%; height: 50%"/>
											 <h6 style="text-align:center;">${eachHotel.name}</h6>
											 <p>${eachHotel.address}</p>
											 <p>$${eachHotel.min_price} ~ ${eachHotel.max_price}/per night</p>`

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

		let searchParams = Object.assign({}, this.state.searchParams)
		searchParams.date_in = searchParams.date_in.format('YYYY-MM-DD')
		searchParams.date_out = searchParams.date_out.format('YYYY-MM-DD')

		HotelSearchFunction(searchParams).then(() => {
			const queryString = `latitude=${searchParams.latitude}&longitude=${searchParams.longitude}
								&date_in=${searchParams.date_in}&date_out=${searchParams.date_out}
								&adult=${this.state.adult}&children=${this.state.children}
								&guest_number=${this.state.guest_number}&full_address=${this.state.fullAddress}
								&street_address=${this.state.streetAddress}&city=${searchParams.city}
								${additionalClause}`

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

		const queryString = `?date_in=${date_in}&date_out=${date_out}
			&guest_number=${guest_number}&hotel_id=${item.hotel_id}
			&city=${city}`

		this.props.history.push({
			pathname: `/RoomPage`,
			search: `${queryString}`,
		})
	}

	generatePageNumbers() {
		let pageNumbers = []
		const params = new URLSearchParams(this.props.location.search)
		let pageNumber = parseInt(params.get('pageNumber'))
		if(!pageNumber) {
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

	render() {
		if (this.state.hotels.results === undefined) {
			return <div> Loading...</div>
		}

		const searchBar = (
			<div>
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
						<button onClick={this.getHotelSearchResult} className="p-2 submit-button btn btn-danger my-2 my-sm-0" type="submit">Search</button>
					</div>
				</FormGroup>
				<hr className="hotel-search-hr-bottom"></hr>
			</div>
		)

		const pagination = (
			<div className="hotel-search-pagination">
				<Pagination aria-label="Page navigation example">
					{this.generatePageNumbers()}
				</Pagination>
			</div>
		)

		const sortByDropdown = (
			<select name="sortBy" onChange={this.getHotelSearchResult} value={this.state.sortBy}>
				<option value="" disabled hidden >Sort By</option>
				<option value="price_asc" label="Prce(Low to High)"></option>
				<option value="price_des" label="Prce(High to Low)"></option>
				<option value="name_asc" label="Name(A to Z)"></option>
				<option value="name_des" label="Name(Z to A)"></option>
			</select>
		)

		const ResultTable = (
			<div className="col-lg-6 hotel-search-first-column">

				<div className="hotel-search-sort-container row">
					<div className="col-lg-1">
						{sortByDropdown}
					</div>
				</div>

				<div className="hotel-search-table-container">
					<Table hover borderless>
						<tbody>
							{this.state.hotels.results.map((eachHotelResult, index) => {

								let imageURL = ''
								if (eachHotelResult.images && eachHotelResult.images.constructor === Array) {
									imageURL = eachHotelResult.images.split(",")[0]
								} else {
									imageURL = eachHotelResult.images
								}

								return (

									<tr key={index} className="hotel-search-row shadow-sm p-3 mb-5" tag="a" onClick={this.roomSearch(eachHotelResult)} style={{ cursor: "pointer" }}>
										<td className="col-lg-6">
											<img className="hotel-search-item-image" src={imageURL} alt="logo" />
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
														${eachHotelResult.min_price} &nbsp;-&nbsp; ${eachHotelResult.max_price}
													</div>
												</div>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
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
