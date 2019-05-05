import React, { Component} from 'react';
import { withRouter } from 'react-router-dom'; 
import TextField from '@material-ui/core/TextField';
import homeImage from './homeImage7.jpg';
import './Recoverage.css';
import { sendcodePost } from '../Utility/RecoverageFunction';
import { Card, CardBody, Container, CardTitle } from 'reactstrap';

var topSectionStyle = {
    width: "100%",
    height: '800px',
    marginTop: "0%",
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
		// 	marginTop: "2em",
		// };
        return(
            <div className="col-lg-12 recoverage-container col-auto" style={topSectionStyle}>
                <div className="recoverage-form-container col-lg-12">
                <br/>
                <Container style={{marginTop: '10%'}}>
                    <Card style={{width: "275px", marginLeft: "45%", backgroundColor: 'transparent', align: "center"}}>
                        <CardTitle>
                        <div className="col-auto pl-0" style={{alignText: 'center'}}>
                            <h4> Password Recoverage </h4>
                        </div>
                        </CardTitle>
                        <CardBody style={{ backgroundColor: 'transparent'}}>
                            <TextField
                            //   style={inputStyle}
                            id="email"
                            label="email"
                            type="email"
                            value={email}
                            onChange={this.handleChange('email')}
                            inputProps={{ maxLength: 99 }}
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
                            </CardBody>
                    </Card>
                    </Container>
                </div>
        </div>
        )
    } 
}

export default withRouter(Recoverage);