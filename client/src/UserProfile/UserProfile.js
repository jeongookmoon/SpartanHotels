import React from 'react';
import { withRouter } from 'react-router-dom'
import "./../App.css";
import axios from 'axios';



class UserProfile extends React.Component{
  state = {
 
    name: "",
    email: "",
    reward: "",
    user : []
    
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
  
  componentDidMount() {
      axios.get('/api/profile')
        .then(res => 
          this.setState({
            name: res.data[0].name,
            email: res.data[0].email,
            reward: res.data[0].reward
          }))  
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
        
        <label for="firstName" class="col-sm-1 col-form-label">Name:</label>
        <input 
               
        
           value={this.state.name}
           onChange={e => this.change(e)} 
           />      
           <br/>
           <br/>
           <label for="email" class="col-sm-1 col-form-label">Email:</label>  
           <input value={this.state.email} onChange={e => this.change(e)} size="30"/>
           <br/>           
           <br/>
           <br/>
           <br/>
           <h1 class = "display-4" > Rewards </h1>
           <br/>
           <br/>
           <label for="reward" ></label>  
           <input 
        
           value={this.state.reward} 
           //onChange={e => this.change(e)} 
           />
      </form>
    );
  }
}
export default withRouter(UserProfile);