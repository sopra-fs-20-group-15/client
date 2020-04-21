import React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {RegisterGuard} from "../routeProtectors/RegisterGuard";
import Register from "../../register/Register";
import {LoginGuard} from "../routeProtectors/LoginGuard";
import Login from "../../login/Login";
import LobbyOverview from "../../LobbyOverview/LobbyOverview";
import {LobbyOverviewGuard} from "../routeProtectors/LobbyOverviewGuard";
import CreateGame from "../../CreateGame/CreateGame";
import {InGameGuard} from "../routeProtectors/InGameGuard";
import InGame from "../../InGame/InGame";
import {LobbyGuard} from "../routeProtectors/LobbyGuard.js";
import Lobby from "../../Lobby/Lobby";
import {CreateGameGuard} from "../routeProtectors/CreateGameGuard.js";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
class AppRouter extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <div>
                        <Route
                            path="/lobbyOverview"
                            render={() => (
                                <LobbyOverviewGuard>
                                    <LobbyOverview base={'/lobbyOverview'}/>
                                </LobbyOverviewGuard>
                            )}
                        />
                        <Route
                            path="/register"
                            render={() => (
                                <RegisterGuard>
                                    <Register/>
                                </RegisterGuard>
                            )}
                        />
                        <Route
                            path="/login"
                            exact
                            render={() => (
                                <LoginGuard>
                                    <Login/>
                                </LoginGuard>
                            )}
                        />
                        <Route
                            path="/gameLobby/:id"
                            render={() => (
                                <InGameGuard>
                                    <InGame/>
                                </InGameGuard>
                            )}
                        />
                        <Route
                            path="/lobby/:id"
                            render={() => (
                                <LobbyGuard>
                                    <Lobby/>
                                </LobbyGuard>
                            )}
                        />
                        <Route
                            path="/createGame"
                            render={() => (
                                <CreateGameGuard>
                                    <CreateGame/>
                                </CreateGameGuard>
                            )}
                        />
                        <Route path="/" exact render={() => <Redirect to={"/register"}/>}/>
                    </div>
                </Switch>
            </BrowserRouter>
        );
    }
}

/*
* Don't forget to export your component!
 */
export default AppRouter;
