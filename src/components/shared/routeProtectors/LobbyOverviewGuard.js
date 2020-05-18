import React from "react";
import {Redirect} from "react-router-dom";


export const LobbyOverviewGuard = props => {
    if (localStorage.getItem("token")) {
        if (localStorage.getItem('LobbyGuard')){
            return <Redirect to={'/lobby/'+localStorage.getItem('LobbyGuard')}/>
        }
        return props.children;
    }
    return <Redirect to={"/login"}/>;
};
