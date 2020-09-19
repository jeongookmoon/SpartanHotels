# Spartan-Hotels
CMPE 165 Project

## Running on Heroku Server
https://spartanhotels.herokuapp.com/

## MERN STACK
```
1. MySQL(JAWSDB on Heroku) - user, booking, hotel, room, reward, images, transactions
2. Express - Backend framework
3. React - Frontend library - component based design - communication with backend over AJAX/Axios
4. Node - Backend JS env - handles API calls and manage DB
```

## Features
1. Register - Input and DB Validation
![](registration.gif)

2. Search - Autocomplete (via Google Places API) and Filter
![](autocomplete_filter.gif)

3. Search Result - Map Navigation (with Google Maps API), Filter, Sort
![](googlemap_filter_sort.gif)

4. Payment - Integrated with Stripe API
![](stripe_payment_db.gif)

5. Booking History - Modify/Cancel booking - DB update 
![](edit_cancel_booking.gif)

### Local Setup

## Client
1. Inside /client, `npm install` to install dependencies and create ".env" file containing the following (replace YOUR_KEY)
2. `REACT_APP_AUTOCOMPLETE_URL=https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places`
3. `npm start` to start react on port 3000 
4. http://localhost:3000/ should automatically open up
Any changes in /client should automatically reloaded in browser

## Server
Inside /server,  
    `npm install` to install dependencies  
    `npm start` to start react on port 3001  
To view express server in browser, open http://localhost:3001/

## Postman test
The post request already saved in Spartan Hotels folder called *Reservation*, *Reservation/cancellation*, and *Reservation/modify*


