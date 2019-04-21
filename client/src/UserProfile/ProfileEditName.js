import React from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios';

import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Row, Col,
} from 'reactstrap'

class ProfileEditName extends React.Component {
	constructor() {
		super();

		this.state={
			modal:false,
			fields: {
				name: '',
				email: '',
			}
		}

		this.toggle = this.toggle.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleUpdate(event) {
		const target = event.target;

		this.setState({
			name : target.name
		});
	}

	handleSubmit = (event) => {
		event.preventDefault()
	}
	  
	componentDidMount() {
	    axios.get('/api/profile')
	        .then(res => 
	          this.setState({
	            name: res.data[0].name,
	            email: res.data[0].email,
	        }))  
	}

	toggle() {
		this.setState({
			...this.state,
			modal: !this.state.modal
		})
	}

	render() {
		return (
			<div>
        	<Button size="sm" onClick={this.toggle} color="info">Edit Name</Button>

			<Modal isOpen={this.state.modal} toggle={this.toggle} centered>
				<ModalHeader toggle={this.toggle}> Edit Your Name </ModalHeader>

			<ModalBody>
				<Form onSubmit={this.handleSubmit}>
					<FormGroup>
						<Label> Name: </Label>
						<Input type="text" name="name" placeholder={this.state.name} onChange={this.handleUpdate} required />
					</FormGroup>
				</Form>
			</ModalBody>

			<ModalFooter>
				<Button color="primary" onClick={this.handleSubmit}> Save </Button>
				<Button color="secondary" onClick={this.toggle}> Cancel </Button>
			</ModalFooter>

			</Modal>
			</div>
		)
	}
}

export default withRouter(ProfileEditName);