import React from "react";
import { Button, Collapse } from "reactstrap";
//import NavBar from "./../NavBar/NavBar";
import "./../App.css";
import { withRouter } from 'react-router-dom'

import {Elements, StripeProvider} from 'react-stripe-elements';
import axios from 'axios'
//import './../AppSC.css';



////////Payment////

import NumberFormat from 'react-number-format';
import { injectStripe, CardCVCElement,CardNumberElement, CardExpiryElement, PostalCodeElement} from 'react-stripe-elements';

// URL EXAMPLE
//?date_in=2019-05-15&date_out=2019-05-17&guest_number=2&hotel_id=41&city=Las%2520Vegas&country=United%20States%20of%20America&state=Nevada&address=600%20E%20Fremont%20St&hotelname=El%20Cortez%20Hotel%20and%20Casino&rooms=%7B%22results%22:%5B%7B%22hotel_id%22:41,%22bed_type%22:%22King%22,%22price%22:40,%22capacity%22:2,%22images%22:%22https://www.plazahotelcasino.com/wp-content/uploads/2014/11/DeluxeKing-GalleryPhotos-1-1024x512.jpg%22,%22quantity%22:1,%22room_ids%22:%2291%22,%22desired_quantity%22:%221%22%7D,%7B%22hotel_id%22:41,%22bed_type%22:%22Queen%22,%22price%22:40,%22capacity%22:2,%22images%22:%22https://www.plazahotelcasino.com/wp-content/uploads/2019/02/DeluxeQueen-GalleryPhotos-2-1024x512.jpg%22,%22quantity%22:1,%22room_ids%22:%2292%22,%22desired_quantity%22:0%7D%5D,%22totalResultCount%22:2%7D

class Checkout extends React.Component {

  constructor(props) {
    super(props);

    const hotel_id = this.props.location.state.hotel_id
    const hotel = this.props.location.state.hotel
    const date_in = this.props.location.state.date_in
    const date_out = this.props.location.state.date_out
    const city = this.props.location.state.city
    const state = this.props.location.state.state
    const address = this.props.location.state.address
    const country = this.props.location.state.country
    const transaction_id = this.props.location.state.transaction_id
    const nights_stayed = ((new Date(date_out) - new Date(date_in)) / (24 * 60 * 60 * 1000));

    // console.log(`night stayed ${nights_stayed}`)

    //console.log("test"+JSON.parse(this.props.location.state))
var rooms=[{}];

if(typeof(transaction_id) === 'undefined' || transaction_id === null)
{
   rooms = JSON.parse(this.props.location.state.rooms).results.filter( x => x.desired_quantity > 0 )
}
else
{
   rooms = JSON.parse(this.props.location.state.rooms)
  //  console.log("oldroom passed "+transaction_id)
}
 //  const rooms = JSON.parse(this.props.location.state.rooms).results.filter( x => x.desired_quantity > 0 )

//  console.log("rooms list:"+(this.props.location.state.rooms))
//  console.log("everything :"+JSON.stringify(this.props.location.state))
 //const rooms = JSON.parse(this.props.location.state.rooms)

    const oldPrice =  this.props.location.state.oldAmountPaid
    const rewards_applied =  (this.props.location.state.oldTotalPrice - this.props.location.state.oldAmountPaid)*100 
    
    // console.log("rewards applied:"+rewards_applied)
    // console.log("old price" +this.props.location.state.oldTotalPrice)
    // console.log("old price" +this.props.location.state.oldAmountPaid)
    var totalPrice=0;

if(typeof(transaction_id) === 'undefined' || transaction_id === null )
{
   totalPrice = rooms.reduce( (acc,cur) => acc + (cur.price * cur.desired_quantity),0 );
}
else{
  // console.log("oldroomForeach passed")
  rooms.forEach(element => {
    totalPrice += element.price*element.quantity
  });
  // console.log("totalPrice:"+totalPrice)
}
    
     

    

  //We can assume  we have user id  and rewardPoint always present as a state
   // const rewardPoint="1000"

    //Hotel ID is used for checking to avoid booking at different hotels
  
    this.state = {
      hotel,
      country,
      state,
      address,
      date_in,
      date_out,
      city,
      nights_stayed,
      rewardPoint:0,
      totalPrice,
      hotel_id,
      rooms,
      transaction_id,

// old modify
      oldPrice,
      rewards_applied,

    };
  }


