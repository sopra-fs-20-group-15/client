import React from "react";
import {Redirect} from "react-router-dom";

/**
 *
 * Another way to export directly your functional component.
 */
export const GuardRegister = props => {
    if (localStorage.getItem('token')){
        if (localStorage.getItem("GameGuard")){
            return <Redirect to={'/gameLobby/'+localStorage.getItem("GameGuard")}/>
        }
        if (localStorage.getItem('LobbyGuard')){
            return <Redirect to={'/lobby/'+localStorage.getItem('LobbyGuard')}/>
        }
        return  <Redirect to={'/lobbyOverview'}/>
    }
    return props.children
};