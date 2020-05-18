import React from "react";
import {Redirect} from "react-router-dom";

/**
 *
 * Another way to export directly your functional component.
 */
export const TutorialGuard = props => {
    if (localStorage.getItem('LobbyGuard')){
        return <Redirect to={'/lobby/'+localStorage.getItem('LobbyGuard')}/>
    }
    return props.children
};