import React from "react";
import TokenService from "../../../TokenService/TokenService";
import UserContext from "../../../Contexts/UserContext/UserContext";
import "./ServiceHistory.css";
import {Link} from "react-router-dom";

export default class ServiceHistory extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            confirmedRequests: [],
            error: ""
        };
    };

    static contextType = UserContext;

    componentDidMount(){

        setTimeout(()=> {

            fetch(`http://localhost:8000/api/requests/${this.context.id}`, {
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
                    
                    let confirmedRequests = resData.requests;
                    
                    confirmedRequests = confirmedRequests.filter( request => new Date(request.date) < new Date());

                    confirmedRequests.sort( (a, b) =>{
                        let aDate = new Date(a.date);
                        let bDate = new Date(b.date);

                        return bDate - aDate;
                    });

                    confirmedRequests.forEach( request => {
                        request.service = this.formatData(request.service);
                    });

                    this.setState({ confirmedRequests });
                })

        }, 300);
    }

    renderService = (services) => {
        let allServices = services.map( (service, index) => {

            return <li key={index} style={{listStyle: "disc"}}>{service.service}</li>
        });

        return allServices;
    }

    renderHistory = () => {
        let confirmedRequests = this.state.confirmedRequests;

        confirmedRequests.sort((a, b) => {
            let aDate = new Date(a.date);
            let bDate = new Date(b.date);

            return bDate - aDate;

        });

        confirmedRequests = confirmedRequests.filter( request => new Date(request.date) <= new Date() );

        if(confirmedRequests.length === 0){
            return <p style={{textAlign: "center"}}>There are no past requests yet. Get started<Link to="/services"> here</Link></p>
        };

        confirmedRequests = confirmedRequests.map( ( request, index) => {

            return (
                <li key={index}>
                    <p><strong>Date:</strong> {new Date(request.date).toDateString()}</p>
                    <p><strong>Time:</strong> {request.time}</p>

                    <p><strong>Services:</strong></p>
                    <ul>
                        {this.renderService(request.service)}
                    </ul>

                    <p><strong>Date created:</strong> {new Date(request.date_created).toDateString()}</p>

                    <p><strong>Price:</strong> ${request.price} / hour</p>

                </li>
            );
        });

        return confirmedRequests;
    };

    formatData = (data)=>{
        if(typeof data === "object"){
            return data;
        };

        if(!data){
            return;
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
            <section id="service-history">
                <h2>Service history</h2>
                <section id="past-requests-section">
                    <ul id="past-requests-list">
                        {this.renderHistory()}
                    </ul>
                </section>
            </section>
        )
    }
}