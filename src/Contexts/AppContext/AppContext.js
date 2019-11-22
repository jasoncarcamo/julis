import React from "react";

const AppContext = React.createContext({
    refreshApp: ()=>{}
});

export default AppContext;


export class AppProvider extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            
        };
    };

    componentDidMount(){
        
    };

     refreshApp = (param) => {
         console.log(param)
         this.props.history.push(param);
     }
    render(){

        const value = {
            refreshApp: this.refreshApp
        };

        return (
            <AppContext.Provider value={value}>
                {this.props.children}
            </AppContext.Provider>
        );
    };
};