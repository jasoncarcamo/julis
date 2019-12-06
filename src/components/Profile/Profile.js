import React from "react";
import {Link, Route} from "react-router-dom";
import UserContext, {UserProvider} from "../../Contexts/UserContext/UserContext";
import "./profile.css";

import Aside from "./Aside/Aside";
import UserHome from "./UserHome/UserHome";
import MyInfo from "./MyInfo/MyInfo"; 
import Schedule from "./Schedule/Schedule";
import ServiceHistory from "./ServiceHistory/ServiceHistory";
import ContactUs from "./ContactUs/ContactUs";

export default class Profile extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    };

    static contextType = UserContext;

    componentDidMount(){

        console.log(this.context)
    };

    render(){
        return (
            <UserProvider>
                <section id="profile-section">
                    <Route path="/user" component={Aside}></Route>
                    <Route exact path="/user" component={UserHome}></Route>
                    <Route exact path="/user/schedule" component={Schedule}></Route>
                    <Route exact path="/user/service-history" component={ServiceHistory}></Route>
                    <Route exact path="/user/my-info" component={MyInfo}></Route>
                    <Route exact path="/user/contact-us" component={ContactUs}></Route>
                </section>
            </UserProvider>
        );
    };
};