import React from 'react';
import './App.css';
import {Link, Route} from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import LandingPage from "./components/LandingPage/LandingPage";
import Services from "./components/Services/Services";
import About from "./components/About/About";
import Confirm from "./components/Confirm/Confirm";
import Register from "./components/Register/Register";
import Profile from "./components/Profile/Profile";
import Login from "./components/Login/Login";
import Footer from "./components/Footer/Footer";

class App extends React.Component{
  render(){
    return (
      <section id="app-container">
        <Route path="/" component={NavBar}></Route>
        <Route exact path="/" component={LandingPage}></Route>
        <Route exact path="/services" component={Services}></Route>
        <Route exact path="/about" component={About}></Route>
        <Route exact path="/services/confirm" component={Confirm}></Route>
        <Route path="/user" component={Profile}></Route>
        <Route exact path="/register" component={Register}></Route>
        <Route exact path="/login" component={Login}></Route>
        <Route path="/" component={Footer}></Route>
      </section>
    );
  }
}

export default App;
