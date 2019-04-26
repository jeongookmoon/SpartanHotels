import React from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios';

import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input
} from 'reactstrap'

class ProfileEditPassword extends React.Component {
	constructor() {
		super();

		this.state={
			modal:false,
			fields: {
				oldpass: '',
				newpass: '',
				repass: '',
			},
			errors: {
			},
			password_error: [],
			email_duplicate_error: false,

			passwordCheck: [{req:"≥ 8 characters", valid:false},
      		{req:"At least 1 uppercase letter", valid:false},
		    {req:"At least 1 lowercase letter", valid:false},
		    {req:"At least 1 special character !@#$%^&*",valid:false}]
		};

		this.toggle = this.toggle.bind(this);
		this.updateFields = this.updateFields.bind(this);
		this.oldPasswordChecker = this.oldPasswordChecker.bind(this);
		this.newPasswordChecker = this.newPasswordChecker.bind(this);
	}

	updateFields(event) {
		let temp_fields = this.state.fields;
		temp_fields[event.target.name] = event.target.value;
		this.setState({ fields : temp_fields });
		this.newPasswordChecker()
	}

	oldPasswordChecker() {
		
	}

	newPasswordChecker () {
		let pw = this.state.fields.newpass;
		let tmp_passwordCheck = this.state.newPasswordCheck

			tmp_passwordCheck[0].valid = (pw.length >= 8) ? true : false
    
	    // At least 1 Uppercase letter
	    if( /(?=.*[A-Z])/.test(pw)){
	      tmp_passwordCheck[1].valid = true
	    }
	    else{
	      tmp_passwordCheck[1].valid = false
	    }

	    // At least 1 Lowercase letter
	    if( /(?=.*[a-z])/.test(pw)){
	      tmp_passwordCheck[2].valid = true
	    }
	    else{
	      tmp_passwordCheck[2].valid = false
	    }

	    // At least 1 special character !@#$%^&*
	    if( /(?=.*[!@#$%^&*])/.test(pw)){
	      tmp_passwordCheck[3].valid = true
	    }
	    else{
	      tmp_passwordCheck[3].valid = false
	    }

	    this.setState({ passwordCheck: tmp_passwordCheck});
	}

	validate() {
	    let temp_fields = this.state.fields;
	    let temp_errors = {};
	    let temp_password_error = [];
	    let formIsValid = true;

	    if (temp_fields["newpass"] === '') {
	      formIsValid = false;
	      temp_errors["newpass"] = "*Please enter a password";
	    }

	    if (temp_fields["newpass"] !== '') {
	      let checker = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$");
	      if (!checker.test(temp_fields["password"])) {
	        formIsValid = false;
	        temp_errors["newpass"] = "*This password does not meet the requirements"
	      }

	      else{
	        if (temp_fields["repass"] === '') {
	          formIsValid = false;
	          temp_errors["repass"] = "*Please re-enter password";
	        }
	    
	        if (temp_fields["repass"] !== '') {
	          if (!temp_fields["repass"].match(temp_fields["newpass"])) {
	            formIsValid = false;
	            temp_errors["repass"] = "*Passwords must match";
	          }
	        }
	      }
	    }

	    this.setState({
	      errors: temp_errors,
	      password_error : temp_password_error
	    });
	    return formIsValid;
	}

	// need something to get old password
	componentDidMount() {
	    axios.get('/api/profile')
	        .then(res => 
	          this.setState({
	            name: res.data.name,
	            email: res.data.email,
	        }))  
	}

	toggle() {
		this.setState({
			...this.state,
			modal: !this.state.modal
		})
	}

	render() {

		const password_error = (
      		<div className="text-warning">{this.state.password_error.map((each) => <div>{each}</div>
      	)}</div>
    	)

	    const no_error = (
	      <div className="text-warning"></div>
	    )

		return (
			<div>
	        	<Button size="sm" onClick={this.toggle} color="info">Change Password</Button>

				<Modal isOpen={this.state.modal} toggle={this.toggle} centered>
					<ModalHeader toggle={this.toggle}> Change Your Password </ModalHeader>

					<ModalBody>
						<Form onSubmit={this.handleSubmit}>
							<FormGroup>
								<Label> Old Password: </Label>
								<Input type="text" name="oldpass" placeholder="********" onChange={this.handleUpdate} required />
							</FormGroup>
							<FormGroup>
								<Label> New Password: </Label>
								<Input type="text" name="newpass" placeholder="********" onChange={this.handleUpdate} required />
							</FormGroup>
							<FormGroup>
								<Label> Re-enter New Password: </Label>
								<Input type="text" name="repass" placeholder="********" onChange={this.handleUpdate} required />
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

export default withRouter(ProfileEditPassword);