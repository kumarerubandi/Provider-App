import React, { Component } from 'react';
import {Switch} from 'react-router';
import {BrowserRouter, Redirect, Route} from 'react-router-dom';
//import PrivateRoute from './privateRoute';
import X12Converter from '../containers/x12converter';
import ReportingScenario from '../containers/ReportingScenario';
import CoverageDetermination from '../containers/CoverageDetermination';
//import PriorAuthorization from '../containers/PriorAuthorization';
import ProviderRequest from '../containers/ProviderRequest';
import Mips from '../containers/Mips';
//import Review from '../containers/Review';
import LoginPage from '../containers/loginPage';
import Launch from '../containers/Launch';
import Main from '../containers/Main';
import Configuration from '../containers/configuration';
import { library } from '@fortawesome/fontawesome-svg-core'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo,faNotesMedical } from '@fortawesome/free-solid-svg-icons';
import CDEX from '../containers/CDEX';
import Home from '../containers/Home';
import PayerCommunicationRequest from '../containers/PayerCommunicationRequest';
import PDEX from '../containers/PDEX';

library.add(faIgloo,faNotesMedical)
export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={() => { return <Redirect to="/home" />}} />
                    <Route path={"/login"} component={LoginPage} />                    
                    <Route path={"/x12converter"} component={X12Converter} />
                    <Route path={"/reportingScenario"} component={ReportingScenario} />
                    <Route path={"/cdex"} component={CDEX} />
                    <Route path={"/payerB"} component={PDEX} />
                    <Route path={"/cd"} component={CoverageDetermination} />
                    {/* <Route path={"/prior_auth"} component={PriorAuthorization} /> */}
                    <Route path={"/provider_request"} component={ProviderRequest} />                    
                    <Route path={"/mips"} component={Mips} />                    
                    <Route path={"/payerA"} component={PayerCommunicationRequest} />                    
                    {/* <Route path={"/review"} component={Review} /> */}
                    <Route exact path="/index" component={Main} />
                    <Route exact path="/home" component={Home} />
                    <Route path={"/launch"} component={Launch} />
                    <Route path={"/configuration"} component={Configuration} />
                </Switch>
            </BrowserRouter>
        );
    }
}