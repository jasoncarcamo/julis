import React from "react";
import TokenService from "../../TokenService/TokenService";
import {Elements, StripeProvider} from "react-stripe-elements";
import CheckoutForm from "./CheckoutForm";
import "./Checkout.css";


export default class Checkout extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        };
    };

    componentDidMount(){
        if(TokenService.hasToken()){
            console.log("Has token");
        };
    };

    render(){
        return(
            <section>
                <CheckoutForm history={this.props.history}/>
            </section>
        )
    }
}