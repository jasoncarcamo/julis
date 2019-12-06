import React from "react";
import UserContext from "../../../Contexts/UserContext/UserContext";
import TokenService from "../../../TokenService/TokenService";
import "./schedule.css";

export default class Schedule extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            futureRequests: [],
            error: ""
        };
    };

    static contextType = UserContext;

    componentDidMount(){
        fetch(`http://localhost:8000/api/requests/${this.context.id}`, {
            headers: {
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

                let futureRequests = resData.requests.filter( request => {

                    request.service = this.formatData(request.service);

                    if(new Date(request.date) > new Date()){
                        return request;
                    };
                });

                futureRequests.sort( (a, b) =>{
                    let aDate = new Date(a.date);
                    let bDate = new Date(b.date);

                    return aDate - bDate;
                })

                futureRequests = futureRequests.filter( request => {
                    if(new Date(request.date) > new Date()){
                        return request;
                    };
                });

                console.log(futureRequests);

                this.setState({futureRequests})
            })
            .catch( err => this.setState({ error: err.error}))
    };

    renderServices = (services) => {
        let allServices = services.map( (service, index) => {
            return (
                <li key={index}>
                <p>{service.service}</p>
                </li>
            );
        });

        return allServices;
    }

    renderFutureRequests = () => {
        let futureRequests = this.state.futureRequests;

        futureRequests = futureRequests.map( ( request, index) => {
            return (
                <li key={index}>
                    <p>Date: {new Date(request.date).toDateString()}</p>
                    <p>Time: {request.time}</p>

                    <ul>
                        {this.renderServices(request.service)}
                    </ul>

                    <p>Date created: {new Date(request.date_created).toDateString()}</p>

                    <p>Price: ${request.price} / hour</p>

                    <div>
                        <p>* Cancellation must be 24 hours in advanced. Failure to do so will result in a cancellation fee</p>
                        <button>Cancel</button>
                    </div>
                </li>
            );
        });

        return futureRequests;
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

    };

    render(){
        console.log(this.state.futureRequests);
        return (
            <section id="user-schedule">
                <h2>Schedule</h2>
                <section>
                    <ul id="user-future-">
                        {this.renderFutureRequests()}
                    </ul>
                </section>
            </section>
        );
    };
};