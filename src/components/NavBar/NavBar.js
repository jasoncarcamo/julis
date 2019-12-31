import React from "react";
import "./Navbar.css";
import {NavLink, Link} from "react-router-dom";
import TokenService from "../../TokenService/TokenService";
import RequestsContext from "../../Contexts/RequestsContext/RequestsContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome} from "@fortawesome/free-solid-svg-icons";

export default class NavBar extends React.Component{

    static contextType = RequestsContext;

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
        TokenService.deleteAdminToken();
        this.handleMobileNav();
        this.context.refreshPage();
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
        } else if(TokenService.hasAdminToken()){
            return (
                <>
                    <li>
                        <NavLink 
                        to="/admin" 
                        activeStyle={{ fontWeight: "bold"}}
                        className="Link"
                        onClick={this.handleMobileNav}
                        >Admin</NavLink>
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

    renderAmount = () => {

        if(this.context.requests){
            
            if(this.context.requests.length > 0){
                
                return this.context.requests.length;
            } else{
                return "";
            };

        }
        else{
            return "";
        };

    };

    render(){
        
        return(
            <header>
                <nav>
                    <h3><Link to="/" className="Link">Julis Cleaning Service</Link></h3>

                    <Link 
                    id="cart"
                    className="Link" 
                    to="/services/confirm"
                    >
                        <div id="mobile-requests-amount">{this.renderAmount()}</div>
                        
                        <FontAwesomeIcon className="home-icon" icon={faHome}></FontAwesomeIcon>
                    </Link>

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
                            
                            <div id="nav-requests-amount">{this.renderAmount()}</div>
                            <NavLink 
                            to="/services" 
                            activeStyle={{ fontWeight: "bold"}}
                            className="Link"
                            onClick={this.handleMobileNav}>Services</NavLink>
                        </li>

                        <li>
                            <NavLink 
                            to="/about" 
                            activeStyle={{ fontWeight: "bold"}}
                            className="Link"
                            onClick={this.handleMobileNav}>About us</NavLink>
                        </li>

                        {this.renderLogin()}
                    </ul>
                </nav>
            </header>
        );
    }
}