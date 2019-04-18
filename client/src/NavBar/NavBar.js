import React from 'react';
import { withRouter } from 'react-router-dom'
import Registration from '../Registration/Registration'
import { logoutClearSession, loginPost } from '../Utility/ReigstrationLoginFunction'

// import neccessary components
import {
  Form, FormGroup, Input
} from 'reactstrap'

class NavBar extends React.Component {
  constructor() {
    super();
    this.state = {
      loginfields: {
        email: '',
        password: '',
      },
      emailerror: '',
      loginerror: ''
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
    // console.log('login clicked')
    if (this.validate()) {
      const temp_fields = {
        email: this.state.loginfields.email,
        password: this.state.loginfields.password
      }

      loginPost(temp_fields).then(response => {
        // console.log("loginPost got excuted")
        // console.log(response)
        let temp_loginerror = ''
        let empty_fields = {}
        empty_fields["password"] = ''

        if (response === "S") {
          // console.log("login success")
          empty_fields["email"] = ''
        } else {
          temp_loginerror = "*Please enter valid credentials (email or password)"
          this.setState({ loginerror: temp_loginerror })
          empty_fields["email"] = this.state.loginfields.email
        }

        this.setState({ loginfields: empty_fields, loginerror : temp_loginerror })
        this.props.history.push(`/`)
      })
    }

  }

  Home(event) {
    event.preventDefault()

    this.props.history.push(`/`)
  }

  Logout(event) {
    logoutClearSession()
    event.preventDefault()
    localStorage.removeItem('accesstoken')
    this.props.history.push(`/`)
  }

  UserProfile(event) {
    event.preventDefault()

    this.props.history.push(`/UserProfile`)
  }

  Reservations(event) {
    event.preventDefault()

    this.props.history.push(`/Reservations`)
  }

  validate() {
    let temp_email = this.state.loginfields.email
    let temp_error = ''
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

    const ProfileLink = (<div className="col-auto" onClick={this.UserProfile.bind(this)} >My Profile</div>)
    const ReservationLink = (<div className="col-auto" onClick={this.Reservations.bind(this)} >My Reservations</div>)

    const LoginForm = (
      /*RIGHT SIDE*/

      <div>
        <Form className="form-inline my-2 my-lg-0" onSubmit={this.login}>
          {/*EMAIL*/}
          <div className="col-auto pl-0">
            <div className="input-group">
              {/*Error message for invalid login credentials (email or pw)*/}
              <div className="form-inline my-2 my-lg-0"><div className="text-warning">{this.state.loginerror}</div></div>
              <div className="input-group-prepend">
                <div className="email-icon input-group-text"><i className="far fa-user"></i></div>
              </div>
              <FormGroup>
                <Input type="text" name="email" value={this.state.loginfields.email} onChange={this.updateFields} placeholder="Email" />
              </FormGroup>
            </div>
          </div>

          {/*PASSWORD*/}
          <div className="col-auto pl-0">
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="password-icon input-group-text"><i className="fa fa-lock"></i></div>
              </div>
              <FormGroup>
                <Input type="password" name="password" value={this.state.loginfields.password} onChange={this.updateFields} placeholder="********" />
              </FormGroup>
            </div>
          </div>

          {/*LOGIN BUTTON*/}
          <div className="col-auto pl-0 pr-0">
            {/*Login button disabled until email&pw input are filled*/}
            <button className="btn btn-primary my-2 my-sm-0" type="submit" disabled={!this.state.loginfields.email || !this.state.loginfields.password}>Login</button>
          </div>
        </Form>
        {/*Error message for invalid email*/}
        <div className="form-inline my-2 my-lg-0"><div className="text-warning">{this.state.emailerror}</div></div>
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
      <nav className= { this.props.location.pathname === "/" || this.props.location.pathname === "/HotelSearchh"  ? "sticky-top navbar navbar-home fixed-top" : "sticky-top navbar navbar-pages fixed-top" } >
        {/*<nav className="sticky-top navbar navbar-home navbar-dark bg-light fixed-top">*/}

        {/*LEFT SIDE*/}
        <div className="navbar-left form-inline my-2 my-lg-0" >
          <div className="col-auto pl-0" onClick={this.Home.bind(this)}>
            SPARTAN HOTELS
          </div>
          <div className="col-auto pl-0">
            |
          </div>
          {localStorage.accesstoken ? EmptyForm : <Registration />}
        </div>


        {/*RIGHT SIDE*/}
        <div className="navbar-right form-inline my-2 my-lg-0" >

          {localStorage.accesstoken ? ProfileLink : EmptyForm}
          {localStorage.accesstoken ? ReservationLink : EmptyForm}
          {localStorage.accesstoken ? LogoutForm : LoginForm}

        </div>

      </nav>
    );
  }
}

export default withRouter(NavBar);
