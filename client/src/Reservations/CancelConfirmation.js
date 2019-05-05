import React from 'react';
import {withRouter} from 'react-router-dom'
import {
	Button, Modal, ModalHeader,
	ModalBody, ModalFooter, Table
} from 'reactstrap'

class CancelConfirmation extends React.Component {
	constructor() {
		super();

		this.state={
			modal: false,
		}

		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState({
			...this.state,
			modal: !this.state.modal
		})
	}

	render() {
		return (
			<Modal isOpen={this.state.modal} toggle={this.toggle} centered>
				<ModalHeader toggle={this.toggle}> Cancel Confirmation </ModalHeader>

				<ModalBody>
					<img src="https://www.wiki.sc4devotion.com/images/3/3d/Wiki_warning_amber.png" alt="warning" />
					<p> Once you cancel your booking, it cannot be undone. Are you sure you want to cancel this booking? </p>
				</ModalBody>

				<ModalFooter>
					<Button color="primary" onClick={this.handleSubmit}> Yes </Button>
					<Button color="secondary" onClick={this.toggle}> No </Button>
				</ModalFooter>
			</Modal>
		)
	}
}

export default withRouter(CancelConfirmation);