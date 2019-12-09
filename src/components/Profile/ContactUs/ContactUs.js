import React from "react";
import "./ContactUs.css";
import UserContext from "../../../Contexts/UserContext/UserContext";
import TokenService from "../../../TokenService/TokenService";

export default class ContactUs extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            comments: "",
            emailSent: false,
            error: ""
        }
    }

    static contextType = UserContext;

    renderForm = () => {
        return (
            <form id="user-contact-form" onSubmit={this.sendEmail}>
                <fieldset id="user-contact-fieldset">

                    <h4>We are happy to help</h4>

                    <label htmlFor="user-comment">
                        What can we help you with?
                    </label>
                    <textarea 
                        id="user-comment"
                        placeholder="How can we help you?"
                        onChange={this.handleComments}></textarea>

                    <button type="submit">Send</button>
                </fieldset>
            </form>
        );
    };

    handleComments = (e) => {
        this.setState({ comments: e.target.value})
    }; 

    sendEmail = (e) => {
        e.preventDefault();

        fetch(`http://localhost:8000/api/contact/${this.context.id}`, {
            method: "POST",
            headers: {
                'content-type': "application/json",
                'authorization': `bearer ${TokenService.getToken()}`
            },
            body: JSON.stringify({
                comments: this.state.comments
            })
        })
            .then( res => {
                if(!res.ok){
                    return res.json().then( e => Promise.reject(e));
                };

                return res.json();
            })
            .then( resData => {
                this.setState({ emailSent: true});
            })
            .catch( err => this.setState({ error: err.error}));
    }

    render(){
        return (
            <section id="user-contact-us">
                <h2>Contact us</h2>
                <section id="user-contact-info">
                    <strong>Julis Cleaning Service</strong>
                    <br/>
                    <p>2 Madison ave</p>
                    <p>Amityville, NY 11701</p>
                    <br/>
                    <p>(631) 526-3306</p> 
                </section>

                <section id="user-contact-section">
                    <p>Any questions or want to provide feedback? Send us an email and we will get back to you as soon as possible!</p>
                    {this.state.emailSent ? <p><strong>Thank you for reaching out to us. We will contact you as soon as possible!</strong></p> : this.renderForm()}
                </section>
            </section>
        );
    };
};