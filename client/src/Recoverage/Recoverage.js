import React, { Component} from 'react';
import { withRouter } from 'react-router-dom'; 
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { sendcodePost } from '../Utility/RecoverageFunction';

    
    // var topSectionStyle = {
    //     width: "100%",
    //     height: '450px',
    //     marginTop: "0%",
    //     backgroundRepeat: "no-repeat",
    //     backgroundSize: "cover",
    //     backgroundPosition: "center center",
    //     backgroundImage: `url(${recoveryImage})`
    // };
       let card ={
        width: '275px'
       };
       let container = {
        marginLeft: "45%"
       }
       var topSectionStyle = {
        marginTop:"10%",
      };


class Recoverage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            showError: '',
            msgFromServer: '',
            showNullError: false,
        };
    }

    handleChange = name => (event) => {
        this.setState({
            [name]: event.target.value,
        });
    };

    sendcode = (e) => {
    // alert("Email sent!");
    
    e.preventDefault();
    const { email } = this.state;
    if(email === '')
    {
        this.setState({
            showError: false,
            msgFromServer: '',
            showNullError: true,
        });
    } 
    else{
        sendcodePost(email).then(response=>{
            if(response === "S1") 
            {
                this.setState({
                    showError: false,
                    msgFromServer: 'recovery email sent!',
                    showNullError: false,
                },
                () => {
                    // const whatever = { ... this.state}
                    // console.log('whatever', whatever)
                    this.props.history.push({
                        pathname: '/Accesscode',
                        state: email
                    });
                }
                )
            }
            else{
                this.setState({
                    showError: true,
                    msgFromServer: '',
                    showNullError: false,
                })
                }
            })
        }
    }

    
    render(){
        const {
            email, msgFromServer, showNullError, showError
        } = this.state;

		// var midSectionStyle = {
		// 	marginTop: "2em",
		// };
        return(
            <div style={topSectionStyle}>
                <div className="topheader" style={container}>
                    <Card style={card} >
                        <CardContent>
                        <div className="col-auto pl-0">
                            <h3> Password Recoverage </h3>
                        </div>
                            <TextField
                            //   style={inputStyle}
                            id="email"
                            label="email"
                            type="email"
                            value={email}
                            onChange={this.handleChange('email')}
                            placeholder="email address"     
                            />
                            <button type="submit" color="primary" onClick={this.sendcode}>
                            Send Code</button>
                            {showNullError && (
                                <div>
                                    <p>The email address cannot be null.</p>
                                </div>
                            )}
                            {showError && (
                                <div>
                                    <p>The email address has not been register!</p>
                                </div>
                            )}
                            {msgFromServer === 'recovery email sent!' && (
                                <div>
                                    <p>Access code has sent!</p>
                                </div>
                            )}
                            </CardContent>
                    </Card>
                </div>
        </div>
        )
    } 
}

export default withRouter(Recoverage);