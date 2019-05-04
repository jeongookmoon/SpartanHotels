import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom'

import {
	Button, Modal, ModalHeader,
	ModalBody, Table
} from 'reactstrap'

class MoreInfo extends React.Component {
	constructor() {
		super();

		this.state={
			modal: false,
			room_history: []
		}

		this.toggle = this.toggle.bind(this);
	}

componentDidMount() {
      var that = this
      axios.get('/api/reservations/viewres')
      .then(function(viewres) {
      	var room_info = []
      	var reservations = []
      	var same_res = []
      	for (var i = 0; i < viewres.data.length; i++) {
      		same_res.push(viewres.data[i])
      		for (var j = i + 1; j < viewres.data.length; j++) {
      			if (viewres.data[j].transaction_id == viewres.data[i].transaction_id) {
      				same_res.push(viewres.data[j])
      			}
      			else {
      				i = j - 1
      				break
      			}
      		}
      		reservations.push(same_res)
      		same_res = []
      	}

      	
      	console.log(reservations)
      	that.setState({
            room_history: room_info
          })
      })
  }

  	renderRoomsTableData() {
		return this.state.history.map((rooms, index) => {
			const {room_num, bed_price, room_price, quantity} = rooms
				
		})
	}
	toggle () {
		this.setState({
			...this.state,
			modal: !this.state.modal
		})
	}

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
									<th> Quantity </th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td> 201 </td>
									<td> King </td>
									<td> $95 </td>
									<td> 1 </td>
								</tr>
								<tr>
									<td> 305 </td>
									<td> Queen </td>
									<td> $60 </td>
									<td> 1 </td>
								</tr>
								<tr>
									<td> 505 </td>
									<td> Suite </td>
									<td> $200 </td>
									<td> 1 </td>
								</tr>
							</tbody>
						</Table>
					</ModalBody>

				</Modal>
			</div>
		)
	}
}

export default withRouter(MoreInfo);