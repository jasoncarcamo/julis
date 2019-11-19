import React from "react";
import "./first-section.css";
import {Link} from "react-router-dom";

export default class LandingPage extends React.Component{
    render(){
        return (
            <section id="landing-page">
                <section className="first-section">
                    <h2>Julis Cleaning Service</h2>
                    <p></p>
                    <Link className="request-service" to="/Services">Request Service</Link>
                </section>
            </section>
        );
    }
}