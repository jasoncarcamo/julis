import React from 'react';
import './App.css';
import {Link, Route} from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import LandingPage from "./components/LandingPage/LandingPage";
import Services from "./components/Services/Services";
import Footer from "./components/Footer/Footer";

class App extends React.Component{
  render(){
    return (
      <section id="app-container">
        <Route path="/" component={NavBar}></Route>
        <Route exact path="/" component={LandingPage}></Route>
        <Route path="/services" component={Services}></Route>
        <Route path="/" component={Footer}></Route>
      </section>
    );
  }
}

export default App;
