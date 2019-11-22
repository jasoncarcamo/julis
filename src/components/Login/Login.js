import React from "react";
import TokenService from "../../TokenService/TokenService";

export default class extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            mobile_number: "",
            password: "",
            error: ""
        };
    };

    componentDidMount(){
    }

    handleInput = (e)=>{
        e.preventDefault();

        this.setState({ [e.target.name]: e.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:8000/api/login", {
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

                return res.json();
            })
            .then( resData => {
                TokenService.saveToken(resData.token);
                this.props.history.push("/user")
            })
            .catch( err => this.setState({ error: err.error}));
    };

    render(){
        console.log(this.state)
        return (
            <section id="login-section">
                <form id="login-form" onSubmit={this.handleSubmit}>
                    <fieldset id="login-fieldset">
                        <label htmlFor="login-mobile-number">
                            Mobile number
                            <input 
                                type="text" 
                                id="login-mobile-number" 
                                name="mobile_number"
                                onChange={this.handleInput}
                                required></input>
                        </label>

                        <label htmlFor="login-password">
                            Password
                            <input 
                                id="login-password" 
                                type="password"
                                name="password"
                                onChange={this.handleInput}
                                required></input>
                        </label>
                        {this.state.error ? <p>{this.state.error}</p> : ""}
                        <button type="submit">Log In</button>
                    </fieldset>
                </form>
            </section>
        );
    };
};