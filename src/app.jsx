import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import orange from '@material-ui/core/colors/orange';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import layout from '@components/layout';

import HomePage from '@pages/home';
import NotesPage from '@pages/notes';
import NoteDetailPage from '@pages/notes/detail';
import NotePreview from '@pages/notes/preview';
import UsersPage from '@pages/users';
import UsersDetailPage from '@pages/users/detail';
import Configuations from '@pages/configuations';
import LoginPage from '@pages/login';
import SetupPage from '@pages/setup';
import NotFound from '@pages/404';

import './app.pcss';

const outerTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#03a9f4'
        },
        secondary: {
            main: orange[500],
        }
    }
});


const registrar = function(type) {
    const originEventHandler = history[type];

    return function() {
        const customEvent = new Event(type, {
            bubbles: true,
            cancelable: true
        });

        originEventHandler.apply(this, arguments);
        customEvent.arguments = arguments;
        window.dispatchEvent(customEvent);
    };
};

history.pushState = registrar('pushState');

const App = () => (
    <Router>
        <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route path="/summary" component={layout(HomePage)} />
            <Route path="/notes/:id" component={layout(NoteDetailPage)} />
            <Route path="/notes" component={layout(NotesPage)} />
            <Route path="/users/:id/:updateTime" component={layout(UsersDetailPage)} />
            <Route path="/users/:id" component={layout(UsersDetailPage)} />
            <Route path="/users" component={layout(UsersPage)} />
            <Route path="/configuations" component={layout(Configuations)} />
            <Route path="/setup" component={SetupPage} />
            <Route path="/note-preview" component={NotePreview} />
            <Route component={NotFound} />
        </Switch>
    </Router>
);

ReactDOM.render(<ThemeProvider theme={outerTheme}><App /></ThemeProvider>, document.getElementById('app'));

if (module.hot) {
    module.hot.accept();
}