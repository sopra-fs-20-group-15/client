import React from "react";
import {Redirect} from "react-router-dom";

/**
 *
 * Another way to export directly your functional component.
 */
export const LoginGuard = props => {
  if (localStorage.getItem('token')){
    if (localStorage.getItem("GameGuard")){
      return <Redirect to={'/gameLobby/'+localStorage.getItem("GameGuard")}/>
    }
    return  <Redirect to={'/lobbyOverview'}/>
  }
  return props.children
};
