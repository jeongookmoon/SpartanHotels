import React, { Component} from 'react';
import { withRouter } from 'react-router-dom'; 
import TextField from '@material-ui/core/TextField';
import homeImage from './homeImage7.jpg';
import './Recoverage.css';
import { sendcodePost } from '../Utility/RecoverageFunction';
import { Card, Container, CardTitle } from 'reactstrap';

var topSectionStyle = {
    width: "100%",
    height: '100vh',
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundImage: `url(${homeImage})`
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
        //  marginTop: "2em",
        // };
        return(
            <div className="col-lg-12 recoverage-container col-auto" style={topSectionStyle}>
                <div className="recoverage-form-container col-lg-12 dark-tint">
                <br/>
                <Container style={{marginTop: '9%'}}>
                    <Card className="recoverage-card">
                        <img className="recoverage-picture" src="http://cdn.onlinewebfonts.com/svg/img_228829.png" alt="lock" />
                        <CardTitle className="col-auto pl-0 recoverage-center-title">
                                <h3>Forgot Password?</h3>
                        </CardTitle>
                        <div className="recoverage-inner-card">
                            Enter your email below and we'll send you an access code: 
                            <br />
                            <br />
                            <TextField className="recoverage-textfield"
                                id="email"
                                label="Email"
                                type="email"
                                variant="outlined"
                                value={email}
                                onChange={this.handleChange('email')}
                                inputProps={{ maxLength: 99 }}
                                placeholder="guest@spartanhotels.com"     
                            />
                            {showNullError && (
                                <div>
                                    <p className="text-warning"> *Please enter in your email.</p>
                                </div>
                            )}
                            {showError && (
                                <div>
                                    <p className="text-warning">*This email address has not been registered!</p>
                                </div>
                            )}
                            {msgFromServer === 'recovery email sent!' && (
                                <div>
                                    <p>Access code has sent!</p>
                                </div>
                            )}
                            <button type="submit" className="recoverage-button" onClick={this.sendcode}>RESET</button>
                            </div>
                        </Card>
                    </Container>
                </div>
        </div>
        )
    } 
}

export default withRouter(Recoverage);