  componentDidMount() {
    axios.get('/api/profile')
    .then(res => {
       this.setState({
         rewardPoint: res.data.reward
       })

    })
        
  }


  render() {

    return (

      //Stripe Publishable Key 
      <StripeProvider apiKey={process.env.REACT_APP_STRIPE_PUBLIC_KEY}> 
      <div className="dimScreenSC ">

            <div className="containerSC  w-75" style={{}}>

          <div className="w-100">

            { 
              typeof(this.state.transaction_id) !== 'undefined' ? 

              <CheckoutBookingSummaryModify 
              hotel={this.state.hotel}
              date_in={this.state.date_in}
              date_out={this.state.date_out}
              city={this.state.city}
              state={this.state.state}
              address={this.state.address}
              country={this.state.country}
              rooms={this.state.rooms}
              transaction_id={this.state.transaction_id}
            
              totalPrice={this.state.totalPrice}
              oldPrice={this.state.oldPrice}
              rewards_applied={this.state.rewards_applied}
              nights_stayed={this.state.nights_stayed}
              />

              : 
              
              <CheckoutBookingSummary 
              hotel={this.state.hotel}
              date_in={this.state.date_in}
              date_out={this.state.date_out}
              city={this.state.city}
              state={this.state.state}
              address={this.state.address}
              country={this.state.country}
              rooms={this.state.rooms}
              />
     }  



        
           
          <Elements>

{/* ////////////Payment/////////   */}

    
            <div className="">
                <CheckoutPaymentCheck
                totalPrice ={this.state.totalPrice* this.state.nights_stayed}
                rewardPoint={this.state.rewardPoint}
 
                date_in={this.state.date_in}
                date_out={this.state.date_out}
                hotel_id = {this.state.hotel_id}
                rooms={this.state.rooms}
                transaction_id={this.state.transaction_id}
                cancellation_charge={this.state.cancellation_charge}
                nights_stayed={this.state.nights_stayed}
                />
            </div>
          </Elements> 
          </div>
          </div>
      </div>
      </StripeProvider>
     );
  }
}

export default withRouter(Checkout);

////////////////////////////////////////////////////////////////////////////////////////////



// function validateRP(rewardPoint,discount)
// {
//   if(discount > rewardPoint)
//   {
//     return true;
//   }
//   return false;
// }

// const handleBlur = () => {
//   console.log('[blur]');
// };
// const handleChange2 = (change) => {
//   console.log('[change]', change);
// };
// const handleClick = () => {
//   console.log('[click]');
// };
// const handleFocus = () => {
//   console.log('[focus]');
// };
// const handleReady = () => {
//   console.log('[ready]');
// };


class _CheckoutPaymentCheck extends React.Component
{


  state={
     discount: '0',
     tempTotal:'0',
   }
 
   constructor(props) {
     super(props);

     //Check
     this.toggle = this.toggle.bind(this);
     this.state = { collapse: false };
     this.state = { discountUsed: false};
 
     //Payment
     this.state = {
       complete: false,
      tax: this.props.totalPrice*0.10,
      totalPriceBeforeTaxAndRewards: this.props.totalPrice*1.10,
      tempTotal: this.props.totalPrice *1.10,
      finalTotal: this.props.totalPrice,
      //TODO: Change rewardpoint
      rewardPoint: this.props.rewardPoint,
      rewardPointValid:false,
      total: this.props.totalPrice *1.10,
      discount:"0",

      date_in: this.props.date_in,
      date_out: this.props.date_out,
      hotel_id: this.props.hotel_id,
      rooms:this.props.rooms,
      transaction_id:this.props.transaction_id,
      cancellation_charge:this.props.cancellation_charge,
      nights_stayed:this.props.nights_stayed,

      checkBookings:false,

    };
     this.submit = this.submit.bind(this);

    
   }

