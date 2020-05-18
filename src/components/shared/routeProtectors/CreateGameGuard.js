import React from "react";
import { Redirect } from "react-router-dom";


export const CreateGameGuard = props => {
    if (localStorage.getItem("token")) {
        if (localStorage.getItem('LobbyGuard')){
            return <Redirect to={'/lobby/'+localStorage.getItem('LobbyGuard')}/>
        }
        return props.children;
    }
    return <Redirect to={"/login"}/>;
};