import React, { Component } from "react";
import List from '@material-ui/core/List';
import { withRouter } from 'react-router-dom'; 
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import './Recoverage.css';
import HomeImage from './homeImage7.jpg';
import { checkCodePost, changePost } from '../Utility/RecoverageFunction';
import {Card, Container, CardTitle,
      UncontrolledPopover, PopoverHeader, PopoverBody,} 
from 'reactstrap';
// import accessImage from './Images/homeImage7.jpg';

var topSectionStyle = {
  width: "100%",
  height: '100vh',
  marginTop: "0%",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center center",
  backgroundImage: `url(${HomeImage})`
};

class Accesscode extends Component {
    constructor(props) {
        super(props);
        // console.log('this.props', this.props.location.state)
        this.state = {
            fields: {
                code: '',
                password: '',
                repassword: '',
            },
            error: {

            },

            password_error: [],
            repassword_error: [],
            // showNullError: false,
            // code_error: false,
            passwordCheck: [{req:"≥ 8 characters", valid:false},
            {req:"At least 1 uppercase letter", valid:false},
            {req:"At least 1 lowercase letter", valid:false},
            {req:"At least 1 special character !@#$%^&*",valid:false}]
        };
        this.passwordChecker = this.passwordChecker.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
    let temp_fields = this.state.fields;
    temp_fields[event.target.name] = event.target.value;
    this.setState({ fields: temp_fields });

    this.passwordChecker()
     }

    passwordChecker(){
        let pw = this.state.fields.password;
        let tmp_passwordCheck = this.state.passwordCheck
    
        // req:"≥ 8 characters"
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

    checkCode = (e) => {
      e.preventDefault();
      const temp_fields = {
        access_code: this.state.fields.code,
        email: this.props.location.state,
      }
      // console.log('email:',temp_fields.email)
      // console.log('code:', temp_fields.access_code)
      checkCodePost(temp_fields).then(response =>{
        if (response === "S") {
            // const whatever = { ... this.state}
            // console.log('whatever1', whatever)
            // alert("Code is valid, please set your new password!");
            localStorage.removeItem('checkToken')
            window.location.reload();
        }
        else {
            alert("Code is invalid or expired. Please go back to get a new code!");
            window.location.assign("/Recoverage")
        }
      })
    }

    reset = (event) => {
        // alert("Email sent!");
        event.preventDefault();
        if(this.validate()){
        const temp_fields = {
            email: this.props.location.state,
            password: this.state.fields.password,
            repassword: this.state.fields.repassword,
          }
          if(temp_fields.code === '' || temp_fields.password==='' || temp_fields.repassword==='')
          {
            alert("The field code, password, and repassword can't be empty!")
          } else if(temp_fields.repassword !== temp_fields.password)
          {
            alert("The two passwords do not match!")
          }
        // if (this.validate()) {
        //   const temp_fields = {
        //   code: this.state.fields.code,
        //   email: this.state.fields.email,
        //   password: this.state.fields.password,
        //   repassword: this.state.fields.repassword,

        //   }
        //   resetPost(temp_fields).then(response => {
        //     if(response === 200)
        //     {
        //       this.setState({accesscde_error : false})
        //     } else if (response === 400)
        //     {
        //       this.setState({accesscde_error : false})
        //     }
        //   })
        // }
        else{
        changePost(temp_fields).then(response=>{
          alert("Your password has been reset! Please login again.")
          window.location.assign("/")
          
        })}
      }
   
    }

    validate() {
      let temp_fields = this.state.fields;
      let temp_errors = {};
      let temp_password_error = [];
      let formIsValid = true;
      if(temp_fields["password"] === '') {
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
        error: temp_errors,
        password_error: temp_password_error
      });
      return formIsValid;
    }

    render(){
        const EmptyForm =(<div></div>);
        var password_requirements_component = this.state.passwordCheck.map(ele=>{
          return <div key={ele.req} className= { ele.valid ? "valid-req" : "invalid-req" }>{ele.req}</div>
         }) 
        return(
          <div className="col-lg-12 recoverage-container col-auto" style={topSectionStyle}>
            <div className="recoverage-form-container col-lg-12 dark-tint">
            <br/>
             <Container style={{marginTop: '7.5%'}}>
              <Card className="recoverage-card">
                <img className="recoverage-picture" src="http://cdn.onlinewebfonts.com/svg/img_228829.png" alt="lock" />
                <CardTitle className="col-auto pl-0 recoverage-center-title">
                    <h3> Forgot Password? </h3>
                </CardTitle>
                <div className="recoverage-inner-card">
                {localStorage.checkToken ? 
                  <div>
                      <div>An access code has been to sent to your email.</div>
                      <p> Check your email and enter the code below: </p>
                  </div>
                  :
                  <div> 
                    <p> Enter in a new password below: </p>
                  </div>
                }
                    <List component="nav">
                      {localStorage.checkToken ? 
                      <div>
                        <TextField className="recoverage-textfield"  
                          id="code"
                          label="Access Code"
                          name="code"
                          variant="outlined"
                          value={this.state.fields.code}
                          onChange={this.handleChange}
                          placeholder="1234567"     
                        /> 
                        <button type="submit" className="recoverage-button" onClick={this.checkCode}>SUBMIT</button>
                        </div>: EmptyForm}
                          {localStorage.checkToken ? 
                          EmptyForm :
                          <div>
                          <TextField className="recoverage-textfieldPass"
                            id="PopoverFocus"
                            type="password"
                            variant="outlined"
                            label="Password"
                            name="password"
                            value={this.state.fields.password}
                            onChange={this.handleChange}
                            placeholder="**********"
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$"
                            required      
                          />
                          <div className="text-warning"> {this.state.error.password} </div>
                          <UncontrolledPopover trigger="focus" placement="right" target="PopoverFocus">
                            <PopoverHeader>Password Requirements</PopoverHeader>
                            <PopoverBody>
                              {password_requirements_component}
                            </PopoverBody>
                          </UncontrolledPopover>
                          <ListItem />
                          <TextField className="recoverage-textfieldPass"
                            id="reenterpass"
                            label="Re-enter Password"
                            variant="outlined"
                            name="repassword"
                            type="password"
                            value={this.state.fields.repassword}
                            onChange={this.handleChange}
                            placeholder="**********"     
                          />
                          <div className="text-warning"> {this.state.error.repassword} </div>
                          <ListItem/>
                            <button type="submit" className="recoverage-button" onClick={this.reset}>
                                SAVE
                            </button>
                            </div>}
                            </List>
                      </div>
                  </Card>
              </Container>
            </div>
          </div>
        )

    }
}

export default withRouter(Accesscode);