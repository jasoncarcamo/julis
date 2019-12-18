import React from "react";
import TokenService from "../../TokenService/TokenService";
import RequestsContext from "../../Contexts/RequestsContext/RequestsContext";
import MuiPhoneNumber from "material-ui-phone-number";
import {Link} from "react-router-dom";
import "./login.css";

export default class extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            mobile_number: "",
            password: "",
            error: ""
        };
    };

    static contextType = RequestsContext;

    componentDidMount(){
        if(TokenService.hasToken()){
            this.props.history.push("/user");
        }
    }

    handleInput = (e)=>{
        this.setState({ [e.target.name]: e.target.value})
    }

    handleMobileNumber = (value) => {
        this.setState({mobile_number: value});
    }

    handleSubmit = (e) => {
        e.preventDefault();

        return fetch("https://nameless-beach-67218.herokuapp.com/api/login", {
            method: "POST",
            headers: {
                'content-type': "application/json"
            },
            body: JSON.stringify({mobile_number: this.state.mobile_number, password: this.state.password})
        })
            .then( res => {
                if(!res.ok){
                    return res.json().then( e => Promise.reject(e));
                };
                console.log(res)
                return res.json();
            })
            .then( resData => {
                console.log(resData)
                TokenService.saveToken(resData.token);
                this.context.refreshPage();
                this.props.history.push("/user")
            })
            .catch( err => this.setState({ error: err.error}));
    };

    render(){
        
        return (
            <section id="login-section">
                <form id="login-form" onSubmit={this.handleSubmit}>
                    <fieldset id="login-fieldset">
                        <label htmlFor="login-mobile-number">
                            Mobile number
                            <MuiPhoneNumber 
                            id="login-mobile-number"
                            inputClass="login-mobile-number"
                            defaultCountry={"us"}
                            countryCodeEditable={false}
                            onChange={this.handleMobileNumber}
                            disableDropdown={true}
                            />
                        </label>
                        

                        <label htmlFor="login-password">
                            Password
                        </label>
                        <input 
                                id="login-password" 
                                type="password"
                                name="password"
                                onChange={this.handleInput}
                                required></input>

                        {this.state.error ? <p>{this.state.error}</p> : ""}
                        <button type="submit">Log In</button>
                    </fieldset>
                </form>
                <p>
                    Don't have an account? Sign up
                    <Link to="/register"> here</Link>
                </p>
            </section>
        );
    };
};