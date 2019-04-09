import React from 'react';
import { withRouter } from 'react-router-dom'
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './CSS/react_dates_overrides.css'; //NEEDED in order to OVERRIDE css styling of _datepicker.css
import Autocomplete from "./Autocomplete";
import homeImage from './Images/homeImage7.jpg';
import {
	Form, FormGroup
} from 'reactstrap'
import { HotelSearchFunction } from '../Utility/HotelSearchFunction'

var topSectionStyle = {
	width: "100%",
	backgroundRepeat: "no-repeat",
	backgroundSize: "cover",
	backgroundPosition: "center center",
	backgroundImage: `url(${homeImage})`,
};

class Home extends React.Component {

	constructor() {
		super();
		this.state = {
			city: '',
			date_in: null,
			date_out: null,
			adult: 0,
			children: 0,
			focusedInput: null,
			guest_number: 0,
			place: {}
		};
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

	childrenIncrement(){
		console.log("yay");
	    var value = parseInt(document.getElementById('children').value, 10);
	    
	    value++;
	    console.log(value);

	    document.getElementById('children').value = value;
	    var guest_number = parseInt(document.getElementById('adult').value, 10) + parseInt(document.getElementById('children').value, 10)


	    this.setState({
	    	children:value,
	    	guest_number:guest_number

	    })

	}

	childrenDecrement(){
		console.log("yay");
	    var value = parseInt(document.getElementById('children').value, 10);
	    
	    if (value != 0){
	    value--;
		}
	    console.log(value);


	    document.getElementById('children').value = value;
	    var guest_number = parseInt(document.getElementById('adult').value, 10) + parseInt(document.getElementById('children').value, 10)


	    this.setState({
	    	children:value,
	    	guest_number:guest_number
	    })

	}


	search = (event) => {
		// console.log('Search clicked')
		event.preventDefault()
		const temp_fields = {
			city: this.state.city,
			date_in: this.state.date_in.format('YYYY-MM-DD'),
			date_out: this.state.date_out.format('YYYY-MM-DD'),
			adult: this.state.adult,
			children: this.state.children,
			guest_number: this.state.guest_number,
		}

		HotelSearchFunction(temp_fields).then(response => {
			// console.log("status number(200 success, else fail): ")
			// // if(response === 200) {
			// console.log("expected reponse 200  ")
			// console.log(response)
			//this.props.history.push(`/HotelSearchDemo`)
			let queryString = `city=${temp_fields.city}&date_in=${temp_fields.date_in}&date_out=${temp_fields.date_out}&adult=${this.state.adult}&children=${this.state.children}&guest_number=${this.state.guest_number}`
			this.props.history.push({
				pathname: `/HotelSearch`,
				search: `?${queryString}`,

			})
		})
	}

	render() {




		return (

			<div className="col-lg-12 home-container col-auto" style={topSectionStyle}>

				<div className="home-form-container col-lg-12">

					<Form className="home-form col-lg-12" onSubmit={this.search}>
						<div className="top-header ">
							Plan your next trip
		  		</div>

						<FormGroup className="form-inline home-form-inputs">

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
									<div className={this.state.guest_number === 0  ? "home-guest-dropdown" : "home-guest-dropdown-filled" }>{this.state.guest_number === 0 ? null : this.state.guest_number}&nbsp;Guests</div>
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
								<button disabled={!this.state.city || !this.state.date_in || !this.state.date_out} className="p-2 submit-button btn btn-danger my-2 my-sm-0" type="submit">Search</button>
							</div>


						</FormGroup>



					</Form>

				</div>
			</div>
		);
	}
}

export default withRouter(Home);