   componentDidMount() {
    axios.get('/api/profile')
    .then(res => {
       this.setState({
         rewardPoint: res.data.reward
       })
      // console.log("res"+JSON.stringify(res));
      
      // console.log("resReward "+JSON.stringify(res.data.reward));
    })
        
  }

     //When reward points used, decrease price.
     // Does not go over the amount of reward point user currently have
     handleDiscountUsedInput(event){

     this.setState({ discount: event.target.value/100}, function() {
      
      if(this.state.discount < 0)
      {
        this.setState({discount: 0})
      }
      
     else if(this.state.discount*100 > this.state.rewardPoint)
     {

      this.setState({discount: this.state.rewardPoint/100})

      this.setState({finalTotal: this.state.tempTotal - this.state.rewardPoint/100})
      
     }
     else{
      this.setState({finalTotal: this.state.tempTotal - this.state.discount})
     }
    });


     }
 
     //Check if reward points used, and boundary checks
   handleDiscountUsed = () => {
     this.setState({ discountUsed:true});

     if(this.state.discount > this.state.totalPriceBeforeTaxAndRewards)
     {
      this.setState({discount: this.state.totalPriceBeforeTaxAndRewards})
      this.setState({total: 0 })

     }
     else{
      this.setState({total: this.state.finalTotal});
     }

   }
 
 
   toggle() {
     this.setState(state => ({ collapse: !state.collapse }));
   }
 
   handleChange = name => event => {
     this.setState({[name]: event.target.value});
   }

  
 
async submit(ev) {
  let {token} = await this.props.stripe.createToken({name: "SpartanHotel"});

  // console.log(token)
  // console.log(this.state.nights_stayed)
  // console.log(this.state.totalPriceBeforeTaxAndRewards)


  var desiredRooms=[{}];
if(typeof(this.state.transaction_id) === 'undefined' || this.state.transaction_id === null)
{
    desiredRooms = this.state.rooms.filter( x => x.desired_quantity > 0 )
}
else{
   desiredRooms = this.state.rooms;
}
  
var totalRoomPricePerNight=0;
if(typeof(this.state.transaction_id) === 'undefined' || this.state.transaction_id === null)
{
  totalRoomPricePerNight = desiredRooms.reduce( (acc,cur) => acc + (cur.price * cur.desired_quantity),0 )
}
else{
  this.state.rooms.forEach(element => {
    totalRoomPricePerNight += element.price*element.quantity
  });
}


  // console.log(`total room price per night ${totalRoomPricePerNight}`)
  if(typeof(this.state.transaction_id) === 'undefined' || this.state.transaction_id === null)
  desiredRooms.forEach( ele => {ele.quantity = ele.desired_quantity; delete ele.desired_quantity})

  // console.log("cancellation:"+totalRoomPricePerNight );
  // console.log(" nights stayed"+ this.state.nights_stayed);
// Prepares the data for Metadata at server side
let data={
  id: token.id,
  // amount cannot have any decimals. Stripe reads 1000 as 10.00
  //parseFloat reduces the decimals to 2, then we multiple 100 to get rid of decimals 
  
  total_price:parseFloat(this.state.totalPriceBeforeTaxAndRewards).toFixed(2),
  cancellation_charge: parseFloat( (totalRoomPricePerNight * this.state.nights_stayed * 0.20)).toFixed(2), // TODO: Change this later
  date_in: this.state.date_in,
  date_out: this.state.date_out,
  rewards_applied: parseInt(this.state.discount*100),
  rooms: desiredRooms,
  hotel_id: this.state.hotel_id,
  amount_due_from_user: parseFloat(this.state.total).toFixed(2),
  transaction_id:this.state.transaction_id,

  status: "Complete",
  guest_id:"0",
  
}

// console.log('aaaaaaaaaadatadatadatadata', data)

if(typeof(this.state.transaction_id) === 'undefined' || this.state.transaction_id === null)
{  
  let response = await fetch("/api/checkout/charge", {
    method: "POST",
    headers: {"Content-Type": "text/plain"},
    body: JSON.stringify(data),
    
  }).catch(error=>console.log("Error: "+error));

  if (response.ok)
  {
    

      this.props.history.push(`/Confirmation`);   
  }
  else{
    // console.log(response)
    let textPromise = await response.text()
    // console.log(`textPromise is ${textPromise}`)
    if ( textPromise.includes("Attempted booking overlaps")){
        this.setState({
          checkBookings:true,
        })

        // console.log(this.state.checkBookings)
      // show message when no multiple booking condition at different hotel failed
    }

    // console.log("error "+ response.status)
  }
}
else{

// console.log("sddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd")
  let response = await fetch("/api/checkout/modify", {
    method: "POST",
    headers: {"Content-Type": "text/plain"},
    body: JSON.stringify(data),
    
  }).catch(error=>console.log("Error: "+error));

  if (response.ok)
  {
    
      this.props.history.push(`/Confirmation`);   
  }
  else{
    // console.log(response)
    let textPromise = await response.text()
    // console.log(`textPromise is ${textPromise}`)
    if ( textPromise.includes("Attempted booking overlaps")){
        this.setState({
          checkBookings:true,
        })

        // console.log(this.state.checkBookings)
      // show message when no multiple booking condition at different hotel failed
    }

    // console.log("error "+ response.status)
  }




}


}

 
   
