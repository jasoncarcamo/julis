import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {RequestsProvider} from "./Contexts/RequestsContext./RequestsContext";
import {BrowserRouter} from "react-router-dom";

ReactDOM.render(
    <BrowserRouter>
        <RequestsProvider>
            <App/>
        </RequestsProvider>
    </BrowserRouter>, document.getElementById('root'));
