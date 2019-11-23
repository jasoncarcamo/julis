import React from "react";
import "./register.css";
import TokenService from "../../TokenService/TokenService";

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

    renderInputs = () => {
        let inputNames = this.state;
        let inputList = [];
        let index = -1;
        let targetName = [];

        for(const [key, value] of Object.entries(inputNames)){

            index++;
            targetName[index] = key;
            //Before creating the input name list
            //

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
                    {name}
                    {name === "Password" || name === "Confirm password"
                        ? 
                    <input 
                        type="password" 
                        id={`register_${targetName[index]}`}
                        name={targetName[index]}
                        onChange={this.handleUserInputs} required/> 
                        : 
                    name === "Apartment number"
                        ?
                        <input 
                            type="text" 
                            id={`register_${targetName[index]}`} 
                            name={targetName[index]}
                            onChange={this.handleUserInputs}/>

                            :
                            <input 
                                type="text" 
                                id={`register_${targetName[index]}`} 
                                name={targetName[index]}
                                onChange={this.handleUserInputs} required/>
                        }
                </label>
                
            );
        });

        console.log(inputList)

        return inputList;

    }

    handleUserInputs = (e) => {
        e.preventDefault();
        console.log(e.target.name)
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

                TokenService.saveToken(resData.token);

                this.props.history.push("/services/checkout");

            })
            .catch( err => this.setState({ error: err.error}))
    }

    render(){

        console.log(this.state);

        return (
            <section id="register-section">
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