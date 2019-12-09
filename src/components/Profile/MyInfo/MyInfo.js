import React from "react";
import UserContext from "../../../Contexts/UserContext/UserContext";
import "./MyInfo.css";

export default class MyInfo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user: {

            },
            resetPassword: false,

        };
    };

    static contextType = UserContext;

    componentDidMount(){
        this.setState({user: this.context});
    }

    renderNewPasswordForm = () => {
        return (
            <form>
                <fieldset>
                    <label>
                        New password
                        <input type="password"></input>
                    </label>

                    <label>
                        Confirm new password
                        <input type="password"></input>
                    </label>

                    <button type="submit">Ok</button>
                    <button>Cancel</button>

                </fieldset>
            </form>
        );
    };

    
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
                    <button>Reset</button>
                    {this.state.resetPassword ? this.renderNewPasswordForm() : ""}
                </section>
            </section>
        );
    };
};