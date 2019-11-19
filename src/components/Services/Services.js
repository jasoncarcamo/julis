import React from "react";
import "./initial-pck.css";
import "./custom-pck.css";
import {Link} from "react-router-dom";

export default class Services extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            services: [
                {
                    service: "Bed rooms",
                    price: 20
                },
                {
                    service: "Living room",
                    price: 35
                },
                {
                    service: "Den",
                    price: 25
                },
                {
                    service: "Kitchen",
                    price: 25
                },
                {
                    service: "Bathroom",
                    price: 20
                },
                {
                    service: "Basement",
                    price: 40
                },
                {
                    service: "Dining room",
                    price: 20
                },
                {
                    service: "Glass doors / Windows",
                    price: 10
                }
            ],
            details: [
                "Sweep and mop",
                "Vacuum",
                "Organize",
                "Molding"
            ],
            service: [],
            detail: [],
            price: 0.00,
            confirm: false
        };
    };

    addService = (e) => {
        let service = this.state.service;
        let price = this.state.price;

        if(e.target.checked){
            let newService = {
                service: e.target.name,
                price: Number(e.target.value)
            };

            service.push(newService);
            price += newService.price;
        } else{
            let removeService = {
                service: e.target.name,
                price: Number(e.target.value)
            };

            let serviceIndex = service.indexOf(removeService);

            service.splice(serviceIndex, 1);
            price -= removeService.price;
        };
        
        this.setState({service, price});
    };    

    renderServices = () => {
        
        let services = this.state.services;

        services.sort();
        
        services = services.map( (service, index) => {
            return (
                <li key={index} className="list-group-item">
                    <label htmlFor={service.service}>
                        <input className="service-checkboxes" onChange={this.addService} name={service.service} value={service.price} type="checkbox"/>
                        {service.service}
                    </label>
                </li>);
        });

        return services;
    };

    render(){
        return (
            <section className="text-center">
                <section className="initial-pck">
                    <h2 className="display-4">Our Initial cleaning</h2>
                    <h5>* Includes:</h5>

                    <ul className="list-group">
                        <li>Cabinets</li>
                        <li>Fridge</li>
                        <li>Oven</li>
                        <li>Glassdoor / Windows</li>
                    </ul>

                    <p>$90.00</p>
                    <Link to="Services/Confirm" className="info-btn">Request</Link>
                </section>

                <section className="custom-pck">
                    <h4>Custom choose</h4>

                    <ul className="list-group">
                        {this.renderServices()}
                    </ul>
                    <p id="custom-price">${this.state.price}</p>
                    <button id="custom-confirm-btn">Continue</button>
                </section>
            </section>
        );
    }
}