import React from "react";
import TokenService from "../../TokenService/TokenService";

const UserContext = React.createContext({
    id: "",
    first_name: "",                                   
    last_name: "",                                                     
    email: "",  
    mobile_number:"",                                             
    house_number: "",                                               
    apartment_number: "",                                       
    street_name: "",                                                 
    city: "",                                                               
    state: "",                                                             
    zip_code: "",
    refreshUserInfo: ()=>{}
});

export default UserContext;


export class UserProvider extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user: {
                id: "",
                first_name: "",                                   
                last_name: "",                                                     
                email: "",  
                mobile_number:"",                                             
                house_number: "",                                               
                apartment_number: "",                         
                street_name: "",                                                 
                city: "",                                                              
                state: "",                                                             
                zip_code: "",
            },
            requests: [],
            error: ""
        };
    };

    componentDidMount(){

        return fetch("https://nameless-beach-67218.herokuapp.com/api/user", {
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
                this.setState({user: resData});
                
                return fetch(`https://nameless-beach-67218.herokuapp.com/api/requests/${resData.id}`, {
                    headers: {
                        'authorization': `bearer ${TokenService.getToken()}`
                    }
                })
                    .then( requestsRes => {

                        if(!requestsRes.ok){
                            return requestsRes.json().then( e => Promise.reject(e));
                        };

                        return requestsRes.json();
                    })
                    .then( requestsData => {
                        let requests = requestsData.requests.filter( request => request.confirmed);

                        this.setState({ requests });
                    })
                    .catch( requestsErr => this.setState({ error: requestsErr.error}));
            })
            .catch( err => this.setState({ error: err.error}));

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

    refreshUserInfo = () =>{
        this.componentDidMount();
    }

    render(){
        const value = {
            id: this.state.user.id,
            first_name: this.state.user.first_name,                                   
            last_name: this.state.user.last_name,                                       
            email: this.state.user.email,  
            mobile_number: this.state.user.mobile_number,                               
            house_number: this.state.user.house_number,                                 
            apartment_number: this.state.user.apartment_number,                         
            street_name: this.state.user.street_name,                                   
            city: this.state.user.city,                                                 
            state: this.state.user.state,                                               
            zip_code: this.state.user.zip_code,
            requests: this.state.requests,
            refreshUserInfo: this.refreshUserInfo
        };

        return (
            <UserContext.Provider value={value}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
};