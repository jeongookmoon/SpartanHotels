import React from 'react'
import { withRouter } from 'react-router-dom'

// import neccessary components
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Row, Col
} from 'reactstrap'

import { registerPost } from '../Utility/ReigstrationLoginFunction'

class Registration extends React.Component {
  constructor() {
    super();
    // initial modal state : false
    this.state = {
      modal: false,
      fields: {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        repassword: '',
      },
      errors: {
      },
      password_error: [],
      email_duplicate_error: false
    };

    this.toggle = this.toggle.bind(this);
    this.updateFields = this.updateFields.bind(this);
    this.register = this.register.bind(this);
  }

  updateFields(event) {
    let temp_fields = this.state.fields;
    temp_fields[event.target.name] = event.target.value;
    this.setState({ fields: temp_fields });
  }

  // toggle modal
  toggle() {
    this.setState({
      ...this.state,
      modal: !this.state.modal
      // or this.setState((currentState) => {modal:!currentState.modal})
    });
  }

  // when clicking register
  register = (event) => {
    // console.log('Register clicked')
    event.preventDefault()
    if (this.validate()) {
      const temp_fields = {
        firstname: this.state.fields.firstname,
        lastname: this.state.fields.lastname,
        email: this.state.fields.email,
        password: this.state.fields.password
      }

      registerPost(temp_fields).then(response => {
        // console.log("status number(200 success, else fail): ")
        if (response === 200) {
          // console.log("expected reponse 200 (registraion and login success): ")
          // console.log(response)
          this.setState({email_duplicate_error : false})
          this.props.history.push(`/`)
          //   loginPost(temp_fields).then(loginresponse => {
          //     if(loginresponse === "S") {
          //       console.log("login success")
          //     } else if (loginresponse === "F") {
          //       console.log("login fail")
          //     }
          //     this.props.history.push(`/`)
          // })
        } else if (response === 400) {
          // console.log("expected reponse 400 (email already exists): ")
          // console.log(response)
          this.setState({email_duplicate_error : true})
          this.props.history.push(`/`)
        }
      })
    }
  }

  validate() {
    let temp_fields = this.state.fields;
    let temp_errors = {};
    let temp_password_error = [];
    let formIsValid = true;

    if (temp_fields["firstname"] === '') {
      formIsValid = false;
      temp_errors["firstname"] = "*Please enter first name";
    }

    // allowed "spacing" for character check
    if (temp_fields["firstname"] !== '') {
      if (!temp_fields["firstname"].match(/^[a-z A-Z]*$/)) {
        formIsValid = false;
        temp_errors["firstname"] = "*Please enter English characters only.";
      }
    }

    if (temp_fields["lastname"] === '') {
      formIsValid = false;
      temp_errors["lastname"] = "*Please enter last name";
    }

    if (temp_fields["lastname"] !== '') {
      if (!temp_fields["lastname"].match(/^[a-zA-Z]*$/)) {
        formIsValid = false;
        temp_errors["lastname"] = "*Please enter English characters only.";
      }
    }

    if (temp_fields["email"] === '') {
      formIsValid = false;
      temp_errors["email"] = "*Please enter email";
    }

    if (temp_fields["email"] !== '') {
      //regular expression for email validation
      let checker = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (!checker.test(temp_fields["email"])) {
        formIsValid = false;
        temp_errors["email"] = "*Please enter a valid email";
      }
    }

    if (temp_fields["password"] === '') {
      formIsValid = false;
      temp_errors["password"] = "*Please enter a password";
    }

    if (temp_fields["password"] !== '') {
      let checker = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$");
      if (!checker.test(temp_fields["password"])) {
        formIsValid = false;
        temp_errors["password"] = "*This password does not meet the requirements"
      }

      else{
        if (temp_fields["repassword"] === '') {
          formIsValid = false;
          temp_errors["repassword"] = "*Please re-enter password";
        }
    
        if (temp_fields["repassword"] !== '') {
          if (!temp_fields["repassword"].match(temp_fields["password"])) {
            formIsValid = false;
            temp_errors["repassword"] = "*Passwords must match";
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

    const email_duplicate_error = (
      <div className="text-warning">This email is already registered</div>
    )

    return (
      <div>
        <Button color="primary-outline" onClick={this.toggle}>Register</Button>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Registration</ModalHeader>

          {/*registration form */}
          <ModalBody>
            <Form onSubmit={this.register}>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label>First Name</Label>
                    <Input type="text" name="firstname" value={this.state.fields.firstname} onChange={this.updateFields} placeholder="Albert" required/>
                    <div className="text-warning">{this.state.errors.firstname}</div>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Last Name</Label>
                    <Input type="text" name="lastname" value={this.state.fields.lastname} onChange={this.updateFields} placeholder="Einstein" required />
                    <div className="text-warning">{this.state.errors.lastname}</div>
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label>Email</Label>
                <Input type="email" name="email" value={this.state.fields.email} onChange={this.updateFields} placeholder="guest@spartanhotel.com" required/>
                <div className="text-warning">{this.state.errors.email}</div>
                {this.state.email_duplicate_error? email_duplicate_error : no_error}
              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
               -                <Input type="password" name="password" value={this.state.fields.password} onChange={this.updateFields} placeholder="********" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$" required/>
                <div className="text-warning">{this.state.errors.password}</div>
                {this.state.password_error? password_error : no_error}
              </FormGroup>
              <FormGroup>
                <Label>Re-enter Password</Label>
                <Input type="password" name="repassword" value={this.state.fields.repassword} onChange={this.updateFields} placeholder="********" required />
                <div className="text-warning">{this.state.errors.repassword}</div>
              </FormGroup>
            </Form>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={this.register}>Register</Button>
            <Button color="secondary" onClick={this.toggle}>Close</Button>
          </ModalFooter>

        </Modal>
      </div>
    );
  }
}

export default withRouter(Registration);