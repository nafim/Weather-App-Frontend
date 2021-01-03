import './App.css';
import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Home from './Home';
import ChangePasswordPath from './changePassword';

function App() {
    return (
        <Router>
            <div>
                {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/changePassword/:key">
                        <ChangePasswordPath />
                    </Route>
                    <Route path="/changePassword">
                        <ChangePasswordPath />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;