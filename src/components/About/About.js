import React from "react";
import {Link} from "react-router-dom";
import "./about.css";

export default class About extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            comments: "",
            emailSent: false,
            error: ""
        };
    };

    handleFirstName = (e)=> {
        this.setState({ first_name: e.target.value });
    };

    handleLastName = (e)=>{
        this.setState({ last_name: e.target.value });
    };

    handleEmail = (e)=> {
        this.setState({ email: e.target.value })
    };

    handleComment = (e)=> {
        this.setState({ comments: e.target.value})
    };

    renderContactForm = () => {
        return (
            <form id="contact-us-form" onSubmit={this.sendEmail}>

                

                <fieldset id="contact-us-fieldset">

                    <p>Email us</p>

                    <label htmlFor="about-first-name">
                        First name
                    </label>
                    <input 
                        id="about-first-name" 
                        type="text"
                        onChange={this.handleFirstName}
                        required></input>

                    <label htmlFor="about-last-name">
                        Last name
                    </label>
                    <input 
                        id="about-last-name" 
                        type="text"
                        onChange={this.handleLastName}
                        required></input>

                    <label htmlFor="about-email">
                        Email
                    </label>
                    <input 
                        id="about-email" 
                        type="email"
                        onChange={this.handleEmail}
                        required></input>

                    <label htmlFor="about-comment">
                        Comments
                    </label>
                    <textarea 
                        id="about-comment" 
                        placeholder="Questions or feedback?"
                        onChange={this.handleComment}
                        required></textarea>

                    <button type="submit">Send</button>
                </fieldset>
            </form>
        );
    };

    sendEmail = (e) => {
        e.preventDefault();

        fetch("http://localhost:8000/api/contact", {
            method: "POST",
            headers: {
                'content-type': "application/json"
            },
            body: JSON.stringify({
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
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
                
                this.setState({ emailSent: true });

            })
            .catch( err => this.setState({ error: err.error}))
    }

    render(){
        
        return (
            <section id="about-section">
                
                <p>We are a locally family-owned business that has begun creating an impact in the cleaning service industry since 2017</p>
                
                <p>We know many people do not have the energy or motivation of cleaning their home after a long day at work or after a party. That is why we offer services that work with your budget, cleaning preferences, and busy lifestyle, so you can focus on the important things in life. Our friendly professionals strive to earn your loyalty each time we clean by exceeding your expectation. Whether you are looking to request services one time or create a routine cleaning plan, you will never have to worry about signing a contract.</p>

                <p>Setting up an appointment is easy and quick. Get started <Link to="/services">here</Link>.</p> 

                <section id="contact-us-info">
                    <p><strong>Julis Cleaning Service</strong></p>
                    
                    <p>2 Madison ave</p>
                    <p>Amityville, NY 11701</p>
                    
                    <p>(631) 526-3306   </p>
                </section>       

                <section id="contact-us-section">

                    {this.state.emailSent ? <p>Thank you for reaching out to us. We will contact you as soon as possible!</p> : this.renderContactForm()}

                    <ul id="contact-us-container">
                        <li className="contact-us-list">
                            <p>Saves Your Time</p>
                        </li>

                        <li className="contact-us-list">
                            <p>Seamless Communication</p>
                        </li>

                        <li className="contact-us-list">
                            <p>Cash Free Payment</p>
                        </li>
                    </ul>
                </section>

            </section>
        );
    };
};