   render(){

    // console.log("rewardpoint:"+this.state.rewardPoint) 

    //  const error= validateRP(this.state.rewardPoint,this.state.discount);
    //  const isEnabled = !error;
    
     
 
   return (
    
 <div className="row" style={{marginRight:"0px", marginLeft:"0px"}}>
     
 
       {/*   //////////////Payments///////////////////////                          */}
 
     <div className="card text-left w-50">
       <h5 className="card-header">Payment Method</h5>
       <div className="card-body" style={{backgroundColor: "#ffffff"}}>
         <div className="row">
           <div className="col-md-11">
           <form action="/charge" method="post" id="payment-form">
             <div className="form-group"> 
              <img src="https://images-na.ssl-images-amazon.com/images/I/61cL%2BM-SN%2BL._SL1283_.jpg" alt="ckot" width="405.5" height="153.5"/>{" "}
             </div>
              <div className="form-group">
               <span style={{ fontSize: 12, marginLeft: 13 }}>Card Number</span>
                <div>
                  <CardNumberElement/>
                </div>
               </div>
            
             <div className="form-group row">
               <div
                 className="form-group "
                 style={{ paddingLeft: 15, marginTop: 8, width:"33%" }}>
                  <span style={{ fontSize: 12, marginLeft: 13 }}>Expiration Date</span>
                  <div>
                    <CardExpiryElement/>
                  </div>
               </div>
 
              
 
               <div
                 className="form-group "
                 style={{ paddingLeft: 30, marginTop: 8, width:"33%" }}
               >
                 <span style={{ fontSize: 12, marginLeft: 13 }}>Postal Code</span>
                 <div>
                    <PostalCodeElement />
                 </div>
               </div>
 
       
 
               <div
                 className="form-group"
                 style={{ marginTop: 8, paddingLeft: 30, width:"33%"}}
               >
   <span style={{ fontSize: 12, marginLeft: 13 }}>CVC</span>
         <div>
           <CardCVCElement/>
           </div>
                
               </div>  
             </div>
        
             </form>
           </div>
         </div>
       </div>
     </div>
 
    {/*   //////////////Check///////////////////////                          */}
 
 
 
 
 
     <div className="card text-left w-50 " >
       <h5 className="card-header">Payment Summary</h5>
       <div className="card-body">
         <div className="col" />
         <p className="font-weight-bold" id="test" />
 
         <form>
 
         <table className="table font-weight-bolder">
           <tbody className="border">
             <tr>
               <td>Room: </td>

               <NumberFormat value={this.props.totalPrice} displayType={'text'}
               prefix={'$'} decimalScale={2} fixedDecimalScale={true}
               renderText={value => <td align="right">{value}</td>} defaultValue={this.props.totalPrice}
               ></NumberFormat>

             </tr>
        
             <tr>
               <td style={{ width: '100%' }}>Tax: </td>
              
              <NumberFormat value={this.state.tax} displayType={'text'}
               prefix={'$'} decimalScale={2} fixedDecimalScale={true}
               renderText={value => <td align="right">{value}</td>} defaultValue={this.state.tax}
               ></NumberFormat>
             </tr>
 
             <tr>
               <td style={{ width: '100%' }}>Discount: </td>
              
              <NumberFormat value={this.state.discount} displayType={'text'}
               prefix={'$'} decimalScale={2} fixedDecimalScale={true}
               renderText={value => <td align="right">{value}</td>} defaultValue={0.00}
               ></NumberFormat>
 
             </tr>
      
             <tr>
               <td>TOTAL:  </td>
               <NumberFormat value={this.state.total} displayType={'text'}
               prefix={'$'} decimalScale={2} fixedDecimalScale={true}
               renderText={value => <td>{value}</td>} defaultValue={1.10}
               ></NumberFormat>
               
             </tr>
             
           </tbody>
         </table>
         <hr className="dottedLineSC w-100" />
 
         <div className="row w-100">
           <div className="w-50 col-sm-auto ">
           <Button
               color="warning"
               onClick={this.toggle}
               style={{ marginBottom: "1rem",  width: '90%'}}      
             >
               Pay with Reward Points
             </Button>
 
           </div>
           <div className=" w-50 col-sm-auto">
           <Button
               color="primary"
               onClick={this.submit}
               style={{ marginBottom: "1rem", width: '90%'}}
             >
               Checkout
             </Button>
             </div>
         </div >
 
         <div className=" w-100 row">
         <Collapse isOpen={this.state.collapse} style={{ width: '100%'}}>
               <div id="collapse-rewardPoint ">
                 <div className="form-group col-sm-auto offset-sm-1 row " >
                 {/*? "Not enough reward points": ''*/}
                   <input  type="text" id="rewardPointInput" className="form-control w-75" placeholder="Reward Point Amount"
                    onChange= {this.handleDiscountUsedInput.bind(this)}
                   />
                   <Button
                       color="warning"
                       onClick={()=>this.handleDiscountUsed()}
                       style={{ width: '25%'}}>
                       Use
                     </Button>
                     <div className='small'>
                       <p>
                         You have {this.state.rewardPoint} Reward Points ;
                       </p>
                       <p className='font-italic small'> 1 Reward Point = $0.01 (ie. 500 Reward Points = $5.00)</p>
                     </div>
                    
                 </div>

               </div>
             </Collapse>
         </div>

         {this.state.checkBookings ? <div className="room-page-verify-checkout"> There is a booking that already exists within this date. </div> : null}
 
         </form>
       </div>
    
     </div>
     </div>
   );
 }
 


}


