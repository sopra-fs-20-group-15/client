import React, {Component, Fragment} from "react";
import {LogoutButton} from "./design/Button";
import JustOneLogo from "./pictures/JustOneLogo.png";
import styled from "styled-components";
import {api, handleError} from "../helpers/api";


const LogoutButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  justify-content: center;
`;


class PregameHeaderComponent extends Component {
    constructor(props) {
        super(props);
    }

    async logout() {
        try {

            const requestBody = JSON.stringify({
                token: localStorage.getItem('token'),
                id: localStorage.getItem('id'),
            });

            await api.put('/logout', requestBody);
            // token shows that user is logged in -> removing it shows that he has logged out
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            localStorage.removeItem('username');


            // Logout successfully worked --> navigate to the route /login
            this.props.history.push(`/login`);
        } catch (error) {
            console.log("error in logout", error);
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            localStorage.removeItem('username');


            // Logout successfully worked --> navigate to the route /login
            this.props.history.push(`/login`);
        }
    }

    render() {
        return (
            <Fragment>
                {(this.props.loggedIn) ? (
                    <LogoutButtonContainer style={{left: "12px"}}>
                        <LogoutButton
                            width="255px"
                            onClick={() => {
                                this.logout();
                            }}
                        >
                            Logout
                        </LogoutButton>
                    </LogoutButtonContainer>
                ) : (
                    <div/>
                )}
                <LogoutButtonContainer style={{right: "12px"}}>
                    <LogoutButton
                        width="255px"
                        onClick={() => {
                            localStorage.setItem('QA', this.props.from);
                            this.props.history.push('/tutorial');
                        }}
                    >
                        Rules & Tutorial
                    </LogoutButton>
                </LogoutButtonContainer>
                <img className={"center"} src={JustOneLogo} alt={"JustOneLogo"}/>
            </Fragment>
        );
    }
}

export default (PregameHeaderComponent);
