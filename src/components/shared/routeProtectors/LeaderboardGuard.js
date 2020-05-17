import React from "react";
import {Redirect} from "react-router-dom";


export const LeaderboardGuard = props => {
    if (localStorage.getItem("token")) {
        if (localStorage.getItem("GameGuard")){
            return <Redirect to={'/gameLobby/'+localStorage.getItem("GameGuard")}/>
        }
        if (localStorage.getItem('LobbyGuard')){
            return <Redirect to={'/lobby/'+localStorage.getItem('LobbyGuard')}/>
        }
        return props.children;
    }
    return <Redirect to={"/login"}/>;
};
