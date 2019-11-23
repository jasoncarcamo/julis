import React from "react";
import TokenService from "../../TokenService/TokenService";
import AppContext from "../AppContext/AppContext";

const RequestsContext = React.createContext({
    services: [],
    requests: [],
    updateServices: ()=>{},
    refreshPage: ()=>{},
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
            return this.setState({
                instance: false,
                services: [],
                requests: [],
                user_id: "",
                requestsId: "",
                price: 0.00,
                error: ""
            });
        }

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
                    console.log(this.state.user_id, user_id)
                    requests.forEach( request => {
                        console.log(request);
                        request.service = this.formatData(request.service)
                    });

                    requests = requests.filter( request => {
                        console.log(user_id);
                        console.log(request.user_id === Number(user_id));
                        return request.user_id === Number(user_id);
                    });

                    requests = requests.filter( request => request.confirmed === false);

                    console.log(requests[0].price)

                    if(requests.length > 0){
                        this.setState({ instance: true});
                    }

                    console.log(user_id, requests[0].price)
                    this.setState({ 
                        services: serviceData.services, 
                        requests: requests[0].service, 
                        user_id: user_id,
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

    requestsHandler = ( service, price ) => {
        const requests = this.state.requests;
        console.log(this.context.user_id);
        if(this.state.instance){
            console.log("PATCH", this.state.requestsId)
            fetch("http://localhost:8000/api/requests", {
                method: "PATCH",
                headers: {
                    'content-type': "application/json",
                    'authorization': `bearer `
                },
                body: JSON.stringify({ service, price, id: this.state.requestsId})
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
            console.log(this.state.user_id)
            fetch("http://localhost:8000/api/requests", {
                method: "POST",
                headers: {
                    'content-type': "application/json",
                },
                body: JSON.stringify({ service, price, user_id: this.context.user_id})
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
        this.componentDidMount();
    }

    render(){

        console.log(this.context, this.state.price);

        const value = {
            services: this.state.services,
            requests: this.state.requests,
            updateServices: this.updateServices,
            refreshPage: this.refreshPage,
            price: this.state.price
        };

        return (
            <RequestsContext.Provider value={value}>
                {this.props.children}
            </RequestsContext.Provider>
        );
    };
}