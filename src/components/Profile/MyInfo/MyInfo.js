import React from "react";
import UserContext from "../../../Contexts/UserContext/UserContext";
import "./MyInfo.css";
import TokenService from "../../../TokenService/TokenService";

export default class MyInfo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user: {

            },
            password: "",
            confirmPassword: "",
            resetPassword: false,
            resetSuccess: "",
            error: ""
        };
    };

    static contextType = UserContext;

    componentDidMount(){
        this.setState({user: this.context});
    }

    handlePasswordreset = (e)=> {
        e.preventDefault();

        fetch("http://localhost:8000/api/reset", {
            method: "POST",
            headers: {
                'content-type': "application/json",
                'authorization': `bearer ${TokenService.getToken()}`
            },
            body: JSON.stringify({
                newPassword: this.state.password,
                confirmPassword: this.state.confirmPassword
            })
        })
            .then( res => {
                if(!res.ok){
                    return res.json().then( e => Promise.reject(e));
                };

                return res.json();
            })
            .then( resData => {
                console.log(resData);
                this.setState({ resetSuccess: resData.success});
            })
            .catch( err => {
                console.log(err)
                return this.setState({ error: err.error})
            });
    }

    renderNewPasswordForm = () => {
        return (
            <form onSubmit={this.handlePasswordreset}>
                <fieldset id="rest-password-fieldset">
                    <label>
                        New password
                    </label>
                    <input type="password" onChange={this.handleNewPassword} value={this.state.password}></input>
                    {this.validatePassword(this.state.password)}

                    <label>
                        Confirm new password
                    </label>
                    <input type="password" onChange={this.handleConfirmPassword} value={this.state.confirmPassword}></input>
                    {this.handlePasswordMatch()}

                    {this.state.error ? <p>{this.state.error}</p> : ""}

                    <button type="submit">Ok</button>
                    <button onClick={this.handleResetButton}>Cancel</button>

                </fieldset>
            </form>
        );
    };

    handleResetButton = () => {
        this.setState({ 
            resetPassword: !this.state.resetPassword,
            resetSuccess: ""
        })
    }

    handleNewPassword = (e)=>{
        this.setState({ password: e.target.value });
    }

    handleConfirmPassword = (e) => {
        this.setState({ confirmPassword: e.target.value });
    }

    handleOkConfirm = () => {
        this.setState({
            password: "",
            confirmPassword: "",
            resetPassword: false,
            resetSuccess: "",
            error: ""
        });
    }

    validatePassword = (password) => {
        const REGEX_UPPER_LOWER_NUMBER_SPECIAL = (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])[\S]+/);

        if (password.length < 8) {
          return <span className="reg_error" style={{color: 'red'}}>Password must be longer than 8 characters</span>
        }
        if (password.length > 72) {
          return <span className="reg_error" style={{color: 'orange'}}>Password must be less than 72 characters</span>
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
          return <span className="reg_error" style={{color: 'orange'}}>Password must not start or end with empty spaces</span>
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
          return <span className="reg_error" style={{color: 'orange'}}>Password must contain one upper case, lower case, number and special character</span>
        }
        return <span className="reg_error" style={{color: 'green'}}>Looking good!</span>
      }

      handlePasswordMatch = ()=>{
        
        if(this.state.password.length > 6 && this.state.confirmPassword.length > 5 && this.state.password === this.state.confirmPassword){
            return (<span className="reg_error" style={{color: 'green'}}>Passwords match!</span>);
        };

        if(this.state.password.length > 6 && this.state.confirmPassword.length > 5 && this.state.password !== this.state.confirmPassword){
            return (<span className="reg_error" style={{color: 'red'}}>Passwords do not match.</span>);
        }

        if(this.state.password.length < 6 && this.state.confirmPassword.length < 5){
            return "";
        };
    
    }

    
    render(){
        const userAddress = (
            <>
                <p>
                    {this.context.house_number} {this.context.apartment_number} {this.context.street_name}
                </p>
                <p>
                    {this.context.city}, {this.context.state} {this.context.zip_code}
                </p>
            </>
            );
        console.log(this.state)
        return (
            <section id="my-info-section">
                <h2>My info</h2>

                <section id="address-section">
                    <h3>Address</h3>
                    {userAddress}
                    <button>Edit</button>
                </section>

                <section id="rest-password-section">
                    <h3>Password</h3>
                    <p>Would you like to reset your password?</p>

                    {this.state.resetSuccess ? <p><strong>{this.state.resetSuccess}</strong></p> : ""}
                    {
                        this.state.resetPassword && !this.state.resetSuccess
                            ? 
                            this.renderNewPasswordForm() 
                            : 
                            ""
                    }

                    {!this.state.resetPassword ? <button onClick={this.handleResetButton}>Reset</button> 
                    : ""}

                    {this.state.resetSuccess ? <button onClick={this.handleOkConfirm}>Ok</button> : ""}
                </section>
            </section>
        );
    };
};