import React from "react";
import {Link} from "react-router-dom";
import "./about.css";

export default class About extends React.Component{
    render(){
        return (
            <section id="about-section">
                
                <p>We are a locally family-owned business that has begun creating an impact in the cleaning service industry since 2010</p>
                
                <p>We know many people do not have the energy or motivation of cleaning their home after a long day at work or after a party. That is why we offer services that work with your budget, cleaning preferences, and busy lifestyle, so you can focus on the important things in life. Our friendly professionals strive to earn your loyalty each time we clean by exceeding your expectation. Whether you are looking to request services one time or create a routine cleaning plan, you will never have to worry about signing a contract.</p>

                <p>Setting up an appointment is quick and easy. Get started <Link to="/services">here</Link>.</p> 

                <section id="contact-us-info">
                    <p>
                        <strong>Julis Cleaning Service</strong>
                        <br/>
                        The address goes here
                        <br/>
                        (631) 526-3306
                    </p>    
                </section>       

                <section id="contact-us-section">

                    <h4>We are happy to help! Email us</h4>

                    <form id="contact-us-form">
                        <fieldset id="contact-us-fieldset">
                            <label htmlFor="about-first-name">
                                First name
                            </label>
                            <input id="about-first-name" type="text"></input>

                            <label htmlFor="about-last-name">
                                Last name
                            </label>
                            <input id="about-last-name" type="text"></input>

                            <label htmlFor="about-email">
                                Email
                            </label>
                            <input id="about-email" type="email"></input>

                            <label htmlFor="about-comment">
                                Comments
                            </label>
                            <textarea id="about-comment" placeholder="Qestions or feedback?"></textarea>

                            <button>Send</button>
                        </fieldset>
                    </form>
                </section>
            </section>
        );
    };
};