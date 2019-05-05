const app = require("express")();

const stripe = require("stripe")("sk_test_KMjoJvcxhuiJSV51GJcaJfSi00r9QtVXjo"); // Your Stripe key

const bodyParser  = require('body-parser');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password', // change to whatever your password
  database : 'spartanhotel'
});


app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

/////////////////////////CHARGE////////////////////////////////


app.post("/charge", async (req, res) => {
  try {
    var data = JSON.parse(req.body)

    let status = await stripe.charges.create({
      amount: data.amount,
      currency: "usd",
      description: "Charge",
      source: data.id,
    });

   console.log(status.id); // retrieves the charge


   
    console.log(status);
    //console.log("amount: "+data.amount);
    console.log(data);

    res.json({status});

  } catch (err) {
    console.log(err);
    res.status(500).end();
  }


});

// STATUS: Cancelled
app.post('/refund', function(req, res) {
  var data = JSON.parse(req.body)
  let status = stripe.refunds.create({
    charge: data.stripe_id
    
  }, function(err, refund) {
    console.log(err);
  });
  // Returns Success or Fail response to front end
  res.json({status})
  });

  ///////////////////////MODIFY//////////////////////////////////
  // Refunds then charge
  app.post('/modify', function(req, res) {
    var data = JSON.parse(req.body)
   
        // Refund fully
        stripe.refunds.create({
          charge: data.stripe_id
      
        }, function(err, refund) {
          console.log(err);

        });



        // Then Charge with the new amount
       let status = stripe.charges.create({
          amount: data.amount_due_from_user*100,
          currency: "usd",
          description: "Modify",
          source: data.id,
  
        });
        res.json({status});
    });


   
    
////////////////////////WEBHOOK (Insertion into database after successful transaction)////////////////
/** */

