import React from 'react';

import axios from 'axios';

import {withRouter} from 'react-router-dom'

import {
	Button, Modal, ModalHeader,
	ModalBody, Table
} from 'reactstrap'

class MoreInfo extends React.Component {
	constructor(props) {
		super(props);

		this.state={
			modal: false,
			id: props.id,
			room_history: []
		}

		this.toggle = this.toggle.bind(this);
	}

// Getting the info from the query and formatting it correctly
// Not entirely sure to recognize which button is getting pressed though
componentDidMount() {
      var that = this
      axios.get('/api/reservations/viewres')
      .then(function(viewres) {
      	var room_info = []
      	// Group elements of viewres.data into reservations array. reservations is an array that contains multiple arrays that all hold
      	// reservations of the same transaction_id. One array per one transaction. Dunno whether or not you have to do it like this.
      	for (var i = 0; i < viewres.data.length; i++) {
      		var booking_id = viewres.data[i].transaction_id
      		var room_num = viewres.data[i].room_number
      		var bed_type = viewres.data[i].bed_type
      		var room_price = viewres.data[i].price

      		room_info[i] = {booking_id, room_num, bed_type, room_price}
      		}

      	that.setState({
            room_history: room_info
          })
      })
  }

	toggle () {
		this.setState({
			...this.state,
			modal: !this.state.modal
		})
	}


// Kind of like how it is in RewardHistory. Map object to indices and put this in the body of render()
// Data that gets rendered should depend on which toggle you press. Not sure how to identify that.
  	renderRoomsTableData() {
		return this.state.room_history.map((rooms, index) => {
			const {booking_id, room_num, bed_type, room_price} = rooms
				if (this.state.id*1 === booking_id*1) {
					return (
				<tr key={index+1233}>
					<td>{room_num}</td>
					<td>{bed_type}</td>
					<td>${room_price}</td>
				</tr>
					)
				} else {
					return (
						<div></div>
					)
				}
		})
	}

// Currently the toggle renders the same data. Not entirely sure how to get it to render different data depending on which toggle you press
	render() {
		return (
			<div>
				<Button color="lightgray" onClick={this.toggle}> 
					<img className="reservations-image" src="https://cdn1.iconfinder.com/data/icons/education-set-4/512/information-512.png" alt="details" />
				</Button>
				<Modal isOpen={this.state.modal} toggle={this.toggle} centered>
					<ModalHeader toggle={this.toggle}> Room Information </ModalHeader>

					<ModalBody>
						<Table className="reservations-detail-table-text"> 
							<thead>
								<tr>
									<th> Room </th>
									<th> Bed </th>
									<th> Price </th>
								</tr>
							</thead>
							<tbody>
								{this.renderRoomsTableData()}
							</tbody>
						</Table>
					</ModalBody>

				</Modal>
			</div>
		)
	}
}

export default withRouter(MoreInfo);