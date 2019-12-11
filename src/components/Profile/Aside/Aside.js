import React from "react";
import {NavLink, Link} from "react-router-dom";
import "./aside.css";

export default class Aside extends React.Component{
    render(){
        return (
            <aside id="aside-section">
                    <ul>
                        <li>
                            <NavLink 
                                to="/user/my-info" 
                                activeStyle={{fontWeight: "bold"}}>My info</NavLink>
                        </li>

                        <li>
                            <NavLink 
                                to="/user/schedule"
                                activeStyle={{fontWeight: "bold"}}>Scheduled services</NavLink>
                        </li>

                        <li>
                            <NavLink 
                                to="/user/service-history"
                                activeStyle={{fontWeight: "bold"}}>Service history</NavLink>
                        </li>

                        <li>
                            <NavLink 
                                to="/user/contact-us"
                                activeStyle={{fontWeight: "bold"}}>Contact us</NavLink>
                        </li>
                    </ul>
                </aside>
        )
    }
}