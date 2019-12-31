import React from "react";
import UserContext from "../../../../Contexts/UserContext/UserContext";
import "./EditForm.css";
import TokenService from "../../../../TokenService/TokenService";

export default class EditAddressForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            house_number: "", 
            apartment_number: "", 
            street_name: "", 
            city: "", 
            state: "", 
            zip_code: "",
            resetAddress: false,
            resetSuccess: "",
            error: ""
        };
    };

    static contextType = UserContext;

    handleResetAddressBtn = ()=> {
        this.setState({ resetAddress: !this.state.resetAddress });
    }

    handleEditConfirm = () => {
        this.setState({
            house_number: "", 
            apartment_number: "", 
            street_name: "", 
            city: "", 
            state: "", 
            zip_code: "",
            resetAddress: false,
            resetSuccess: "",
            error: ""
        })
    }

    handleEditForm = (e) => {
        e.preventDefault();

        return fetch('https://nameless-beach-67218.herokuapp.com/api/user', {
            method: "PATCH",
            headers: {
                'content-type': "application/json",
                'authorization': `bearer ${TokenService.getToken()}`
            },
            body: JSON.stringify({
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
                    return res.json().then( e => Promise.reject(e));
                };

                return res.json();
            })
            .then( resData => {
                
                this.setState({ resetAddress: !this.state.resetAddress, resetSuccess: "Your address has been changed"})
                this.context.refreshUserInfo();
            })
            .catch( err => this.setState({ error: err.error}))

    }

    handleHouseNumber = (e) => {
        this.setState({ house_number: e.target.value })
    }

    handleApartmentNumber = (e) => {
        this.setState({ apartment_number: e.target.value })
    }

    handleStreet = (e) => {
        this.setState({ street_name: e.target.value })
    }

    handleCity = (e) => {
        this.setState({ city: e.target.value })
    }

    handleState = (e) => {
        this.setState({ state: e.target.value })
    }

    handleZipCode = (e) => {
        this.setState({ zip_code: e.target.value })
    }
    
    render(){
        return (
            <section>
                {this.state.resetAddress 
                    ? 
                    <form onSubmit={this.handleEditForm}>
                        <fieldset id="edit-address-fieldset">
                            <label htmlFor="edit-house-number">
                                * House number
                            </label>
                            <input 
                                type="text" 
                                id="edit-house-number"
                                onChange={this.handleHouseNumber}
                                value={this.state.house_number}
                                required></input>

                            <label htmlFor="edit-apartment-number">
                                * Apartment number
                            </label>
                            <input 
                                type="text" 
                                id="edit-apartment-number" 
                                onChange={this.handleApartmentNumber}
                                value={this.state.apartment_number}
                                placeholder="If applicable"
                                ></input>

                            <label htmlFor="edit-street-name">
                                * Street
                            </label>
                            <input 
                                type="text" 
                                id="edit-street-name" 
                                onChange={this.handleStreet}
                                value={this.state.street_name}
                                required></input>

                            <label htmlFor="edit-city-name">
                                * City
                            </label>
                            <input 
                                type="text" 
                                id="edit-city-name" 
                                onChange={this.handleCity}
                                value={this.state.city}
                                required></input>

                            <label htmlFor="edit-state-name">
                                * State
                            </label>
                            <input 
                                type="text" 
                                id="edit-state-name" 
                                onChange={this.handleState}
                                value={this.state.state}
                                required></input>

                            <label htmlFor="edit-zip-code">
                                * Zip code
                            </label>
                            <input 
                                type="text" 
                                id="edit-zip-code" 
                                onChange={this.handleZipCode}
                                value={this.state.zip_code}
                                required></input>

                            <button type="submit">I am sure</button>
                        </fieldset>
                    </form>
                    :

                    ""
                }

                    <>
                        {this.state.resetSuccess 
                            ?
                            <>
                                <p>{this.state.resetSuccess}</p>
                                <button onClick={this.handleEditConfirm}>Ok</button>
                            </>
                            :
                            <>
                                {!this.state.resetAddress ? <button onClick={this.handleResetAddressBtn}>Edit</button> : <button    onClick={this.handleResetAddressBtn}>Cancel</button>
                        }
                            </>
                        }
                    </>
            </section>
            
        )
    };
};