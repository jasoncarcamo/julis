import React from "react";
import {Link} from "react-router-dom";
import UserContext from "../../../Contexts/UserContext/UserContext";
import "./UserHome.css";
import TokenService from '../../../TokenService/TokenService';

export default class UserHome extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            requestId: "",
            futureRequests: [],
            loading: true,
            canceling: false,
            error: ""
        };
    };

    static contextType = UserContext;

    componentDidMount(){
        
        setTimeout(()=>{
            
            fetch(`https://nameless-beach-67218.herokuapp.com/api/requests/${this.context.id}`, {
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

                        if(new Date(request.date) > new Date() && request.confirmed || new Date(request.date).toDateString() === new Date().toDateString() && request.confirmed){
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

                    futureRequests.sort( (a, b)=>{
                        console.log(new Date(a.time), new Date(b.time))
                        return a.time - b.time;
                    });
        
                    if(futureRequests.length === 0){
                        this.setState({
                            requestId: "",
                            futureRequests: [],
                            loading: false,
                            canceling: false,
                            error: ""
                        });
                        return;
                    };
        
                    this.setState({requestId: futureRequests[0].id, futureRequests, loading: false });
                });
        }, 400)
    };

    handleCancel = () => {
        this.setState({ canceling: !this.state.canceling})
    }

    cancelService = () => {
        fetch(`https://nameless-beach-67218.herokuapp.com/api/requests/${this.state.requestId}`, {
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
        let allServices = services.map( ( service, index) => {
            return (
                <li key={index}>
                    {service.service}
                </li>
            );
        });

        return allServices;
    };

    renderUpcomingService = () => {
        let upcomingRequest = this.state.futureRequests;
       
        upcomingRequest = upcomingRequest.map( (request, index) => {

            if(index === 0){
                return (
                    <li key={index}>
                        <em style={{
                            display: "block", textAlign: "center", width: "100%"}}>Your next upcoming service is</em>
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
                                    <button onClick={this.cancelService}>I am sure</button>
                                    <button onClick={this.handleCancel}>Nevermind</button>
                            </div>
                                : 
                                <button onClick={this.handleCancel}>Cancel</button>
                            }
                        </div>
                    </li>
                )
            };

            
        });
        
        return upcomingRequest;
    };

    formatData = (data)=>{
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

    }

    render(){
        
        return (
            <section id="user-home">

            <h2>Hello {this.context.first_name}</h2>

            {this.state.loading 
                ?
                <p style={{textAlign: "center"}}>Loading</p>
                :
                this.state.futureRequests.length > 0 
                ? <ul>{this.renderUpcomingService()}</ul> 
                : <p style={{textAlign: "center"}}>
                    You do not have any services coming up. Get started
                    <Link to="/services"> here</Link>
                    </p>
            }
            </section>
        );
    };
};