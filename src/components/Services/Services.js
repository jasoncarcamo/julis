import React from "react";
import "./initial-pck.css";
import "./custom-pck.css";
import {Link, Route} from "react-router-dom";
import RequestsContext from "../../Contexts/RequestsContext/RequestsContext";
import TokenService from "../../TokenService/TokenService";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";

export default class Services extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            services: [],
            requests: [],
            price: 0,
            date: new Date(),
            time: "",
            confirm: false,
            error: ""
        };
    };

    static contextType = RequestsContext;

    componentDidMount(){

        let initialCleaning = document.getElementById("initial-cleaning-input");
        let services = document.getElementsByClassName("service-checkboxes");
        
        fetch("http://localhost:8000/api/services", {
            headers: {
                'content-type': "application/json",
                'authorization': `bearer ${TokenService.getToken()}`
            }
        })
            .then( res => {
                if(!res.ok){
                    return res.json().then( e=> Promise.reject(e));
                };

                return res.json();
            })
            .then( resData => {
    
                this.setState({ 
                    services: resData.services,
                    date: new Date(this.context.date),
                    time: this.convertTime(this.context.time),
                });

                console.log(initialCleaning);
                if(this.context.requests){

                    const requests = this.context.requests;
                    console.log()
                    for(let i = 0; i < services.length; i++){

                        for(let j = 0; j < requests.length; j++){

                            if(requests[j].service === initialCleaning.name){
                                initialCleaning.checked = true;
                            };

                            if(initialCleaning.checked){
                                console.log("checked")
                                for(let i = 0; i < services.length; i++){
                                    if(services[i].name === "Bed rooms" || services[i].name === "Kitchen" || services[i].name === "Glass doors / Windows"){
                                        
                                        services[i].parentElement.style.display = "none";

                                    };
                                };
                            };

                            if(services[i].name === requests[j].service){
                                
                                const service = document.getElementsByClassName("custom-pck")[0];

                                service.classList.remove("show-custom-services");
                                service.classList.add("show-custom-services");
                                console.log(true)
                                services[i].checked = true;
                            };
                        };
                   };
        
                    this.setState({ 
                        requests: this.context.requests, 
                        price: this.context.price});
        
                };   
            });
  
    };

    convertTime = (time)=>{
        console.log(time)

        if(!time){
            return "";
        };

        let realTime = time.split("");
        
        realTime.pop();
        let day = realTime.pop();
        realTime.pop();

        realTime = realTime.join("");

        realTime = realTime.split(":");
        
        if(day !== "A" && realTime[0] !== "12" ){
            realTime[0] = Number(realTime[0]) + 12;
            
        } else if(day === "A" && realTime[0] === "12"){
            realTime[0] = "00";
        };       

        return realTime.join(":");
    }

    initialCleaningHandler = () => {
        let requests = this.state.requests;
        let requestIndex;

        requestIndex = requests.map( e => e.service).indexOf("Initial cleaning");
        console.log(requestIndex);
    }

    updateServices = (e) => {

        let service = this.state.requests;
        let price = Number(this.state.price);
        let services = document.getElementsByClassName("service-checkboxes");

        if(e.target.checked){
            let newService = {
                service: e.target.name,
                price: Number(e.target.value)
            };

            if(newService.service === "Initial cleaning"){
                for(let i = 0; i < services.length; i++){
                    if(services[i].name === "Bed rooms" || services[i].name === "Kitchen" || services[i].name === "Glass doors / Windows"){
                        
                        services[i].parentElement.style.display = "none";
                    }
                }
            }

            service.push(newService);
            price += newService.price;
        } else{
            let removeService = {
                service: e.target.name,
                price: Number(e.target.value)
            };

            if(removeService.service === "Initial cleaning"){
                for(let i = 0; i < services.length; i++){
                    if(services[i].name === "Bed rooms" || services[i].name === "Kitchen" || services[i].name === "Glass doors / Windows"){
                        services[i].parentElement.style.display = "block";
                    }
                }
            }

            let serviceIndex = service.map( (e, index) => e.service).indexOf(removeService.service);
     
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
                    <label htmlFor={service.service} className="">
                        <input className="service-checkboxes" onChange={this.updateServices} name={service.service} value={service.price}  type="checkbox"/>
                        {service.service}
                    </label>
                </li>);
        });

        return services;
    };

    handleDate = (date)=>{
        this.setState({date});        
        this.context.updateDate(date);
    }

    handleTime = (time) => {
        const newTime = this.formatTime(time);
        this.setState({time})
        console.log(newTime);
        this.context.updateTime(newTime);
    }

    formatTime = (time)=>{
        console.log(time)
        let newTime;
        const arr = time.split(':');
        if(arr[0] > 12){
            arr[0] = arr[0] - 12 ;
            newTime = arr.join(':') + ' PM';
        } else if(arr[0] === '00'){
            arr[0] = '12'
            newTime = arr.join(':') + ' AM'
        } else if(arr[0] === '12'){
            newTime = arr.join(':') + ' PM'
        }
        else{
            newTime = arr.join(':') + ' AM';
        }
        return newTime;
    }

    showCustomServices = () => {
        const services = document.getElementsByClassName("custom-pck")[0]

        services.classList.toggle("show-custom-services");
    }

    handleCheckout = (e) => {
        e.preventDefault();

        if(!TokenService.hasToken()){
            return this.props.history.push("/register");
        }

        if(this.state.time === ""){
            return this.setState({ error: "The time is needed"})
        }

        this.props.history.push("/services/confirm")
    };

    render(){
        console.log(this.state.date)
        return (
            <section 
            id="services-section"
            className="text-center">
                <section className="initial-pck">
                    <h2 className="display-4">Our Initial cleaning</h2>
                    <h5>* Only Includes:</h5>

                    <ul className="list-group">
                        <li>Bed rooms</li>
                        <li>Kitchen</li>
                        <li>Glassdoor / Windows</li>
                    </ul>

                    <form>
                        <fieldset>
                            <label 
                            htmlFor="initial-cleaning-input"
                            className="initial-cleaning-input" 
                            >
                                <input 
                                type="checkbox" 
                                id="initial-cleaning-input" 
                                name="Initial cleaning" 
                                value="90"
                                onChange={this.updateServices}/>
                                $90.00 / hour
                            </label>

                            
                        
                        </fieldset>
                    </form>
                </section>

                <h4 onClick={this.showCustomServices}>Custom services</h4>

                <section className="custom-pck">

                    <ul className="list-group">
                        {this.renderServices()}
                    </ul>

                </section>

                <p id="custom-price">${this.state.price ? this.state.price + " / hour" : this.state.price}</p>

                <form className="confirm-form" onSubmit={this.handleCheckout}>
                    <fieldset>
                        
                        <label htmlFor="react-date">
                            * When?
                        </label>
                        <DatePicker
                                id="react-date"
                                className="react-date-picker"
                                value={this.state.date}
                                onChange={this.handleDate}
                                 
                                required/>

                        <label htmlFor="react-time">
                            * What time?  
                        </label>
                        <TimePicker
                                id="react-time"
                                className="react-time-picker"
                                onChange={this.handleTime}
                                value={this.state.time}
                                disableClock={true}
                                format="hh:mm a"/>
                        {this.state.error ? <p style={{textAlign: "center"}}>{this.state.error}</p> : ""}
                        <button id="custom-confirm-btn" type="submit">Continue</button>
                    </fieldset>
                </form>
            </section>
        );
    }
}