import React from "react";
import "./Navbar.css";
import {NavLink, Link} from "react-router-dom";

export default class NavBar extends React.Component{
    handleMobileNav = (e) => {
        const burger = document.getElementById("nav-burger");
        const closeLinks = document.getElementById("close-links");
        const navLinks = document.getElementById("nav-links");

        navLinks.addEventListener("touchmove", (e)=>{
            e.preventDefault();
        });

        burger.classList.toggle("hide-burger");
        closeLinks.classList.toggle("show-close-links");
        navLinks.classList.toggle("display-nav");
    }
    render(){
        return(
            <header>
                <nav>
                    <h3><Link to="/" className="Link">Julis Cleaning Service</Link></h3>

                    <div id="nav-burger" onClick={this.handleMobileNav}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                    <div id="close-links" onClick={this.handleMobileNav}>
                        X
                    </div>

                    <ul id="nav-links">
                        <li>
                            <NavLink 
                            exact to="/" 
                            activeStyle={{ fontWeight: "bold", fontSize: "1.15em"}}
                            className="Link"
                            onClick={this.handleMobileNav}>Home</NavLink>
                        </li>

                        <li>
                            <NavLink 
                            to="/services" 
                            activeStyle={{ fontWeight: "bold"}}
                            className="Link"
                            onClick={this.handleMobileNav}>Services</NavLink>
                        </li>

                        <li>
                            <NavLink 
                            to="About" 
                            activeStyle={{ fontWeight: "bold"}}
                            className="Link"
                            onClick={this.handleMobileNav}>About</NavLink>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    }
}