const CheckoutPaymentCheck = withRouter(injectStripe(_CheckoutPaymentCheck));
///////////////////////////////////////////////////////////////////////////////////



class _CheckoutBookingSummary extends React.Component
{


  constructor(props) {
    super(props);

const hotel = this.props.hotel
const date_in = this.props.date_in
const date_out = this.props.date_out
const city = this.props.city
const state = this.props.state
const address = this.props.address
const country = this.props.country
const totalPrice = this.props.totalPrice
const rooms = this.props.rooms
const nights_stayed = ((new Date(date_out) - new Date(date_in)) / (24 * 60 * 60 * 1000));

//console.log("test"+rooms)

this.state = {
  hotel,
  country,
  state,
  address,
  date_in,
  date_out,
  city,
  totalPrice,
  rooms,
  nights_stayed:nights_stayed,
};


/*
this.item = this.state.rooms.map((item, key) =>
<li key={item.bed_number}>{item.bedType}</li>
);
*/
}

// Example URL

//?date_in=2019-02-02&date_out=2019-03-03&guest_number=null&hotel_id=41&city=Las%20Vegas&country=United%20States%20of%20America&state=Nevada&address=600%20E%20Fremont%20St&king=3&kingID=91&queen=5&queenID=92&totalPrice=320&KingPrice=50&QueenPrice=40&name=Sublime%Citadel%Resort%&%Spa
//?date_in=2019-05-16&date_out=2019-05-18&guest_number=3&hotel_id=32&city=Las%20Vegas&country=United%20States%20of%20America&state=Nevada&address=4321%20W%20Flamingo%20Rd&rooms=%7B%22results%22:%5B%7B%22hotel_id%22:32,%22bed_type%22:%22King%22,%22price%22:42,%22capacity%22:2,%22images%22:%22https://www.jetsetter.com/uploads/sites/7/2018/04/bedroom-hotels-suite-bed-sheet-3-960x960.jpeg%22,%22quantity%22:1,%22room_ids%22:%2270%22,%22desired_quantity%22:%221%22%7D,%7B%22hotel_id%22:32,%22bed_type%22:%22Queen%22,%22price%22:42,%22capacity%22:2,%22images%22:%22https://t-ec.bstatic.com/images/hotel/max1024x768/109/109121752.jpg%22,%22quantity%22:1,%22room_ids%22:%2271%22,%22desired_quantity%22:%222%22%7D%5D,%22totalResultCount%22:2%7D
render(){

return (
<div className="card text-center h-50">
  <h5 className="card-header">Booking Summary</h5>
  <div className="card-body  " style={{backgroundColor: "#ffffff"}}>
  
    <h4>
   
    
    <div >
    <p className="font-weight-bold" style={{fontSize:"30px"}} >{this.props.hotel}</p>
    <p className="font-weight-light" style={{fontSize:"20px"}}>{this.props.address}, {this.props.city}</p>
    <p className="font-weight-light" style={{fontSize:"20px"}}> {this.props.state}, {this.props.country} </p>
    </div>
    <div >

<div className="font-weight-light text-muted ">          {
       this.state.rooms.forEach((value)=>{
        // console.log(value)
        if(value.desired_quantity > 0){
        return  <p>{value.desired_quantity} {value.bed_type} x {this.state.nights_stayed} Day = $ {(value.price * value.desired_quantity * this.state.nights_stayed)}</p>
        }
      })}

     </div>
   

    </div>
    <div>

    <p className="font-weight-bold" style={{fontSize:"20px"}} >Check In: {this.props.date_in}</p>
    <p className="font-weight-bold" style={{fontSize:"20px"}} >Check Out: {this.props.date_out}</p>
    </div>
  

    </h4>
  </div>
</div>
);
}
}

