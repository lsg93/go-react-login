import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom'
import './css/main.scss'
import VerifySignup from './js/components/VerifySignup'
import PrivateRoute from './js/components/PrivateRoute';
import HomePage from './js/components/HomePage';

function App() {
  return (
    <BrowserRouter>
          <PrivateRoute path="/" exact={true} component={HomePage}/>
          <Route path="/verifySignup/:id/:confirmationCode" exact render={ (routeProps) =>  <VerifySignup {...routeProps}/>}/>
    </BrowserRouter>
  );
}

export default App;
