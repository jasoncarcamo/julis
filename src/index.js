import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {RequestsProvider} from "./Contexts/RequestsContext/RequestsContext";
import {AppProvider} from "./Contexts/AppContext/AppContext";
import {BrowserRouter} from "react-router-dom";

ReactDOM.render(
    <BrowserRouter>
        <AppProvider>
            <RequestsProvider>
                <App/>
            </RequestsProvider>
        </AppProvider>
    </BrowserRouter>, document.getElementById('root'));
