import React from "react";
import "./CheckoutForm.css";
import {
    CardElement, 
    CardNumberElement, 
    injectStripe,
    CardExpiryElement,
    CardCVCElement
} from "react-stripe-elements";
import RequestContext from "../../Contexts/RequestsContext/RequestsContext";

const createOptions = () => {
    return {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          fontFamily: 'Open Sans, sans-serif',
          letterSpacing: '0.025em',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#c23d4b',
        },
      }
    }
  };

class CheckoutForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            complete: false,
            error: ""
        };
    };

    static contextType = RequestContext;

    handleSubmit = async (e) => {
        e.preventDefault();

        let stripe = await this.props.stripe.createToken({name: "Name"});
        console.log(stripe)
        if(stripe.error){
            return this.setState({ error: stripe.error.message})
        }

        try{
            let response = await fetch("http://localhost:8000/api/charge",{
                method: "POST",
                headers: {
                    'content-type': "application/json",
                },
                body: JSON.stringify({token: stripe.token.id})
            });

            if(!response.ok){
                return response.json().then( e => Promise.reject(e));
            };

            let responseData = await response.json();

            if(responseData){
                console.log("Success", responseData)
                this.context.completeRequests();
                this.setState({ complete: true});
            }
            console.log(response);

        } catch(err){
            this.setState({error: err});
        };

    };

    renderInputs = () => {
        if(this.context.requests){
            if(this.context.requests.length > 0){
                return (
                    <form id="checkout-form" >
                        <fieldset id="checkout-fieldset">
                            
                            <label>
                                Card number
                                <CardNumberElement {...createOptions()}/>
                            </label>
        
                            <label>
                                Expiration date
                                <CardExpiryElement {...createOptions()}/>
                            </label>
        
                            <label>
                                CVC
                                <CardCVCElement {...createOptions}/>
                            </label>
        
                            <label>
                                Zip code
                                <input type="text" className="stripeElement"></input>
                            </label>
                            {this.state.error ? this.state.error : ""}
                            <button type="button" onClick={this.handleSubmit}>Go</button>
                            
                        </fieldset>
                    </form>
                );
            } else {
                return <p>No requests have been chosen</p>;
            }
        } else{
            return <p>No requests have been chosen.</p>;
        }
    };

    renderComplete = () => {
        return (
            <section>
                <p>Requests have been processed.</p>
                <button onClick={()=> this.props.history.push("/")}>Ok</button>
            </section>
        );
    };

    render(){
        console.log(this.state.error);
        return (
            <section id="checkout-section">
                {!this.state.complete ? this.renderInputs() : this.renderComplete()}
            </section>
        );
    };
};

export default injectStripe(CheckoutForm);