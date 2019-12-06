import React from "react";
import {Link} from "react-router-dom";
import "./aside.css";

export default class Aside extends React.Component{
    render(){
        return (
            <aside id="aside-section">
                    <ul>
                        <li>
                            <Link to="/user/my-info">My info</Link>
                        </li>

                        <li>
                            <Link to="/user/schedule">Scheduled services</Link>
                        </li>

                        <li>
                            <Link to="/user/service-history">Service history</Link>
                        </li>

                        <li>
                            <Link to="/user/contact-us">Contact us</Link>
                        </li>
                    </ul>
                </aside>
        )
    }
}