app.use(require('body-parser').raw({type:'*/*'}));
app.post('/webhook', function(request,response){

  const data = JSON.parse(request.body);

  console.log("Webhook Succeeed");
 console.log(data);

 // Put rooms information into object
 var rooms = [{
  id:data.data.object.metadata.room1_room_ids,
  room_type:data.data.object.metadata.room1_bed_type,
  price:data.data.object.metadata.room1_price,
  quantity: data.data.object.metadata.room1_quantity,
},
  {
    id: data.data.object.metadata.room2_room_ids,
    room_type:data.data.object.metadata.room2_bed_type,
    price: data.data.object.metadata.room2_price,
    quantity:data.data.object.metadata.room2_quantity,
  },
  {
    id: data.data.object.metadata.room3_room_ids,
    room_type:data.data.object.metadata.room3_bed_type,
    price: data.data.object.metadata.room3_price,
    quantity:data.data.object.metadata.room3_quantity,
  },

]

  // Put into database
  connection.connect();
/////////////////For CHARGE only (Not modifying)/////////////////////////////////////
  if( data.data.object.metadata.type == "charge")
  {
    try{
    
      // Get sent data.
   // Do a MySQL query.
   
   var insertQuery = connection.query('INSERT INTO transaction (user_id,guest_id,total_price,cancellation_charge,date_in,date_out,status,amount_paid,stripe_id) VALUES (?,?,?,?,?,?,?,?,?)', [ 
    data.data.object.metadata.user_id,
    data.data.object.metadata.guest_id,
    data.data.object.metadata.amount,
    data.data.object.metadata.cancellation_charge,
    data.data.object.metadata.date_in,
    data.data.object.metadata.date_out,
    data.data.object.metadata.status,
    data.data.object.metadata.amount_paid,
    data.data.object.id,
  
  ], function(err, result) {
    if (err){
      console.log("SQL Charge Insertion Failed")
      throw err;
    }
   });

  

   console.log("SQL succeed")
    
   }catch(err){
     
   }
  
   


 //Getting the transcation id produced from the database
   var transaction_id;
   var selectQuery = connection.query('SELECT transaction_id FROM transaction WHERE user_id=?',[data.data.object.metadata.user_id], 
   function(err, result) {
    transaction_id = result[0].transaction_id;
    if (err){
      connection.end();
      console.log("SQL SELECT search Failed")
      throw err;
    }
  else{
    console.log("transcation_id: "+transaction_id)

    //// INSERT MULTIPLE ROOMS

    /////ADD NEW ROOMS////////////////
    
    var queryString ="INSERT INTO transaction_room (transaction_id,room_id,room_price,date_in,date_out) VALUES "

    //Building the query for multiple rooms

    /*
    if(data.data.object.metadata.king_room_quantity > 0 && data.data.object.metadata.queen_room_quantity > 0 )
    {
      console.log(" Inside transcation_id : "+transaction_id)
      //Queen
      queryString+="("
      +transaction_id+","
      +data.data.object.metadata.queen_room_id+","
      +data.data.object.metadata.queen_room_price+",'"
      +data.data.object.metadata.date_in+"','"
      +data.data.object.metadata.date_out
      queryString+="'),";

    //King
      queryString+="("
      +transaction_id+","
      +data.data.object.metadata.king_room_id+","
      +data.data.object.metadata.king_room_price+",'"
      +data.data.object.metadata.date_in+"','"
      +data.data.object.metadata.date_out
      queryString+="')";
    }
    else if(data.data.object.metadata.king_room_quantity < 0 ){
    // Queen
      queryString+="("
      +transaction_id+","
      +data.data.object.metadata.queen_room_id+","
      +data.data.object.metadata.queen_room_price+",'"
      +data.data.object.metadata.date_in+"','"
      +data.data.object.metadata.date_out
      queryString+="')";
    }
    else{
      //King 
      queryString+="("
      +transaction_id+","
      +data.data.object.metadata.king_room_id+","
      +data.data.object.metadata.king_room_price+",'"
      +data.data.object.metadata.date_in+"','"
      +data.data.object.metadata.date_out
      queryString+="')";
    }
    */

    console.log(queryString)

    //Launch Rooms Insert Query
      var insertRoomQuery = connection.query(queryString, function(err, result) {
        connection.end();
        if (err){
          console.log("SQL Room Insertion Failed")
          
          throw err;
          
        }
      });
  }
  
  });
  }

/////////////////////////////////END OF CHARGE ////////////////////////////////////

//////////////////////////////MODIFY - (WEBHOOK)//////////////////////////////////////////////
else{

////// UPDATE/MODIFY THE TRANSACTION /////////////
/*
  var updateQuery = connection.query('UPDATE transaction  SET date_in = ?, date_out=?, status = ?, amount_paid=?, total_price=?, cancellation_charge=?, stripe_id=? WHERE transaction_id = ?', [ 
    data.data.object.metadata.date_in,
    data.data.object.metadata.date_out,
    data.data.object.metadata.status,
    data.data.object.metadata.amount_paid/100,
    data.data.object.metadata.amount/100,
  data.data.object.metadata.cancellation_charge,
  data.data.object.id,
  data.data.object.metadata.transaction_id,
  ],  function(err, result) {
  if (err){
    console.log("SQL MODIFY Insertion Failed")
    throw err;
  }
  });
  */
  // FOR EVERY ROOM - DELETE OLD ROOMS AND ADD NEW ROOMS

// DELETE OLD ROOMS

//DELETE FROM transaction_room WHERE room_id



//////////ADD NEW ROOMS////////////////

//  var queryString ="INSERT INTO transaction_room (transaction_id,room_id,room_price,date_in,date_out) VALUES "

  //Building the query with multiple rooms


  
  console.log("Connection End")
  connection.end();
  ////////////////END OF MODIFY///////////////

  }


  response.send(200);
});

/////////////////////// END OF WEBHOOK //////////////////////////////



  
/*
///////////////////////IMPORTANT////////////////////
Webhook is required to retrieve charge ID

ngrok for Webhook - for allowing to let websites to access your local machine

Download and extract ngrok
open ngrok.exe
type ngrok.exe http 9000     - this exposes the port 9000 (or w/e the server port is using)

If recieved MYSQL error,
Client does not support authentication protocol requested by server; consider upgrading MySQL client

Then execute query in MYSQL
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YOUR-ROOT-PASSWORD'


*/



app.listen(9000, () => console.log("Listening on port 9000"));
