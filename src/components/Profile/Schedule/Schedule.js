import React from "react";
import UserContext from "../../../Contexts/UserContext/UserContext";
import TokenService from "../../../TokenService/TokenService";
import "./schedule.css";
import {Link} from "react-router-dom";

export default class Schedule extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            futureRequests: [],
            canceling: false,
            error: ""
        };
    };

    static contextType = UserContext;

    componentDidMount(){
          
        
        setTimeout(()=> {

            return fetch(`https://nameless-beach-67218.herokuapp.com/api/requests/${this.context.id}`, {
                headers: {
                    'content-type': "application/json",
                    'authorization': `bearer ${TokenService.getToken()}`
                }
            })
                .then( res => {
                    if(!res.ok){
                        return res.json().then( e => Promise.reject(e));
                    };

                    return res.json();
                })
                .then( resData => {
                    let futureRequests = resData.requests;

                    futureRequests = futureRequests.filter( request => {
                        if(new Date(request.date) > new Date() && request.confirmed){
                            return request;
                        };
                    });

                    futureRequests.forEach( request => {
                        request.service = this.formatData(request.service);
                        
                    });
        
                    futureRequests.sort( (a, b) => {
                        let aDate = new Date(a.date);
                        let bDate = new Date(b.date);
        
                        return aDate - bDate;
                    });
                    
                    this.setState({ futureRequests });
                })

        }, 300);
        
    };

    handleCancel = () => {
        this.setState({ canceling: !this.state.canceling})
    }

    cancelService = (id) => {
        return fetch(`https://nameless-beach-67218.herokuapp.com/api/requests/${id}`, {
            method:"DELETE",
            headers: {
                'content-type': "application/json",
                'authorization': `bearer ${TokenService.getToken()}`
            }
        })
            .then( res => {
                if(!res.ok){
                    return res.json().then( e => Promise.reject(e));
                };

                return res.json();
            })
            .then( resData => {
                
                this.componentDidMount();
            })
            .catch( err => this.setState({ error: err.error}))
    }

    renderServices = (services) => {
        
        let allServices = services.map( (service, index) => {
            return (
                <li key={index} style={{listStyle: "disc"}}>
                <p>{service.service}</p>
                </li>
            );
        });

        return allServices;
    }

    renderFutureRequests = () => {
        let futureRequests = this.state.futureRequests;

        if(futureRequests.length == 0){
            return <p style={{textAlign: "center"}}>You do not have any services coming up. Get started<Link to="/services"> here</Link></p>
        };

        futureRequests = futureRequests.map( ( request, index) => {
            
            return (
                <li key={index}>
                    <p><strong>Date:</strong> {new Date(request.date).toDateString()}</p>
                    <p><strong>Time:</strong> {request.time}</p>
                    <p><strong>Services:</strong></p>
                    <ul>
                        {this.renderServices(request.service)}
                    </ul>

                    <p><strong>Date created:</strong> {new Date(request.date_created).toDateString()}</p>

                    <p><strong>Price:</strong> ${request.price} / hour</p>

                    <div>
                        <p>* Cancellation must be 24 hours in advanced. Failure to do so will result in a cancellation fee</p>
                        {this.state.error ? <p><strong>{this.state.error}</strong></p> : ""}
                        {this.state.canceling 
                            ? 
                            <div>
                                <button onClick={ () => this.cancelService(request.id)}>I am sure</button>
                                <button onClick={this.handleCancel}>Nevermind</button>
                        </div>
                            : 
                            <button onClick={this.handleCancel}>Cancel</button>
                        }
                    </div>

                </li>
            );
        });

        return futureRequests;
    };

    formatData = (data)=>{
        if(typeof data === "object"){
            return data;
        }
        let formatData = data.split("");

        if(formatData[1] === "\"" && formatData[formatData.length - 2] === "\""){
            formatData.shift();
            formatData.pop();
            formatData.shift();
            formatData.pop();
        };

        for(let i = 0; i < formatData.length; i++){
            if(formatData[i] === ("\\")){
                formatData.splice(i, 1);                
            };

            if(formatData[i] === "}" && formatData[i + 1] === "\""){
                formatData.splice(i + 1, 1);
            }

            if(formatData[i] === "}" && formatData[i + 2] === "\""){
                formatData.splice(i + 2, 1);
            }
        };

        formatData = formatData.join("");
        formatData = "[" + formatData + "]";
        
        if(formatData === "[{}]"){
            return this.setState({ items: []});
        }
        
        formatData = JSON.parse(formatData);

        return formatData;

    };

    render(){
        
        return (
            <section id="user-schedule">
                <h2>Schedule</h2>
                <section id="future-requests-section">
                    <ul id="future-requests-list">
                        {this.renderFutureRequests()}
                    </ul>
                </section>
            </section>
        );
    };
};