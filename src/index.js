import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { BrowserRouter, Route } from 'react-router-dom'
import App from './pages/App';
import LibraryInfoPage from './pages/LibraryInfoPage';
import AccountService from './services/AccountService/index';

let accountService = new AccountService();
accountService.init( () => {
    ReactDOM.render(
        <BrowserRouter>
            <div>
                <Route exact path="/" component={App} />
                <Route path="/:libraryName" component={LibraryInfoPage} />
            </div>
        </BrowserRouter>,
        document.getElementById('root'));
    
});