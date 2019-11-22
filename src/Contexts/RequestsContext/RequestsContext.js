import React from "react";
import TokenService from "../../TokenService/TokenService";

const RequestsContext = React.createContext({
    services: [],
    requests: [],
    updateServices: ()=>{},
    refreshPage: ()=>{}
});

export default RequestsContext;

export class RequestsProvider extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            instance: false,
            services: [],
            requests: [],
            requestsId: "",
            price: 0.00,
            error: ""
        };
    };

    componentDidMount(){
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

                requests = requests.filter( request => request.id === 1);

                requests = requests.filter( request => request.confirmed === false);

                console.log(requests)

                if(requests.length > 0){
                    this.setState({ instance: true});
                }

                return this.setState({ services: serviceData.services, requests: requests[0].service, requestsId: requests[0].id})
            })
            .catch( err => this.setState({ error: err.error}));
    };

    updateServices = (service, price) => {
        
        console.log(this.state.requests);

        if(TokenService.hasToken()){
            this.requestsHandler(service, price);
        };

        console.log(this.state.requests)
        this.setState({ requests: service, price});
        console.log(service);

    };    

    requestsHandler = ( service, price ) => {
        const requests = this.state.requests;
        console.log(requests, service);
        if(this.state.instance){
            console.log("PATCH")
            fetch("http://localhost:8000/api/requests", {
                method: "PATCH",
                headers: {
                    'content-type': "application/json",
                    'authorization': `bearer `
                },
                body: JSON.stringify({ service, id: this.state.requestsId})
            })
                .then( res => {
                    if(!res.ok){
                        return res.json().then( e => Promise.reject(e));
                    };

                    return res.json();
                })
                .then( resData => console.log(resData))
                .catch( err => this.setState({ error: err.error}));
        } else{
            console.log("POST", { service: this.state.requests, price, user_id: 1})
            fetch("http://localhost:8000/api/requests", {
                method: "POST",
                headers: {
                    'content-type': "application/json",
                },
                body: JSON.stringify({ service, price: this.state.price, user_id: 1})
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

    formatData = (data)=>{

        let formatData = data.split("");
        if(formatData[1] === "\"" && formatData[formatData.length - 2] === "\""){
            formatData.shift();
            formatData.pop();
            formatData.shift();
            formatData.pop();
        }

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
        this.componentDidMount();
    }

    render(){

        console.log(this.state.requests, this.state.requestsId);

        const value = {
            services: this.state.services,
            requests: this.state.requests,
            updateServices: this.updateServices,
            refreshPage: this.refreshPage
        };

        return (
            <RequestsContext.Provider value={value}>
                {this.props.children}
            </RequestsContext.Provider>
        );
    };
}