import React from "react";
import "./ContactUs.css";

export default class ContactUs extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            textArea: ""
        }
    }

    handleTextArea = (e) => {
        this.setState({ textArea: e.target.value})
    }
    render(){
        return (
            <section id="user-contact-us">
                <h2>Contact us</h2>
                <section id="user-contact-info">
                    <p>
                        <strong>Julis Cleaning Service</strong>
                        <br/>
                        The address goes here
                        <br/>
                        (631) 526-3306
                    </p>  
                </section>

                <section id="user-contact-section">
                    <p>Any questions or want to provide feedback? Send us an email and we will get back to you as soon as possible!</p>
                    <form id="user-contact-form">
                        <fieldset id="user-contact-fieldset">

                            <h4>We are happy to help</h4>

                            <label htmlFor="user-comment">
                                What can we help you with?
                            </label>
                            <textarea id="user-comment"></textarea>

                            <button>Send</button>
                        </fieldset>
                    </form>
                </section>
            </section>
        );
    };
};