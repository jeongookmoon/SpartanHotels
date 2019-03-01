import React from 'react';



function NavBar(props) {
  return (
    <nav className="sticky-top navbar navbar-dark bg-light fixed-top">
    {/*<nav className="sticky-top navbar navbar-dark bg-light fixed-top">*/}


{/*LEFT SIDE*/}
        <div className="navbar-left form-inline my-2 my-lg-0" >
      
            <div className="col-auto pl-0">
              SPARTAN HOTELS
            </div> 

            <div className="col-auto pl-0">
            |
            </div>

            <div className="col-auto pl-0"> 
                 REGISTER
            </div>
        </div>



{/*RIGHT SIDE*/}
        <div>

        <form className="form-inline my-2 my-lg-0">

              {/*EMAIL*/}   
              <div className="col-auto pl-0">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="email-input input-group-text"><i className="far fa-user"></i></div>
                  </div>
                  <input type="email" className="email-input form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email Address"></input>
                </div>
              </div>

              {/*PASSWORD*/}
              <div className="col-auto pl-0">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="password-input input-group-text"><i className="fa fa-lock"></i></div>
                  </div>
                  <input type="password" className="password-input form-control" id="inlineFormInputGroup" placeholder="Password"></input>
                </div>
              </div>

              {/*LOGIN BUTTON*/}
              <div className="col-auto pl-0 pr-0">
                  <button className="btn btn-primary my-2 my-sm-0" type="submit">Login</button>
                </div>
            </form>
        


        </div>
      
    </nav>
  );
}

export default NavBar;