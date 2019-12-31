import React from "react";
import "./landingpage.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome} from "@fortawesome/free-solid-svg-icons";

export default class LandingPage extends React.Component{

    redirectToServices = () => {
        this.props.history.push("/services");
    };

    render(){
        return (
            <section id="landing-page">
                
                <section id="first-section">
                    <section>
                        <p>We know many people do not have the energy or motivation to clean their home after a long day at work or after a party. That is why we offer services that work with your budget, cleaning preferences, and busy lifestyle, so you can focus on the essential things in life. Our friendly professionals strive to earn your loyalty each time we clean by exceeding your expectations. Whether you are looking to request services one time or create a routine cleaning plan, you will never have to worry about signing a contract.</p>

                        <section>

                            <p>We Are Proud To Use Environmentally-Conscious Products That Are Safe For People And Pets.</p>
                            
                            <a href="tel:6315263306">(631) 526 - 3306</a>
                        </section>
                    </section>
                </section>

                <section id="second-section">
                    <p>Let Us Work While You Unwind</p>

                    <section >
                        <ul>
                            <li>

                                <p>Residential Services</p>
                            </li>

                            <li>

                                <p>Commercial Services</p>
                            </li>

                            <li>

                                <p>Customizable Services</p>
                            </li>
                        </ul>

                        <section>
                            <p className="pitch-header">
                            Do You Wish You Had More Free Time? We Can Make It Happen!
                            </p>

                            <p className="pitch">
                            Our experts provide detailed cleaning services for our valued customers, designed to keep your property looking its best all year round. We offer different cleaning frequencies according to your needs and preferences, including every week, every two weeks, every three weeks, every four weeks, monthly, and occasional or one-time cleans.
                            </p>

                            <p className="pitch-header">What Makes The Cleaning Authority Different?</p>

                            <p className="pitch">We are an eco-friendly company, committed to protecting the environment with sustainable cleaning materials. We are one of the only cleaning companies to use only environmentally responsible or sustainable cleaning products. In addition, we use a thorough Detail-Clean Rotation System to ensure that your home looks good all the time.</p>

                            <button className="to-services-btn"
                            onClick={this.redirectToServices}>Book In Only 60 Seconds</button>
                        </section>
                    </section>
                </section>

                <section id="third-section">
                    <section className="third-1sect">
                    </section>

                    <section className="third-2sect">
                        <p>Treat Yourself To A Clean Healthy Home</p>

                        <ul>
                            <li>We are proud to use environmentally-conscious products that are safe for people and pets.</li>

                            <li>No contracts</li>

                            <li>We help you maintain a clean and clutter free environment</li>

                            <li>Easy and quick appointment setups</li>

                            <li>We strive to gain your loyalty so you can worry about important things</li>
                        </ul>
                    </section>
                </section>

                <section id="fourth-section">
                    <p>Avail Our services In The Following Areas</p>
                    <ul className="fourth-1sect">
                        <li>
                            <h5>Residential</h5>
                            <p>We offer complete residential cleaning services. From daily, weekly, or monthly programs. Allow us to customize a plan to suit your individual needs. Simple dusting, deep cleaning, laundry services, carpet shampooing, and more. Call us today for a Free Consultation</p>
                        </li>

                        <li>
                            <h5>Commercial</h5>

                            <p>Need to "Spruce" up before the Investors arrive? Daily, and weekly services available, including: Snack room supplies, presentation setup services, and more. Ask for a Commercial Consultation today.</p>
                        </li>

                        <li>
                            <h5>Pre-Sale</h5>

                            <p>Selling your home? Let our experts make your home super clean before thepotential home buyer even arives. We offer deep cleaning and decluttering, staging and more. Call Today for a consultation.</p>
                        </li>

                        <li>
                            <h5>Construction-Clean Up</h5>

                            <p>As Contractors, you make your customer's renovation beautiful, but let's face it. Dust winds up everywhere, on every level, in every nook and cranny. Let us polish off your job so your customers are left with a positive lasting impression.</p>
                        </li>
                    </ul>
                </section>

                <section id="fifth-section">
                    <p>Schedule Your Cleaning Now & Get A Free Estimate</p>

                    <a href="tel:+1631-526-3306" className="to-services-btn2">Call now</a>
                </section>

            </section>
        )
    }
}