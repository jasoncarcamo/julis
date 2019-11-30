import React from "react";
import {format as formatDate, getTime} from 'date-fns'
import TokenService from "../../TokenService/TokenService";
import AppContext from "../AppContext/AppContext";

const RequestsContext = React.createContext({
    services: [],
    requests: [],
    time: "",
    newDate: "",
    newService: ()=>{},
    updateServices: ()=>{},
    updateDate: ()=>{},
    updateTime: ()=>{},
    resetRequests: ()=>{},
    refreshPage: ()=>{},
    completeRequests: ()=>{},
    price: ""
});

export default RequestsContext;

export class RequestsProvider extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            instance: false,
            services: [],
            requests: [],
            date: new Date(),
            newDate: "",
            time: "",
            user_id: "",
            requestsId: "",
            price: 0.00,
            error: ""
        };
    };

    static contextType = AppContext;
    

    componentDidMount(){

        let user_id;

        if(!TokenService.hasToken()){
            console.log("Resetting state")
            this.setState({
                instance: false,
                services: [],
                requests: [],                
                time: "",
                date: new Date(),
                user_id: "",
                requestsId: "",
                price: 0.00,
                error: ""
            });

            return;
        };

        fetch("http://localhost:8000/api/users", {
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
                user_id = resData.user.id;
                console.log(user_id)
                Promise.all([fetch("http://localhost:8000/api/services"), fetch("http://localhost:8000/api/requests")])
                .then( ([ serviceRes, requestsRes]) => {

                    if(!serviceRes.ok){
                        return serviceRes.json().then( e => Promise.reject(e));
                    };

                    if(!requestsRes.ok){
                        return requestsRes.json().then( e => Promise.reject(e));
                    };

                    return Promise.all([ serviceRes.json(), requestsRes.json()]);
                })
                .then( ([ serviceData, requestsData]) => {
                    let requests = requestsData.requests;
                    
                    requests.forEach( request => {
                        console.log(request);
                        request.service = this.formatData(request.service)
                    });

                    requests = requests.filter( request => {
                        console.log(user_id);
                        console.log(request.user_id === Number(user_id));
                        return request.user_id === Number(user_id);
                    });
                    console.log(requests)
                    requests = requests.filter( request => request.confirmed === false);

                    console.log(requests)

                    if(requests.length > 0){
                        console.log("Requests")
                        this.setState({ instance: true});
                    } else{
                        console.log("No requests");
                        this.setState({ 
                            instance: false, 
                            requestsId: "", 
                            price: 0, 
                            date: new Date(),
                            time: "",
                            requests: []
                        });
                    }

                    console.log(user_id, requests[0])
                    this.setState({ 
                        services: serviceData.services, 
                        requests: requests[0].service, 
                        date: requests[0].date,
                        time: requests[0].time,
                        user_id: this.context.user_id,
                        requestsId: requests[0].id,
                        price: requests[0].price
                    })
                        
                })
                .catch( err => this.setState({ error: err.error}));
            })
            .catch( err => this.setState({ error: err.error}))
        
        
    };

    updateServices = (service, price) => {
        

        if(TokenService.hasToken()){
            this.requestsHandler(service, price);
        };

        console.log(this.state.requests)
        this.setState({ requests: service, price});
        console.log(service);

    };    

    updateDate = (date) => {
        this.setState({date});
        console.log(date)
        if(this.state.instance){
            console.log("PATCH", this.state.requestsId);
            fetch("http://localhost:8000/api/requests", {
                method: "PATCH",
                headers: {
                    'content-type': "application/json",
                    'authorization': `bearer `
                },
                body: JSON.stringify({
                    date,
                    id: this.state.requestsId})
            })
                .then( res => {
                    if(!res.ok){
                        return res.json().then( e => Promise.reject(e));
                    };

                    return res.json();
                })
                .then( resData => this.componentDidMount())
                .catch( err => this.setState({ error: err.error}));
        };
    }

    updateTime = (time) => {
        this.setState({ time });

        if(this.state.instance){
            console.log("PATCH", this.state.requestsId);
            fetch("http://localhost:8000/api/requests", {
                method: "PATCH",
                headers: {
                    'content-type': "application/json",
                    'authorization': `bearer `
                },
                body: JSON.stringify({
                    time,
                    id: this.state.requestsId})
            })
                .then( res => {
                    if(!res.ok){
                        return res.json().then( e => Promise.reject(e));
                    };

                    return res.json();
                })
                .then( resData => this.componentDidMount())
                .catch( err => this.setState({ error: err.error}));
        };
    }

    completeRequests = () => {

        fetch("http://localhost:8000/api/requests", {
                method: "PATCH",
                headers: {
                    'content-type': "application/json",
                    'authorization': `bearer ${TokenService.getToken()}`
                },
                body: JSON.stringify({ 
                    confirmed: true, 
                    time: this.state.time,
                    date: this.state.date,
                    id: this.state.requestsId})
            })
                .then( res => {
                    if(!res.ok){
                        return res.json().then( e => Promise.reject(e));
                    };

                    return res.json();
                })
                .then( resData => {
                    console.log(resData, "Processed");
                    return this.componentDidMount();
                })
                .catch( err => this.setState({ error: err.error}));
    }

    resetRequests = () => {

        this.setState({requests: [], price: 0});

        fetch("http://localhost:8000/api/requests", {
                method: "PATCH",
                headers: {
                    'content-type': "application/json",
                    'authorization': `bearer `
                },
                body: JSON.stringify({ 
                    service: "{}", 
                    price: 0, 
                    time: "",
                    date: new Date(),
                    id: this.state.requestsId})
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
                .catch( err => this.setState({ error: err.error}));
    }

    requestsHandler = ( service, price ) => {
    
        if(this.state.instance){
            console.log("PATCH", this.state.requestsId);
            fetch("http://localhost:8000/api/requests", {
                method: "PATCH",
                headers: {
                    'content-type': "application/json",
                    'authorization': `bearer `
                },
                body: JSON.stringify({ 
                    service, 
                    price, 
                    id: this.state.requestsId})
            })
                .then( res => {
                    if(!res.ok){
                        return res.json().then( e => Promise.reject(e));
                    };

                    return res.json();
                })
                .then( resData => this.componentDidMount())
                .catch( err => this.setState({ error: err.error}));
        } else{
            console.log(this.context.user_id);
            fetch("http://localhost:8000/api/requests", {
                method: "POST",
                headers: {
                    'content-type': "application/json",
                },
                body: JSON.stringify({ 
                    service, 
                    price,
                    user_id: this.context.user_id})
            })
                .then( res => {
                    if(!res.ok){
                        return res.json().then( e => Promise.reject(e));
                    };

                    return res.json();
                })
                .then( resData => {
                    return this.componentDidMount();
                })
                .catch( err => this.setState({ error: err.error}));
        }
    }

    newService = (id) => {
        let price = Number(this.state.price);
        console.log(this.state.price, this.context)
        fetch("http://localhost:8000/api/requests", {
            method: "POST",
            headers: {
                'content-type': "application/json"
            },
            body: JSON.stringify({ 
                service: this.state.requests, 
                time: this.state.time,
                date: this.state.date,
                price, 
                user_id: id})
        })
            .then( res => {
                if(!res.ok){
                    return res.json().then( e => Promise.reject(e));
                };

                return res.json();
            })
            .then( resData => {
                console.log("POST")
                this.componentDidMount();
            })
            .catch( err => this.setState({ error: err.error}));
    };

    formatData = (data)=>{
        console.log(this.context)
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

    refreshPage = () => {
        console.log("Refreshed")
        this.context.refreshApp();
        this.componentDidMount();
    }

    render(){

        const value = {
            services: this.state.services,
            requests: this.state.requests,
            newService: this.newService,
            resetRequests: this.resetRequests,
            initial_cleaning: this.state.initial_cleaning,
            updateServices: this.updateServices,
            time: this.state.time,
            date: this.state.date,
            updateDate: this.updateDate,
            updateTime: this.updateTime,
            refreshPage: this.refreshPage,
            completeRequests: this.completeRequests,
            price: this.state.price
        };

        return (
            <RequestsContext.Provider value={value}>
                {this.props.children}
            </RequestsContext.Provider>
        );
    };
}