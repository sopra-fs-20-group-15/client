import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled, {css, keyframes} from "styled-components";


const Seconds = styled.div`
    position: absolute;
    top: 60px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    font-family: Happy Monkey;
    font-size: 70px;
    justify-content: center;
    display: flex;
`;

export const pulse = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.9);
  }

  100% {
    transform: scale(1);
  }
`;

export const pulseAnimation = css`
    ${pulse} 1s infinite;
`;

export const TimerContainer = styled.div`
  position: relative;
  width: 175px;
  height: 175px;
  display: inline-block;
  border-radius: 50%;
  
  animation: ${props => (props.countdown ? pulseAnimation : "default")}
  
  margin-left: 10px;

  background: #BDAF7E;
  border: 3px solid #000000;
  box-shadow: 7px 7px 10px rgba(0, 0, 0, 0.25);
`;

export const Round = styled.div`
    position: absolute;
    top: 30px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    font-family: Happy Monkey;
    text-decoration: underline;
    font-size: 28px;
    justify-content: center;
    display: flex;
`;

const Message = styled.div`
    position: absolute;
    top: 70px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.0;
    font-family: Happy Monkey;
    font-size: 40px;
    font-weight: bold;
    justify-content: center;
    text-align: center;
    display: flex;
`;

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: this.props.seconds,
            countdown: false
        };
    }

    async updatePhase(phaseNumber) {
        if (phaseNumber === 1) {
            this.props.determineMysteryWord(Math.floor(Math.random() * 5) + 1);
        } else if (phaseNumber === 2) {
            this.props.giveClue(this.props.mysteryWord);
        } else if (phaseNumber === 3) {
            this.props.setGuess("'too_slow'");
        } else if (phaseNumber === 4) {
            this.props.gameHasEnded();
        } else {
            console.log('Somehow you have managed to not be in any phase at all...')
        }
    }

    playCountdownAudio() {
        let audio = new Audio('http://soundbible.com/mp3/Countdown-Me-728881159.mp3');
        audio.load();
        audio.play();
        setTimeout(() => audio.pause(), 5000)
    }

    async componentDidMount() {
        this.myInterval = setInterval(() => {
            const {seconds} = this.state;

            if (seconds > 0) {
                this.setState(({seconds}) => ({
                    seconds: seconds - 1
                }))
            }

            if (seconds > 5) {
                this.setState({
                    countdown: false
                });
            }

            if (seconds === 6 && this.props.phaseNumber !== 4) {
                if (this.props.soundOn) {
                    this.playCountdownAudio();
                }
                this.setState({
                    countdown: true
                });
            }

            if (seconds === 0) {
                setTimeout(() => this.updatePhase(this.props.phaseNumber), 100);
            }
        }, 1000)
    }

    /** This method makes sure that if the props of the timer change, the state of the timer is changed accordingly.
     * Since all phases have a different duration, the state always changes, and therefore (since every state change
     * triggers a re-rendering) the Timer component is re-rendered every time. */
    componentDidUpdate(prevProps) {
        /** Conditional statement prevents infinite loop. */
        if (this.props.seconds !== prevProps.seconds) {
            this.setState({seconds: this.props.seconds});
        }
        if (this.props.round !== prevProps.round) {
            this.setState({round: this.props.round});
        }
    }

    /** necessary? */
    async componentWillUnmount() {
        clearInterval(this.myInterval)
    }

    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        // making sure that the new number of players does not violate the constraints imposed by the game rules
        this.setState({[key]: value});
    }


    render() {
        const {seconds} = this.state;
        return (
            <TimerContainer countdown={this.state.countdown}>
                <Round> Round {this.props.round} </Round>
                {seconds === 0
                    ? <Message> Times up! </Message>
                    : <Seconds> {seconds < 10 ? `0${seconds}` : `${seconds}`} </Seconds>
                }
            </TimerContainer>
        );
    }
}

export default withRouter(Timer);
