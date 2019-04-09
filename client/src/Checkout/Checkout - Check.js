import React, { Component } from "react";
import { Button, Collapse} from "reactstrap";
import NumberFormat from 'react-number-format';
// import ReactDOM from "react-dom";
import "./../App.css";

/////// Local Testing //////////////

var rewardPoint = "1000";
var cost = "59.99";
// var discount;
// var rewardPointUsed = "1000";
// var total;
// var tempTotal;
// var tempReward;
// window.onload = function () {
//   document.getElementById("testPayID").innerHTML = "$" + cost;

//   document.getElementById("discountID").innerHTML = "$" + rewardPointUsed/100+".00";

//   document.getElementById("rewardPoint").innerHTML = " "+rewardPoint + " Reward Points.";
// };

// function validateRP(rewardPoint,discount)
// {
//   if(discount > rewardPoint)
//   {
//     return false;
//   }
//   return true;
// }


//////////////////////////////////////////////////
class CheckoutCheck extends Component {




  state={
    rewardPointUsed: '',
    discount: '0',
    total: '0',
    testPay:'59.99',
    tempTotal:'0',
    rewardPoint: "1000",
    tempReward: '0'
  }

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
    this.state = { discountUsed: false};
    
  }

    //change value of Discount when inputted
    handleDiscountUsedInput(event){
      this.setState({ discount: event.target.value/100}, function() {
        this.setState({tempTotal: cost - this.state.discount})
      });
    }

  handleDiscountUsed = () => {
    this.setState({ discountUsed:true});
    this.setState({total: this.state.tempTotal});
  }


  toggle() {
    this.setState(state => ({ collapse: !state.collapse }));
  }
 


  render(){
    // const error= validateRP(this.state.rewardPoint,this.state.discount);
  return (
    <div class="card text-left h-50">
      <h5 class="card-header">Payment Summary</h5>
      <div class="card-body">
        <div class="col" />
        <p class="font-weight-bold" id="test" />

        <form>

        <table class="table font-weight-bolder">
          <tbody class="border">
            <tr>
              <td>Room: </td>
              <td id="testPayID" />
            </tr>
           
            <tr>
              <td style={{ width: '100%' }}>Discount: </td>
             
             <NumberFormat value={this.state.discount} displayType={'text'}
              prefix={'$'} decimalScale={2} fixedDecimalScale={true}
              renderText={value => <td>{value}</td>} defaultValue={0.00}
              ></NumberFormat>

    

            </tr>
     
            <tr>
              <td>TOTAL:  </td>
              <NumberFormat value={this.state.total} displayType={'text'}
              prefix={'$'} decimalScale={2} fixedDecimalScale={true}
              renderText={value => <td>{value}</td>} defaultValue={cost}
              ></NumberFormat>
              
            </tr>
            
          </tbody>
        </table>
        <hr class="dottedLine w-100" />

        <div class="row w-100">
          <div class="w-50 col-sm-auto ">
          <Button
              color="warning"
              onClick={this.toggle}
              style={{ marginBottom: "1rem",  width: '90%'}}
              
              
            >
              Pay with Reward Points
            </Button>

          </div>
          <div class=" w-50 col-sm-auto">
          <Button
              color="primary"
              onClick={this.toggle}
              style={{ marginBottom: "1rem", width: '90%'}}
            >
              Checkout
            </Button>
            </div>
        </div >

        <div class=" w-100 row">
        <Collapse isOpen={this.state.collapse} style={{ width: '100%'}}>
              <div id="collapse-rewardPoint ">
                <div class="form-group-demo col-sm-auto offset-sm-1 row " >
                  <input type="text" id="rewardPointInput" class="form-control w-75" onChange= {this.handleDiscountUsedInput.bind(this)}
                  />
                  <label class="form-control-placeholder" for="rewardPointInput">
                    Reward Point Amount
                  </label>

                  <Button
                      color="warning"
                      onClick={()=>this.handleDiscountUsed()}
                      style={{ width: '25%'}}>
                      Use
                    </Button>
                    <p class='small'>
                      <p>
                        You have {rewardPoint} Reward Points ;
                      </p>
                    </p>
                    <p class='font-italic small'> 1 Reward Point = $0.01 (ie. 500 Reward Points = $5.00)</p>

                </div>

 
  
              </div>
            </Collapse>
        </div>

        </form>
      </div>
      <hr />
    </div>
  );
}


}

export default CheckoutCheck;
