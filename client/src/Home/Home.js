import React from 'react';
import { withRouter } from 'react-router-dom'

import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './CSS/react_dates_overrides.css'; //NEEDED in order to OVERRIDE css styling of _datepicker.css

import { HotelSearchFunction, extractFromAddress } from '../Utility/HotelSearchFunction'
import Autocomplete from "../Utility/Autocomplete";

import homeImage from './Images/homeImage14.jpeg';
import {
	Form, CustomInput, FormGroup
} from 'reactstrap'
import { homeFilterData } from '../Utility/DataForMenu'


var topSectionStyle = {
	width: "100%",
	height: "100vh",
	backgroundRepeat: "no-repeat",
	backgroundSize: "cover",
	backgroundPosition: "center center",
	backgroundImage: `url(${homeImage})`,
};

class Home extends React.Component {

	constructor() {
		super();
		this.state = {
			fullAddress: '',
			streetAddress: '',
			city: '',
			state: '',
			latitude: '',
			longitude: '',
			date_in: null,
			date_out: null,
			adult: 0,
			children: 0,
			focusedInput: null,
			guest_number: 0,
			place: {},
			checkbox: {
			}
		};
	}

	componentDidMount() {
	}

	handleChange = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
	}

	handleCheckBox = (event) => {
		const name = event.target.name
		this.setState(prevState => ({
			checkbox: {
				...prevState.checkbox,
				[name]: !prevState.checkbox[name]
			}
		}))
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

	showPlaceDetails(place) {
		let geoDetail = JSON.stringify(place.geometry.location, null, 2).replace(/['"]+/g, '')
		const latitude = geoDetail.substring(geoDetail.lastIndexOf("lat:") + "lat: ".length, geoDetail.lastIndexOf(","))
		const longitude = geoDetail.substring(geoDetail.lastIndexOf("lng:") + "lng: ".length, geoDetail.lastIndexOf("}")).replace(/\s/g, '')

		const fullAddress = JSON.stringify(place.formatted_address, null, 2).replace(/['"]+/g, '')

		let address = JSON.stringify(place.adr_address, null, 2).replace(/['"]+/g, '')
		address = address.replace(/(\r\n|\n|\r)/gm, "")

		const streetAddress = extractFromAddress(address)
		const city = extractFromAddress(address, 'city')
		const state = extractFromAddress(address, 'state')

		this.setState(
			{
				latitude, longitude,
				fullAddress, streetAddress,
				city, state, place
			},

		)
	}

	search = (event) => {
		event.preventDefault()

		// convert true props of checkbox into array and join the array into a string
		const keys = Object.keys(this.state.checkbox)
		const filteredElements = keys.filter((key) => this.state.checkbox[key] === true)


		const temp_fields = {
			streetAddress: this.state.streetAddress,
			city: this.state.city,
			state: this.state.state,
			latitude: this.state.latitude,
			longitude: this.state.longitude,
			date_in: this.state.date_in.format('YYYY-MM-DD'),
			date_out: this.state.date_out.format('YYYY-MM-DD'),
			adult: this.state.adult,
			children: this.state.children,
			guest_number: this.state.guest_number,
		}

		HotelSearchFunction(temp_fields).then(response => {

			let queryString = `latitude=${temp_fields.latitude}&longitude=${temp_fields.longitude}`+
								`&date_in=${temp_fields.date_in}&date_out=${temp_fields.date_out}`+
								`&adult=${this.state.adult}&children=${this.state.children}`+
								`&guest_number=${this.state.guest_number}&full_address=${this.state.fullAddress}`+
								`&city=${temp_fields.city}&street_address=${temp_fields.streetAddress}`+
								`&state=${temp_fields.state}`+
								`&amenities=${filteredElements}`

			this.props.history.push({
				pathname: `/HotelSearch`,
				search: `?${queryString}`,
			})
		})
	}


	render() {

		const homeHeader = (

				<div className="col-lg-12 home-container col-auto" style={topSectionStyle}>
					<div className="home-form-container col-lg-12">
						<Form className="home-form col-lg-12" onSubmit={this.search}>
							<FormGroup>
								<div className="col-lg-12 custom-row">
									<div className="col-lg-6 top-header ml-lg-5 ">
										<div className="subheading-sm">Welcome</div>
										<div>Spartan Hotels</div>
					  				</div>
				  				</div>

				  				<div className="row mb-5 mr-lg-5 ml-lg-5">
				  				  	<div className="col-md-12 home-inputs-container">

				  				    <div className="block-32">
				  				        <div className="row">
				  				          <div className="col-md-6 mb-3 mb-lg-0 col-lg-4" >
				  				            <label className="input-labels">Location</label>
				  				            <div className="field-icon-wrap">
				  				              <div className="icon"><i className="fa fa-search"></i></div>
				  				            		<Autocomplete onPlaceChanged={this.showPlaceDetails.bind(this)}/>
				  				            </div>
				  				          </div>
				  				          <div className="col-md-6 mb-3 mb-lg-0 col-lg-4">
				  				            <label className="input-labels">Check In &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      Check Out</label>
				  				            <div className="field-icon-wrap check-wrap">
				  				              <div className="icon"><i className="fa fa-calendar"></i></div>
				  				              <DateRangePicker
				  				              	startDatePlaceholderText="mm/dd/yyyy"
				  				              	startDate={this.state.date_in} // momentPropTypes.momentObj or null,
				  				              	startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
				  				              	endDatePlaceholderText="mm/dd/yyyy"
				  				              	endDate={this.state.date_out} // momentPropTypes.momentObj or null,
				  				              	endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
				  				              	onDatesChange={({ startDate, endDate }) => this.setState({ date_in: startDate, date_out: endDate })} // PropTypes.func.isRequired,
				  				              	focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
				  				              	onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
				  				              />
				  				            </div>
				  				          </div>
				  				          <div className="col-md-6 mb-3 mb-md-0 col-lg-2">
				  				            <div className="row">
				  				                <label className="input-labels">Guests</label>
				  				                  	<div className="icon"><span className="ion-ios-arrow-down"></span></div>
				  				                  	<div className={this.state.guest_number === 0 ? "home-guest-dropdown col-lg-12 menu-box menu-item" : "home-guest-dropdown-filled col-lg-12 menu-box menu-item" }> {this.state.guest_number === 0 ? null : this.state.guest_number}&nbsp;guests
															<ul className="home-guest-dropdown-list-style">
																<li>
																	<div className="form-inline home-adults-container">
																		<div className="home-adults">
																			Adults
												                		</div>

																		<div className="home-increments">
																			<i className="fa fa-minus home-guest-icon-increment" type="button" value="Decrement Value" onClick={this.adultDecrement}></i>
																			<input readOnly className="home-guest-input" name="adult" type="text" id="adult" value={this.state.adult} onChange={this.handleChange} />
																			<i className="fa fa-plus home-guest-icon-decrement" type="button" value="Increment Value" onClick={this.adultIncrement} />
																		</div>
																	</div>

																	<div className="form-inline home-children-container">
																		<div className="home-children">
																			Children
												                		</div>

																		<div className="home-increments">
																			<i className="fa fa-minus home-guest-icon-increment" type="button" value="Decrement Value" onClick={this.childrenDecrement}></i>
																			<input readOnly className="home-guest-input" name="children" type="text" id="children" value={this.state.children} onChange={this.handleChange} />
																			<i className="fa fa-plus home-guest-icon-decrement" type="button" value="Increment Value" onClick={this.childrenIncrement} />
																		</div>
																	</div>
																</li>
															</ul>
														</div>
				  				            </div>
				  				          </div>
				  				          <div className="col-md-6 mb-3 mb-md-0 col-lg-2 ">
				  				          		  				                <label htmlFor="checkin">&nbsp;</label>

				  				          	<div className="">
				  				            <button disabled={!this.state.city || !this.state.date_in || !this.state.date_out || this.state.guest_number === 0} className="home-submit-button btn btn-primary py-3 px-4" type="submit">Search</button>
				  				            </div>

				  				          </div>
				  				        </div>
				  				    </div>
				  				    <div className="col-lg-12">
										<div className="form-checkboxes row home-checkboxes text-center">
											{homeFilterData.map((each, key) => {
												return <CustomInput className="col-lg-3 input-labels" type="checkbox" key={key} id={key + 123} name={each.name} label={each.label} value={each.value} onChange={this.handleCheckBox} />
											})}
										</div>
									</div>
				  				  </div>
				  				</div>
			  				</FormGroup>
						</Form>
					</div>
				</div >
		);

{/*

		const homeFeaturedHotels = (

			<div className="home-featured-hotels">
			a
			</div>

		);

		const homeLast = (
			<div className="">
			a
			</div>
		);
	*/}	

		return (
			<div>
				{homeHeader}

			</div>
		);
	}
}

export default withRouter(Home);
