import React from 'react';
import "./../App.css";






export default class UserProfile extends React.Component{
  state = {

    firstName: "",    
    lastName: "",
    email: "",
    rewards: "",
    
  }
  
  change = e =>{
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = (e) => {//able to se values once submitted
    e.preventDefault();
    this.props.onSubmit(this.state)//possibly delete this.state
    console.log(this.state); 
  };
  fileSelectedHandler = event =>{
      console.log(event.target.files[0]);
  }
  

  render() {
    return(


      <form>
        <br/>
        <br/>
        <br/>
        <br/>         
        <br/> 
        <h1 class = "display-4" > User Profile </h1>
        
        <label for="firstName" class="col-sm-1 col-form-label">First Name:</label>
        <input 
           name = "firstName"      
           placeholder= 'First name' 
           value={this.state.firstName}
           onChange={e => this.change(e)} 
           />      
           <br/>
           <br/>
           <label for="lastName" class="col-sm-1 col-form-label">Last Name:</label>
           <input 
           name = "lastName"
           placeholder= 'Last name' 
           value={this.state.lastName} 
           onChange={e => this.change(e)} 
           />
           <br/>
           <br/>
           <label for="email" class="col-sm-1 col-form-label">Email:</label>  
           <input 
           name = "email"
           placeholder= 'Email' 
           value={this.state.email} 
           onChange={e => this.change(e)} 
           />
           <br/>           
           <br/>
           <button type="button" class="btn btn-outline-info" onClick = {e => this.onSubmit(e)}>UPDATE INFORMATION </button>
           <br/>
           <br/>
           <h1 class = "display-4" > Rewards </h1>
           <br/>
           <br/>
           <label for="rewards" ></label>  
           <input 
           name = "rewards"
           placeholder= '0' 
           value={this.state.rewards} 
           //onChange={e => this.change(e)} 
           />
      </form>
    );
  }
}
