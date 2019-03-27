import React from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { HotelSearchFunction } from '../Utility/HotelSearchFunction'




const mapStyles = {
	width: '100%',
	height: '100%'
};

class HotelSearchDemo extends React.Component {

	constructor(props) {
		super(props);
		const { data } = this.props.location;
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

		};

		this.roomSearch = this.roomSearch.bind(this);
	}

	async componentWillMount() {
		let queryCall = '/api/search/hotels' + this.props.location.search
		const hotelSearch = (await axios.get(queryCall)).data;
		this.setState({
			hotels: hotelSearch
		});
		console.log(hotelSearch);
		console.log(this.state.hotels.results.length);
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
		
	        
      		console.log(item);

        console.log("status number(200 success, else fail): ")
          console.log("expected reponse 200  ")
          	//we don't have a query that handles the room
          	let queryString = this.props.location.search
			this.props.history.push({
			  pathname: `/RoomPage`,
			  search:`${queryString}`,
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
    		return str.replace(/\w\S*/g, function(txt){
        	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    		});
		}

		const showResult = (
			/* HOTEL SEARCH TWO COLUMNS, First Column */
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

				{/* HOTEL SEARCH TWO COLUMNS, Second Column */}
				<div className="col-lg-8 hotel-search-first-column-dummy table-responsive">
					<div className="hotel-search-table-container">

						<table className="table hotel-search-table">
							<tbody>
								{this.state.hotels.results.map((eachHotelResult, index) => {
									/* Each Hotel Result */

									let imageURLS = eachHotelResult.images;
									let imageArray = imageURLS.split(",");
									console.log(imageArray[0]);

									return(
										<tr className="hotel-search-row shadow-sm p-3 mb-5 bg-white rounded">
											<td>
												<img className="hotel-search-row-image" src={imageArray[0]} alt="logo" />
											</td>

											<td>
												<div>

													<div className="hotel-search-item-row hotel-search-item-header">
														<div className="col-lg-1 hotel-search-item-number">{index+1}</div>
														<div className="">.</div>
														{/* Hotel Name */}
														<a href="#" className="col-lg-10 hotel-search-item-name">{eachHotelResult.name}</a>
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

			<div className="hotel-search-container"> {showNoResult} </div>
			);
		}

		else{

		return (
			<div className="hotel-search-container">
			

				{showResult}
			</div>
		);

		}
	}

}

export default withRouter(HotelSearchDemo);

