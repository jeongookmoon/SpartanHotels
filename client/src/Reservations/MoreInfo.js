import React from 'react';
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
		}

		this.toggle = this.toggle.bind(this);
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