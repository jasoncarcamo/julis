import React from "react";
import TokenService from "../../TokenService/TokenService";

export default class Checkout extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        };
    };

    componentDidMount(){
        if(TokenService.hasToken()){
            console.log("Has token");
        };
    };

    render(){
        return(
            ""
        )
    }
}