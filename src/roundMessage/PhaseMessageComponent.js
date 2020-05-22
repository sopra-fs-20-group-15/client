import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled, {css, keyframes} from "styled-components";

export const round = keyframes`
  0% {
    left: -100%;
  }

  15% {
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
  }
  
  85% {
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
  }
  
  100% {
    left: 100%;
  }
`;


export const roundAnimation = css`
    ${round} 4s 1 2s
`;


export const PhaseMessage1 = styled.div`
    position: absolute;
    border: 3px solid black;
    border-radius: 20px;
    right: 100%;
    padding-right: 9px;
    top: 35%;
    font-family: Happy Monkey;
    font-size: 56px;
    z-index: 2;
    font-style: italic;
    animation: ${roundAnimation};
    width: 40%;

    
    background: linear-gradient(#FF0000, #FCC812);
    font-weight: bold;
    
    text-align: center;
`;

export const PhaseMessage2 = styled.div`
    position: absolute;
    border: 3px solid black;
    border-radius: 20px;
    right: 100%;
    padding-right: 9px;
    top: 35%;
    font-family: Happy Monkey;
    font-size: 56px;
    z-index: 2;
    font-style: italic;
    animation: ${roundAnimation};
    width: 40%;

    
    background: linear-gradient(#FF0000, #FCC812);
    font-weight: bold;
    
    text-align: center;
`;

function Message(props) {
    const phaseNumber = props.phaseNumber;
    const activePlayer = props.activePlayer;
    const remainingCards = props.remainingCards;
    if (phaseNumber === 1) {
        if (activePlayer === localStorage.getItem('username')) {
            return <PhaseMessage1> Click on a word! </PhaseMessage1>
        } else {
            return <PhaseMessage1> Wait for next phase! </PhaseMessage1>
        }
    } else if (phaseNumber === 2) {
        if (activePlayer === localStorage.getItem('username')) {
            return <PhaseMessage2> Wait for next phase! </PhaseMessage2>
        } else {
            return <PhaseMessage2> Enter a clue! </PhaseMessage2>
        }
    } else if (phaseNumber === 3) {
        if (activePlayer === localStorage.getItem('username')) {
            if (remainingCards === 1) {
                return <PhaseMessage1> Game over if you guess wrong! </PhaseMessage1>
            } else {
                return <PhaseMessage1> Enter your guess! </PhaseMessage1>
            }
        } else {
            return <PhaseMessage1> Wait for next phase! </PhaseMessage1>
        }
    } else if (phaseNumber === 4) {
        if (remainingCards === 0) {
            return <PhaseMessage2> Game Over! </PhaseMessage2>
        }
        if (remainingCards === 1) {
            return <PhaseMessage2> Only one round left! </PhaseMessage2>
        }
        return <PhaseMessage2> Wait for next round! </PhaseMessage2>
    }
}

class PhaseMessageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phaseNumber: this.props.phaseNumber
        };
    }


    async componentDidMount() {
    }

    /** This method makes sure that if the props of the timer change, the state of the timer is changed accordingly.
     * Since all phases have a different duration, the state always changes, and therefore (since every state change
     * triggers a re-rendering) the PhaseMessageComponent component is re-rendered every time. */
    componentDidUpdate(prevProps) {
        if (this.props.phaseNumber !== prevProps.phaseNumber) {
            this.setState({phaseNumber: this.props.phaseNumber});
        }
    }

    render() {
        return (
            <Message phaseNumber={this.state.phaseNumber} activePlayer={this.props.activePlayer}
            passivePlayers={this.props.passivePlayers} remainingCards={this.props.remainingCards}/>
        );
    }
}

export default withRouter(PhaseMessageComponent);
