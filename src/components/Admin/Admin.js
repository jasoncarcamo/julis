import React from "react";
import "./admin.css";
import TokenService from "../../TokenService/TokenService";
import RequestList from "./RequestList";


export default class Admin extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            requests: [],
            confirmedRequests: [],
            error: ""
        };
    };

    componentDidMount(){
        fetch("https://nameless-beach-67218.herokuapp.com/api/requests", {
            headers: {
                'content-type': "application/json",
                'authorization': `bearer ${TokenService.getAdminToken()}`
            }
        })
            .then( res => {
                if(!res.ok){
                    return res.json().then( e => Promise.reject(e));
                };

                return res.json();
            })
            .then( resData => {
                let requests = resData.adminRequests;
                let confirmedRequests;
                
                requests.forEach( data => {

                    data.service = this.formatData(data.service);

                });

                confirmedRequests = requests.filter( request => request.admin_confirmed === true );
                requests = requests.filter( request => !request.admin_confirmed);
                

                this.setState({ requests, confirmedRequests });
                
            })
            .catch( err => this.setState({ error: err.error}));
    };

    renderRequestLists = ()=>{
        let requests = this.state.requests;

        requests.sort(( a, b)=>{
            return new Date(a.date) - new Date(b.date);
        });

        requests = requests.filter( request => new Date(request.date).toDateString() == new Date().toDateString() || new Date(request.date) > new Date());
        
        requests = requests.map( (request, index) => {
            return <RequestList key={index} request={request} refreshAdmin={this.refreshAdmin}></RequestList>
        });

        return requests;
    }

    renderConfirmedList = ()=>{
        let confirmedRequests = this.state.confirmedRequests;

        confirmedRequests.sort(( a, b)=>{
            return new Date(a.date) - new Date(b.date);
        });

        confirmedRequests = confirmedRequests.filter( request => new Date(request.date).toDateString() == new Date().toDateString() || new Date(request.date) > new Date());
        
        confirmedRequests = confirmedRequests.map( (request, index) => {
            return <RequestList key={index} request={request} refreshAdmin={this.refreshAdmin}></RequestList>
        });

        return confirmedRequests;
    }

    handleActiveRequestSection = (e)=>{
        const requestLinks = document.querySelectorAll("#admin-section > div p");
        const unconfirmedRequestsSection = document.getElementById("admin-unconfirmed-requests");
        const confirmedRequestsSection = document.getElementById("admin-confirmed-requests");
        let linkIndex;

        Array.from(requestLinks).forEach( (link, index) => {
            link.classList.remove("active-requests");
            if(e.target === link){
                linkIndex = index;
            }
        });
        
        e.target.classList.toggle("active-requests");

        if(linkIndex === 0){
            confirmedRequestsSection.classList.remove("show-requests");
            unconfirmedRequestsSection.classList.toggle("show-requests");
        };

        if(linkIndex === 1){
            unconfirmedRequestsSection.classList.remove("show-requests");
            confirmedRequestsSection.classList.toggle("show-requests");
        }

    }

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

    refreshAdmin = ()=>{
        
        this.componentDidMount();
    }

    render(){
       
        return (
            <section id="admin-section">

                <div>
                    <p className="active-requests" onClick={this.handleActiveRequestSection}>Unconfirmed requests</p>
                    <p onClick={this.handleActiveRequestSection}>Confirmed requests</p>
                </div>
                <ul id="admin-unconfirmed-requests" className="show-requests">
                    {this.state.requests.length > 0 ? this.renderRequestLists() : <p>You do not have any requests at the moment.</p>}
                </ul>

                <ul id="admin-confirmed-requests">
                    {this.state.confirmedRequests.length > 0 ? this.renderConfirmedList() : <p>You do not have any requests at the moment.</p>}
                </ul>
            </section>
        )
    }
}