const CheckoutBookingSummary = withRouter(_CheckoutBookingSummary);


class _CheckoutBookingSummaryModify extends React.Component
{


  constructor(props) {
    super(props);

const hotel = this.props.hotel
const date_in = this.props.date_in
const date_out = this.props.date_out
const city = this.props.city
const state = this.props.state
const address = this.props.address
const country = this.props.country
const totalPrice = this.props.totalPrice
const rooms = this.props.rooms

//Modify
const oldPrice = this.props.oldPrice
const rewards_applied = this.props.rewards_applied
const nights_stayed = this.props.nights_stayed

//console.log("test"+rooms)

this.state = {
  hotel,
  country,
  state,
  address,
  date_in,
  date_out,
  city,
  totalPrice,
  rooms,
  nights_stayed,
  oldPrice,
  rewards_applied,
};

}

render(){

return (
<div className="row " style={{marginRight:"0px", marginLeft:"0px"}}>
{/*Booking Info */}
<div className="card w-50">
  <h5 className="card-header text-left">Booking Summary</h5>
  <div className="card-body " style={{backgroundColor: "#ffffff"}}>
  
    <h4>
   
    <br/>
    <br/>
    <div >

    <div className="font-weight-light text-muted ">          {
         this.state.rooms.forEach((value, index)=>{
          // console.log(value)
          if(value.quantity > 0){
          return  <p key={index + 1}>{value.quantity} {value.bed_type} x {this.state.nights_stayed} days = $ {value.quantity * value.price * this.state.nights_stayed} </p>
          }
        })}

     </div>
  

    </div>

    <div>

    <p className="font-weight-bold" style={{fontSize:"20px"}} >Check In: {this.props.date_in}</p>
    <p className="font-weight-bold" style={{fontSize:"20px"}} >Check Out: {this.props.date_out}</p>
    </div>
  

    </h4>
  </div>
</div>
{/*Old Payment*/}

<div className="card text-left w-50 " >
       <h5 className="card-header">Previous Payment Summary</h5>
       <div className="card-body" style={{backgroundColor: "#ffffff"}}>
         <div className="col" />
         <p className="font-weight-bold" id="test" />
 
 
         <table className="table font-weight-bolder">
           <tbody className="border">
             <tr>
               <td>Prev. Price: </td>

               <NumberFormat value={this.state.oldPrice} displayType={'text'}
               prefix={'$'} decimalScale={2} fixedDecimalScale={true}
               renderText={value => <td align="right">{value}</td>} defaultValue={0}
               ></NumberFormat>

             </tr>
        
             <tr>
               <td style={{ width: '100%' }}>Reward Used: </td>
              
              <NumberFormat value={this.state.rewards_applied} displayType={'text'}
               prefix={''} decimalScale={0} fixedDecimalScale={true}
               renderText={value => <td align="right">{value}</td>} defaultValue={0}
               ></NumberFormat>
             </tr>
 
             <tr>
               <td style={{ width: '100%' }}>New Price: </td>
              
              <NumberFormat value={this.state.totalPrice*this.state.nights_stayed} displayType={'text'}
               prefix={'$'} decimalScale={2} fixedDecimalScale={true}
               renderText={value => <td align="right">{value}</td>} defaultValue={0.00}
               ></NumberFormat>
 
             </tr>
      
             <tr>
               <td>Total Difference:  </td>
               <NumberFormat value={(this.state.totalPrice*this.state.nights_stayed)-this.state.oldPrice} displayType={'text'}
               prefix={'$'} decimalScale={2} fixedDecimalScale={true}
               renderText={value => <td align="right">{value}</td>} defaultValue={0}
               ></NumberFormat>
               
             </tr>
             
           </tbody>
         </table>
         <div className= "alert alert-info "style={{}}>
          <span> We will refund or charge only the difference of the old and new booking prices!</span>
          </div>
         </div>
         </div>



</div>
);
}
}

const CheckoutBookingSummaryModify = withRouter(_CheckoutBookingSummaryModify);




/*
Package.json :

"proxy": "http://localhost:9000"
*/

 
  /*
  npm install react-number-format --save
  npm install --save reactstrap react react-dom
  
 npm install --save react-stripe-elements
 
 npm install express body-parser stripe
  npm install --save react-router-dom


https://stripe.com/docs/recipes/elements-react#setup


  */
