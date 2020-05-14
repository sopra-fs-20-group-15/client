import React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GuardRegister} from "../routeProtectors/GuardRegister";
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
import Leaderboard from "../../Leaderboard/Leaderboard";
import {LeaderboardGuard} from "../routeProtectors/LeaderboardGuard.js";
import Tutorial from "../../Tutorial/Tutorial.js";
import {TutorialGuard} from "../routeProtectors/TutorialGuard";
import Rules from "../../Rules/Rules.js"
import {RulesGuard} from "../routeProtectors/RulesGuard";


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
                                <GuardRegister>
                                    <Register/>
                                </GuardRegister>
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
                            path="/rules"
                            exact
                            render={() => (
                                <RulesGuard>
                                    <Rules/>
                                </RulesGuard>
                            )}
                        />
                        <Route
                            path="/tutorial"
                            exact
                            render={() => (
                                <TutorialGuard>
                                    <Tutorial/>
                                </TutorialGuard>
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
                            path="/leaderboard"
                            render={() => (
                                <LeaderboardGuard>
                                    <Leaderboard/>
                                </LeaderboardGuard>
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
