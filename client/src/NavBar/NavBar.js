import React from 'react';
import { withRouter } from 'react-router-dom'
import Registration from '../Registration/Registration'
import { logoutClearSession, loginPost } from '../Utility/ReigstrationLoginFunction'

// import neccessary components
import {
  Form, FormGroup, Button, Input
} from 'reactstrap'

class NavBar extends React.Component {
  constructor() {
    super();
    this.state = {
      loginfields: {
        email: '',
        password: '',
      },
      emailerror: ''
    }

    this.updateFields = this.updateFields.bind(this)
    this.login = this.login.bind(this)
  }

  updateFields(event) {
    let temp_fields = this.state.loginfields;
    temp_fields[event.target.name] = event.target.value;
    this.setState({ loginfields: temp_fields });
  }

  login = (event) => {
    event.preventDefault()
    console.log('login clicked')
    const temp_fields = {
      email: this.state.loginfields.email,
      password: this.state.loginfields.password
    }
    loginPost(temp_fields).then(response => {
      console.log("loginPost got excuted")
      if(response === "S") {
        console.log("login success")
      } else if (response === "F") {
        console.log("login fail due to input email not found on db")
      } else if (response === "WrongPW") {
        console.log("login fail due to WrongPW")
      } 
      let empty_fields = {}
      empty_fields["email"] = ""
      empty_fields["password"] = ""
      this.setState({ loginfields: empty_fields })
      this.props.history.push(`/`)
    })
  }

  Logout(event) {
    logoutClearSession()
    event.preventDefault()
    localStorage.removeItem('accesstoken')
    this.props.history.push(`/`)
  }

  validate() {
    let temp_email = this.state.loginfields.email
    let temp_error = this.state.emailerror
    let formIsValid = true;

    if (temp_email !== '') {
      //regular expression for email validation
      let checker = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (!checker.test(temp_email)) {
        formIsValid = false;
        temp_error = "*Please enter valid email.";
      }
    }

    this.setState({
      emailerror: temp_error
    });
    return formIsValid;
  }

  render() {
    const EmptyForm = (<div></div>)

    const LoginForm = (
      /*RIGHT SIDE*/
      
      <div>
        <Form className="form-inline my-2 my-lg-0" onSubmit={this.login}>
          {/*EMAIL*/}
          <div className="col-auto pl-0">
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="email-input input-group-text"><i className="far fa-user"></i></div>
              </div>
              <FormGroup>
                <Input type="email" name="email" value={this.state.loginfields.email} onChange={this.updateFields} placeholder="Email" />
                <div className="text-warning">{this.state.emailerror}</div>
              </FormGroup>
            </div>
          </div>

          {/*PASSWORD*/}
          <div className="col-auto pl-0">
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="password-input input-group-text"><i className="fa fa-lock"></i></div>
              </div>
              <FormGroup>
                <Input type="password" name="password" value={this.state.loginfields.password} onChange={this.updateFields} placeholder="********" />
              </FormGroup>
            </div>
          </div>

          {/*LOGIN BUTTON*/}
          <div className="col-auto pl-0 pr-0">
            <button className="btn btn-primary my-2 my-sm-0" type="submit">Login</button>
          </div>
          </Form>
      </div>
    )

    const LogoutForm = (
      <div>
        <form className="form-inline my-2 my-lg-0">
          <div className="col-auto pl-0 pr-0">
            <button className="btn btn-primary my-2 my-sm-0" onClick={this.Logout.bind(this)} type="submit">LOGOUT</button>
          </div>
        </form>
      </div>
    )

    return (
      <nav className="sticky-top navbar navbar-dark bg-light fixed-top">
        {/*<nav className="sticky-top navbar navbar-dark bg-light fixed-top">*/}

        {/*LEFT SIDE*/}
        <div className="navbar-left form-inline my-2 my-lg-0" >
          <div className="col-auto pl-0">
            SPARTAN HOTELS
          </div>
          <div className="col-auto pl-0">
            |
          </div>
          {localStorage.accesstoken ? EmptyForm : <Registration />}
        </div>


        {/*RIGHT SIDE*/}
        {localStorage.accesstoken ? LogoutForm : LoginForm}
      </nav>
    );
  }
}

export default withRouter(NavBar);
