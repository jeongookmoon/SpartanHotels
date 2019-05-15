import React from 'react';
import {withRouter} from 'react-router-dom'

import "./UserProfile.css";

import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input
} from 'reactstrap'

import { changePass } from '../Utility/ReigstrationLoginFunction'

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
			old_pass_error: false,

			newPasswordCheck: [{req:"≥ 8 characters", valid:false},
      		{req:"At least 1 uppercase letter", valid:false},
		    {req:"At least 1 lowercase letter", valid:false},
		    {req:"At least 1 special character !@#$%^&*",valid:false}]
		};

		this.toggle = this.toggle.bind(this);
		this.updateFields = this.updateFields.bind(this);
		this.handleSubmit= this.handleSubmit.bind(this);
		this.newPasswordChecker = this.newPasswordChecker.bind(this);
	}

	updateFields(event) {
		let temp_fields = this.state.fields;
		temp_fields[event.target.name] = event.target.value;
		this.setState({ fields : temp_fields });
		//this.oldPasswordChecker()
		this.newPasswordChecker()
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

	    this.setState({ newPasswordCheck: tmp_passwordCheck});
	}

	toggle() {
		this.setState({
			...this.state,
			modal: !this.state.modal
		});
	}


	handleSubmit = (event) => {
	    // console.log('Register clicked')
	    event.preventDefault()

	    if (this.validate()) {
	      	const temp_fields = {
	      	oldpass: this.state.fields.oldpass,
	        newpass: this.state.fields.newpass
	      }
	      changePass(temp_fields).then(response => {
	      	// console.log(response)
	        if (response === 200) {
	          this.setState({old_pass_error : false}, () => this.pushtoCurrentURL())
	          alert("Your password has been updated!")
	          window.location.reload();
	        } else if (response === 400) {
	          this.setState({old_pass_error : true}, () => this.pushtoCurrentURL())
	        }
	      })
	    }
  	}
  	pushtoCurrentURL() {
	    const currentURL = this.props.location.pathname + this.props.location.search
	    this.props.history.push(currentURL)
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

	    if (temp_fields["oldpass"] === '') {
	    	formIsValid = false;
	    	temp_errors["oldpass"] = "*Please enter the old password";
	    }

	    if (temp_fields["newpass"] !== '') {
	      let checker = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$");
	      if (!checker.test(temp_fields["newpass"])) {
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

	render() {

		const password_error = (
      		<div className="text-warning">{this.state.password_error.map((each) => <div>{each}</div>
      		)}</div>
    	)

	    const no_error = (
	      <div className="text-warning"></div>
	    )

	    const old_pass_error = (
	      <div className="text-warning">Old Password does not match</div>
	    )

	    this.state.newPasswordCheck.map(ele=>{
	      return <div key={ele.req} className= { ele.valid ? "valid-req" : "invalid-req" }>{ele.req}</div>
	    }) 

		return (
			<div>
	        	<Button size="sm" color="info" onClick={this.toggle} className="profile-button">Change Password</Button>

				<Modal isOpen={this.state.modal} toggle={this.toggle} centered>
					<ModalHeader toggle={this.toggle}> Change Your Password </ModalHeader>

					<ModalBody>
						<Form onSubmit={this.handleSubmit}>
							<FormGroup>
								<Label> Old Password: </Label>
								<Input type="password" name="oldpass" placeholder="********" value={this.state.fields.oldpass} onChange={this.updateFields} required />
								<div className="text-warning">{this.state.errors.oldpass}</div>
                				{this.state.old_pass_error? old_pass_error : no_error}
							</FormGroup>
							<FormGroup>
								<Label> New Password: </Label>
								<Input type="password" name="newpass" placeholder="********" value={this.state.fields.newpass} onChange={this.updateFields} required />
								<div className="text-warning">{this.state.errors.newpass}</div>
								{this.state.password_error? password_error : no_error}

							</FormGroup>
							<FormGroup>
								<Label> Re-enter New Password: </Label>
								<Input type="password" name="repass" placeholder="********" value={this.state.fields.repass} onChange={this.updateFields} required />
								<div className="text-warning">{this.state.errors.repass}</div>
							</FormGroup>
						</Form>
					</ModalBody>

					<ModalFooter>
						<Button color="primary" onClick={this.handleSubmit}> Save </Button>
						<Button color="secondary" onClick={this.toggle}> Cancel </Button>
					</ModalFooter>

				</Modal>
			</div>
		);

	}
}

export default withRouter(ProfileEditPassword);