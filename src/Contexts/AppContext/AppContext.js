import React from "react";
import TokenService from "../../TokenService/TokenService";

const AppContext = React.createContext({
    user_id: "",
    refreshApp: ()=>{}
});

export default AppContext;


export class AppProvider extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user_id: "",
            error: ""
        };
    };

    componentDidMount(){

        if(TokenService.hasToken()){
            fetch("http://localhost:8000/api/users", {
            headers: {
                'authorization': `bearer ${TokenService.getToken()}`
            }
        })
            .then( res => {
                if(!res.ok){
                    return res.json().then( e => Promise.reject(e));
                }

                return res.json();
            })
            .then( resData => {
                this.setState({ user_id: resData.user.id});
            })
            .catch( err => this.setState({ error: err.error}));
        }
    };

     refreshApp = () => {
         this.componentDidMount();
     };

    render(){
        const value = {
            user_id: this.state.user_id,
            refreshApp: this.refreshApp
        };

        return (
            <AppContext.Provider value={value}>
                {this.props.children}
            </AppContext.Provider>
        );
    };
};