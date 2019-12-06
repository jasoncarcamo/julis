import React from "react";
import TokenService from "../../../TokenService/TokenService";
import UserContext from "../../../Contexts/UserContext/UserContext";
import "./ServiceHistory.css";

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

                let confirmedRequests = resData.requests.filter( request => request.confirmed === true);

                this.setState({ confirmedRequests })

            })
            .catch( err => this.setState({ error: err.error}));
    }

    renderService = (services) => {
        let allServices = services.map( (service, index) => {
            return <li key={index}>{service.service}</li>
        });

        return allServices;
    }

    renderHistory = () => {
        let confirmedRequests = this.state.confirmedRequests;
        
        confirmedRequests.forEach( request => {
            request.service = this.formatData(request.service);
        })

        confirmedRequests.sort((a, b) => {
            let aDate = new Date(a.date);
            let bDate = new Date(b.date);

            return bDate - aDate;

        });

        confirmedRequests = confirmedRequests.filter( request => {
            if(new Date(request.date) < new Date()){
                return request;
            };
        });

        confirmedRequests = confirmedRequests.map( ( request, index) => {

            return (
                <li key={index}>
                    <p>Date: {new Date(request.date).toDateString()}</p>
                    <p>Time: {request.time}</p>

                    <ul>
                        {this.renderService(request.service)}
                    </ul>

                    <p>Date created: {new Date(request.date_created).toDateString()}</p>

                    <p>Price: ${request.price} / hour</p>

                </li>
            );
        });

        console.log(confirmedRequests)

        return confirmedRequests;
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

        return (
            <section id="service-history">
                <h2>Service history</h2>
                <section>
                    <ul>
                        {this.renderHistory()}
                    </ul>
                </section>
            </section>
        )
    }
}