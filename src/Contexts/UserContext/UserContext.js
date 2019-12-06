import React from "react";
import TokenService from "../../TokenService/TokenService";

const UserContext = React.createContext({
    id: "",
    first_name: "",                                   
    last_name: "",                                                     
    email: "",  
    mobile_number:"",                                             
    house_number: "",                                               apartment_number: "",                                       
    street_name: "",                                                 
    city: "",                                                               
    state: "",                                                             zip_code: ""
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
                error: ""
            },
            requests: []
        };
    };

    componentDidMount(){
        fetch("http://localhost:8000/api/user", {
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
                console.log(resData);
                this.setState(resData);
            })
            .catch( err => this.setState({ error: err.error}));

    }

    render(){
        console.log(this.state);
        const value = {
            id: this.state.id,
            first_name: this.state.first_name,                                   
            last_name: this.state.last_name,                                       
            email: this.state.email,  
            mobile_number: this.state.mobile_number,                               
            house_number: this.state.house_number,                                 
            apartment_number: this.state.apartment_number,                         
            street_name: this.state.street_name,                                   
            city: this.state.city,                                                 
            state: this.state.state,                                               
            zip_code: this.state.zip_code
        };

        return (
            <UserContext.Provider value={value}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
};