import React from "react";
import "./first-section.css";
import {Link} from "react-router-dom";

export default class LandingPage extends React.Component{
    render(){
        return (
            <section id="landing-page">
                <section className="first-section">
                    <h2>Residential cleaning</h2>
                    <p>No mess is too big for us!</p>
                    <Link className="request-service" to="/services">Request Services</Link>
                </section>
            </section>
        );
    }
}