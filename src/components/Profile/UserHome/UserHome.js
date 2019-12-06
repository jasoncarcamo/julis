import React from "react";
import UserContext from "../../../Contexts/UserContext/UserContext";

export default class UserHome extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user: {
                
            }
        };
    };

    static contextType = UserContext;

    componentDidMount(){
    }

    render(){
        console.log(this.state)
        return (
            <section id="user-home">

            <h2>Hello {this.context.first_name}</h2>

            </section>
        );
    };
};