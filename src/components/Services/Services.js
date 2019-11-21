import React from "react";
import "./initial-pck.css";
import "./custom-pck.css";
import {Link, Route} from "react-router-dom";
import RequestsContext from "../../Contexts/RequestsContext./RequestsContext";

export default class Services extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            services: [],
            requests: [],
            price: 0.00,
            confirm: false
        };
    };

    static contextType = RequestsContext;

    componentDidMount(){

        let services = document.getElementsByClassName("service-checkboxes");
        
        fetch("http://localhost:8000/api/services")
            .then( res => {
                if(!res.ok){
                    return res.json().then( e=> Promise.reject(e));
                };

                return res.json();
            })
            .then( resData => {
                this.setState({ services: resData.services});

                if(this.context.requests){

                    const requests = this.context.requests;
                    console.log(requests)
                    for(let i = 0; i < services.length; i++){
                        for(let j = 0; j < requests.length; j++){
                            if(services[i].name == requests[j].service){
                                console.log(true)
                                services[i].checked = true;
                            };
                        };
                   };
        
                    this.setState({ requests: this.context.requests});
        
                };   
            });
  
    };

    updateServices = (e) => {

        let service = this.state.requests;
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
        this.context.updateServices(service, price);
        this.setState({ requests: service, price});
    };    

    renderServices = () => {
        
        let services = this.state.services;

        services.sort( (a, b) => (a.service > b.service) ? 1: (a.service < b.service) ? -1 : 0 );
        
        services = services.map( (service, index) => {
            return (
                <li key={index} className="list-group-item">
                    <label htmlFor={service.service}>
                        <input className="service-checkboxes" onChange={this.updateServices} name={service.service} value={service.price} type="checkbox"/>
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
                    <h5>* Only Includes:</h5>

                    <ul className="list-group">
                        <li>Bed rooms</li>
                        <li>Kitchen</li>
                        <li>Glassdoor / Windows</li>
                    </ul>

                    <p>$90.00</p>
                    <Link to="Services/Confirm" className="info-btn">Request</Link>
                </section>

                <section className="custom-pck">
                    <h4>Custom</h4>

                    <ul className="list-group">
                        {this.renderServices()}
                    </ul>
                    <p id="custom-price">${this.state.price}</p>
                    <button id="custom-confirm-btn" onClick={()=>{this.props.history.push("/services/confirm")}}>Continue</button>
                </section>
            </section>
        );
    }
}