import React from "react";
import "./register.css";
import TokenService from "../../TokenService/TokenService";
import RequestsContext from "../../Contexts/RequestsContext/RequestsContext";
import {Link} from "react-router-dom";
import MuiPhoneNumber from "material-ui-phone-number";

export default class Register extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            first_name: "", 
            last_name: "", 
            email: "", 
            mobile_number: "",
            password: "", 
            confirm_password: "",
            house_number: "", 
            apartment_number: "", 
            street_name: "", 
            city: "", 
            state: "", 
            zip_code: "",
            error: ""
        };
    };

    static contextType = RequestsContext;

    renderInputs = () => {

        let inputNames = this.state;
        let inputList = [];
        let index = -1;
        let targetName = [];

        for(const [key, value] of Object.entries(inputNames)){

            index++;
            targetName[index] = key;

            //Before creating the input name list
            let name = key.split("_");
            
            name = name.join(" ");
            name = name.charAt(0).toUpperCase() + name.slice(1);

            if(name === "Error"){
                continue;
            };

            inputList[index] = name;
        }

        inputList = inputList.map( (name, index) => {
            return (
                
                <label 
                    key={index} 
                    htmlFor={`register_${targetName[index]}`}>
                    * {name}
                    {name === "Password" || name === "Confirm password"
                        ? 
                    (
                        <>
                            <input 
                                type="password" 
                                id={`register_${targetName[index]}`}
                                name={targetName[index]}
                                onChange={this.handleUserInputs} required/>
                            {name === "Password" 
                                ? 
                                this.validatePassword(this.state.password) 
                                :
                                name === "Confirm password"
                                ?
                                this.handlePasswordMatch()
                                :
                                ""
                            } 
                        </>
                    )
                        : 
                    name === "Mobile number"
                        ?
                        <MuiPhoneNumber 
                            defaultCountry={"us"}
                            countryCodeEditable={false}
                            onChange={this.handleMobileNumber}
                            disableDropdown={true}
                            inputClass="register-mobile-number"
                            required/>
                        :
                    name === "Apartment number"
                        ?
                        <input 
                            type="text" 
                            id={`register_${targetName[index]}`} 
                            name={targetName[index]}
                            onChange={this.handleUserInputs}
                            placeholder="If applicable"/>

                            :
                            <input 
                                type="text" 
                                id={`register_${targetName[index]}`} 
                                name={targetName[index]}
                                onChange={this.handleUserInputs}
                                placeholder={name}
                                required/>
                        }
                </label>
                
            );
        });

        console.log(inputList)

        return inputList;

    }

    handleMobileNumber = (value) => {
        console.log(value)
        this.setState({
            mobile_number: value
        })
    }

    handleUserInputs = (e) => {
        e.preventDefault();
        console.log(e.target.name);
        this.setState({ [e.target.name]: e.target.value});

    }

    handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:8000/api/register", {
            method: "POST",
            headers: {
                'content-type': "application/json"
            },
            body: JSON.stringify({
                first_name: this.state.first_name, 
                last_name: this.state.last_name, 
                email: this.state.email, 
                mobile_number: this.state.mobile_number,
                password: this.state.password, 
                house_number: this.state.house_number, 
                apartment_number: this.state.apartment_number, 
                street_name: this.state.street_name, 
                city: this.state.city, 
                state: this.state.state, 
                zip_code: this.state.zip_code
            })
        })
            .then( res => {
                if(!res.ok){
                    return res.json().then(e=> Promise.reject(e));
                };

                return res.json();
            })
            .then( resData => {

                TokenService.saveToken(resData.token)
                this.context.refreshPage();
                this.context.newService(resData.id);
                this.props.history.push("/user");

            })
            .catch( err => this.setState({ error: err.error}))
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
        
        if(this.state.password.length > 6 && this.state.confirm_password.length > 5 && this.state.password === this.state.confirm_password){
            return (<span className="reg_error" style={{color: 'green'}}>Passwords match!</span>);
        };

        if(this.state.password.length > 6 && this.state.confirm_password.length > 5 && this.state.password !== this.state.confirm_password){
            return (<span className="reg_error" style={{color: 'red'}}>Passwords do not match.</span>);
        }

        if(this.state.password.length < 6 && this.state.confirm_password.length < 5){
            return "";
        };
    
    }

    render(){

        console.log(this.state.mobile_number);

        return (
            <section id="register-section">
                <p>
                    Already have an account? 
                    <Link to="/login"> Log In</Link>
                </p>
                <form id="register-form" onSubmit={this.handleSubmit}>
                    <fieldset id="register-fieldset">
                        <div>
                            {this.renderInputs()}
                        </div>
                        {this.state.error ? <p>{this.state.error}</p> : ""}
                        <button type="submit">Sign up</button>
                    </fieldset>
                </form>
            </section>
        );
    };
};