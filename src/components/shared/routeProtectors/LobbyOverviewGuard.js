import React from "react";
import {Redirect} from "react-router-dom";


export const LobbyOverviewGuard = props => {
    if (localStorage.getItem("token")) {
        if (localStorage.getItem("GameGuard")){
            return <Redirect to={'/gameLobby/'+localStorage.getItem("GameGuard")}/>
        }
        return props.children;
    }
    return <Redirect to={"/login"}/>;
};
