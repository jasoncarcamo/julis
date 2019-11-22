import React from "react";
import "./Navbar.css";
import {NavLink, Link} from "react-router-dom";
import TokenService from "../../TokenService/TokenService";
import AppContext from "../../Contexts/AppContext/AppContext";

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

    handleSignOut = () => {
        TokenService.deleteToken();
        this.handleMobileNav();
    }

    renderLogin = () => {
        if(TokenService.hasToken()){
            return (
                <>
                    <li>
                        <NavLink 
                        to="/user" 
                        activeStyle={{ fontWeight: "bold"}}
                        className="Link"
                        onClick={this.handleMobileNav}
                        >Profile</NavLink>
                    </li>

                    <li>
                        <NavLink 
                            to="/" 
                            className="Link"
                            onClick={this.handleSignOut}
                        >Sign out</NavLink>
                    </li>
                    
                </>
            );
        } else{
            return (
                <>
                    <li>
                        <NavLink 
                        to="/register" 
                        activeStyle={{ fontWeight: "bold"}}
                        className="Link"
                        onClick={this.handleMobileNav}>Sign up</NavLink>
                    </li>
                    
                    <li>
                        <NavLink 
                        to="/login" 
                        activeStyle={{ fontWeight: "bold"}}
                        className="Link"
                        onClick={this.handleMobileNav}>Log In</NavLink>
                    </li>
                </>
            );
        };
    };

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
                            to="/About" 
                            activeStyle={{ fontWeight: "bold"}}
                            className="Link"
                            onClick={this.handleMobileNav}>About</NavLink>
                        </li>

                        {this.renderLogin()}
                    </ul>
                </nav>
            </header>
        );
    }
}