import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled, {css, keyframes} from "styled-components";

export const round = keyframes`
  0% {
    left: -100%;
  }

  25% {
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
  }
  
  75% {
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
  }
  
  100% {
    left: 100%;
  }
`;

export const roundRight = keyframes`
  0% {
    
  }

  100% {
    
  }
`;

/*export const roundRotate = keyframes`
  0% {
    transform: rotate(0deg)
  }

  100% {
    transform: rotate(3600deg)
  }
`;*/

export const roundAnimation = css`
    ${round} 6s 1 2s
`;


export const RoundMessage1 = styled.div`
    position: absolute;
    right: 100%;
    padding-right: 9px;
    top: 302px
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

export const RoundMessage2 = styled.div`
    position: absolute;
    right: 100%;
    padding-right: 9px;
    top: 302px
    font-family: Happy Monkey;
    font-size: 56px;
    z-index: 2;
    font-style: italic;
    animation: ${roundAnimation};
    width: 40%;

    
    background: linear-gradient(180deg, #005C0F 0%, rgba(0, 147, 23, 0) 100%), #05F400;
    font-weight: bold;
    
    text-align: center;
`;

export const RoundMessage3 = styled.div`
    position: absolute;
    right: 100%;
    padding-right: 9px;
    top: 302px
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

export const RoundMessage4 = styled.div`
    position: absolute;
    right: 100%;
    padding-right: 9px;
    top: 302px
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
            return <RoundMessage1> Enter a number between 1 and 5! </RoundMessage1>
        } else {
            return <RoundMessage1> Wait for next phase! </RoundMessage1>
        }
    } else if (phaseNumber === 2) {
        if (activePlayer === localStorage.getItem('username')) {
            return <RoundMessage2> Wait for next phase! </RoundMessage2>
        } else {
            return <RoundMessage2> Enter a clue! </RoundMessage2>
        }
    } else if (phaseNumber === 3) {
        if (activePlayer === localStorage.getItem('username')) {
            return <RoundMessage3> Enter your guess! </RoundMessage3>
        } else {
            return <RoundMessage3> Wait for next phase! </RoundMessage3>
        }
    } else if (phaseNumber === 4) {
        if (remainingCards === 0) {
            return <RoundMessage4> Game Over! </RoundMessage4>
        } else if (remainingCards === 1) {
            return <RoundMessage4> Last Round! </RoundMessage4>
        }
        return <RoundMessage4> Wait for next round! </RoundMessage4>
    }
}

class RoundMessageComponent extends Component {
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
     * triggers a re-rendering) the RoundMessageComponent component is re-rendered every time. */
    componentDidUpdate(prevProps) {
        if (this.props.phaseNumber !== prevProps.phaseNumber) {
            this.setState({phaseNumber: this.props.phaseNumber});
        }
    }

    render() {
        return (
            <Message phaseNumber={this.state.phaseNumber} activePlayer={this.props.activePlayer}
            passivePlayers={this.props.passivePlayers}/>
            /*<RoundMessage id={"anim"} phaseNumber={this.state.phaseNumber}> {(this.state.phaseNumber === 1 && this.props.activePlayer === localStorage.getItem('username') ?
                "Enter number between 1 and 5!" :
                (this.state.phaseNumber === 2 && this.props.passivePlayers.includes(localStorage.getItem('username')) ?
                    "Enter a clue!" : (this.state.phaseNumber === 3 && this.props.activePlayer === localStorage.getItem('username') ?
                        "Enter a guess!" : "Wait for next phase!")))}
            </RoundMessage>*/
        );
    }
}

export default withRouter(RoundMessageComponent);
