import React from 'react';
import {withRouter} from 'react-router-dom'

import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input
} from 'reactstrap'


import { changeName } from '../Utility/ReigstrationLoginFunction'

class ProfileEditName extends React.Component {
	constructor() {
		super();

		this.state={
			modal:false,
			fields: {

				name: ''
			},
			errors: {
			}
		}

		this.toggle = this.toggle.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleUpdate(event) {
		let temp_fields = this.state.fields;
		temp_fields[event.target.name] = event.target.value;
		this.setState({ fields : temp_fields });
	}

	toggle() {
		this.setState({
			...this.state,
			modal: !this.state.modal
		})
	}	

	handleSubmit = (event) => {
		event.preventDefault()
		if(this.nameChecker()) {
			const temp_fields = {
				name: this.state.fields.name
			}
		
		changeName(temp_fields)
			.then(res => {
				// console.log(res.data)
			})
		window.location.reload();
		}
	}


	nameChecker() {
		let temp_fields = this.state.fields;
	    let temp_errors = {};
	    let formIsValid = true;

	    if (temp_fields["name"] === '') {
	      formIsValid = false;
	      temp_errors["name"] = "*Field was empty";
	    }
	    this.setState({
	      errors: temp_errors
	    });
	    return formIsValid;

	}

	render() {
		return (
			<div>
        	<Button size="sm" color="info" onClick={this.toggle} className="profile-button" >Edit Name</Button>

			<Modal isOpen={this.state.modal} toggle={this.toggle} centered>
				<ModalHeader toggle={this.toggle}> Edit Your Name </ModalHeader>

			<ModalBody>
				<Form onSubmit={this.handleSubmit}>
					<FormGroup>
						<Label> Name: </Label>

						<Input type="text" name="name" placeholder={this.state.name} value={this.state.fields.name} onChange={this.handleUpdate} required />
						<div className="text-warning">{this.state.errors.name}</div>
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