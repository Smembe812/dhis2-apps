import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {App} from './App.js';
import * as serviceWorker from './serviceWorker';
import { init } from 'd2'

let baseUrl = process.env.REACT_APP_DHIS2_BASE_URL;

if (!baseUrl) {
    console.warn('Set the environment variable `REACT_APP_DHIS2_BASE_URL` to your DHIS2 instance to override localhost:8080!');
    baseUrl = 'https://play.dhis2.org/2.32.0/';
}

init({baseUrl: baseUrl + '/api/29'})
    .then(d2 => {
        console.log(d2.models)
        ReactDOM.render(<App d2={d2}/>, document.getElementById('root'));
        // If you want your app to work offline and load faster, you can change
        // unregister() to register() below. Note this comes with some pitfalls.
        // Learn more about service workers: https://bit.ly/CRA-PWA
        serviceWorker.unregister();
    })
    .catch(err => console.error(err));


