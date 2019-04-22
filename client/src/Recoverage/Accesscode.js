import React, { Component } from "react";
import List from '@material-ui/core/List';
import { withRouter } from 'react-router-dom'; 
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import './Recoverage.css';
import HomeImage from './homeImage7.jpg';
import { checkCodePost, changePost } from '../Utility/RecoverageFunction';
import {UncontrolledPopover, PopoverHeader, PopoverBody,} from 'reactstrap';
// import accessImage from './Images/homeImage7.jpg';
import { Card, CardBody, Container, CardTitle} from 'reactstrap';


var topSectionStyle = {
  width: "100%",
  height: '800px',
  marginTop: "0%",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center center",
  backgroundImage: `url(${HomeImage})`
};

class Accesscode extends Component {
    constructor(props) {
        super(props);
        console.log('this.props', this.props.location.state)
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

    handleChange = name => (event) => {
      // console.log("before update", this.state.fields.password)
      const name= event.target.name
      const value = event.target.value
      this.setState(prevState => ({
          fields: {
            ...prevState.fields,
            [name]: value
          }}),
          // () => console.log("after  update", this.state.fields.password)
          )
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
      console.log('email:',temp_fields.email)
      console.log('code:', temp_fields.access_code)
      checkCodePost(temp_fields).then(response =>{
        if (response === "S") {
            // const whatever = { ... this.state}
            // console.log('whatever1', whatever)
            alert("Code is valid, please set your new password!");
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
            alert("Repassword is not match to password!")
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
        changePost(temp_fields).then(resopnse=>{
          alert("Reset password successfully! Please login again")
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
        errors: temp_errors,
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
          <div className="col-lg-12 recoverage-container col-auto flex-container" style={topSectionStyle}>
            <div className="recoverage-form-container col-lg-12">
            <br/>
             <Container style={{marginTop: '10%'}}>
              <Card style={{width: "275px", marginLeft: "45%", backgroundColor: 'transparent'}}>
                <CardTitle>
                  <div className="col-auto pl-0">
                    <h3> Password Recoverage </h3>
                  </div>  
                </CardTitle>
                <CardBody style={{ backgroundColor: 'transparent'}}>
                    <List component="nav">
                      {localStorage.checkToken ? 
                      <div>
                      <ListItem />
                        <TextField  
                          id="code"
                          label="code"
                          name="code"
                          value={this.state.fields.code}
                          onChange={this.handleChange()}
                          placeholder="Access code: 1234567"     
                        /> <button type="submit" color="primary" onClick={this.checkCode}>
                              Check Code
                          </button>
                        </div>: EmptyForm}
                          {localStorage.checkToken ? 
                          EmptyForm :
                          <div>
                          <ListItem />
                          <TextField
                            id="PopoverFocus"
                            type="password"
                            label="password"
                            name="password"
                            value={this.state.fields.password}
                            onChange={this.handleChange()}
                            placeholder="**********"
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$" 
                            required     
                          />
                          <UncontrolledPopover trigger="focus" placement="right" target="PopoverFocus">
                            <PopoverHeader>Password Requirements</PopoverHeader>
                            <PopoverBody>
                            {password_requirements_component}
                            </PopoverBody>
                          </UncontrolledPopover>
                          <ListItem />
                          <TextField
                            id="repassword"
                            label="repassword"
                            name="repassword"
                            type="password"
                            value={this.state.fields.repassword}
                            onChange={this.handleChange()}
                            placeholder="**********"     
                          />
                          <ListItem/>
                            <button type="submit" color="primary" onClick={this.reset}>
                                Reset Password
                            </button>
                            </div>}
                            </List>
                      </CardBody>
                </Card>
              </Container>
            </div>
          </div>
        )

    }
}

export default withRouter(Accesscode);
