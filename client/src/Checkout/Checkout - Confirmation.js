import React, {Component} from 'react';

import {withRouter} from 'react-router-dom'


class CheckoutConfirm extends Component {




 constructor(props) {
  super(props);
  this.state = {complete: false};
}



 state={
   //Payment
    id: '',
    email: '',
    

  }

 handleChange = name => event => {
    this.setState({[name]: event.target.value});
  }
  
  
 render() {
  return (
  <div class="card text-left ">
      <h5 class="card-header">Payment Method</h5>
      <div class="card-body">
        <div class="row">
         
         <h1>Purchse Complete!</h1>
        </div>
      </div>
    </div>
  
  );
}
}

export default withRouter(CheckoutConfirm);