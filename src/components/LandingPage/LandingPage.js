import React from "react";
import "./first-section.css";
import "./landingpage.css";
import "./second-section.css";
import {Link} from "react-router-dom";

export default class LandingPage extends React.Component{

    redirectToServices = () => {
        this.props.history.push("/services");
    }

    render(){
        return (
            <section id="landing-page">

                <section className="first-section">
                    <h2>Quality Service at an Affordable Price</h2>
                    <p>No mess is too big for us!</p>

                    <button className="request-service" onClick={this.redirectToServices}> Get started</button>
                </section>

                <section className="second-section">

                    <ul>
                        <li>No contracts</li>
                        <li>Our chemicals are non-hazardous to humans, the environment and your pets</li>
                        <li>We help you maintain a clean and clutter free environment</li>
                        <li>Easy and quick appointment setups</li>
                        <li>We strive to gain your loyalty so you can worry about important things</li>
                    </ul>

                    <p>From deep cleaning your kitchen and bathrooms to changing your bed linens, we are dedicated to creating clean, and safe living environments.</p>

                    <p>We are proud to use environmentally-conscious products that are safe for people and pets.</p>

                    <button className="request-service" onClick={this.redirectToServices}> Get started</button>
                    
                </section>

            </section>
        );
    }
}