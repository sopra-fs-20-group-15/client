import React, {Component, Fragment} from 'react';
import styled from 'styled-components';
import {BaseContainer} from '../../helpers/layout';
import {LogoutButton} from '../../views/design/Button';
import {withRouter} from 'react-router-dom';
import TriangleBackground from '../../views/pictures/TriangleBackground.png';
import RulesPicture from '../../views/pictures/RulesPicture.jpg';

const FormContainer = styled.div` 
  display: flex;
  flex-direction: column;
  align-items: center;
 
  top:70px;
  left:315px;
 
  position: absolute;
  justify-content: center;
`;

const background = {
    backgroundImage: "url(" + TriangleBackground + ")"
};

const TopButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  // right: 15px;
  justify-content: center;
`;

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class Rules extends React.Component {
    constructor() {
        super();
        this.state = {
        };
    }

    componentDidMount() {}

    render() {
        return (
            <BaseContainer  style={background}>
                <TopButtonContainer style={{left:"12px"}}>
                    <LogoutButton
                        width="255px"
                        onClick={() => {
                            this.props.history.push("/"+localStorage.getItem('QA'));
                        }}
                    >
                        Go Back
                    </LogoutButton>
                </TopButtonContainer>
                <TopButtonContainer style={{right:"12px"}}>
                    <LogoutButton
                        width="255px"
                        onClick={() => {
                            this.props.history.push("/tutorial");
                        }}
                    >
                        Tutorial
                    </LogoutButton>
                </TopButtonContainer>
                <FormContainer>
                    <img className={"center"} src={RulesPicture} alt={"RulesPicture"}/>
                </FormContainer>
            </BaseContainer>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Rules);