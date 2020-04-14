import React, {Component} from 'react';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import styled from "styled-components";


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

class Timer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            seconds: this.props.seconds
        };
    }


    async componentDidMount() {
        this.myInterval = setInterval(() => {
            const{seconds} = this.state;

            if (seconds > 0) {
                this.setState(({seconds}) => ({
                    seconds: seconds - 1
                }))
            }

            if (seconds === 0) {
                clearInterval(this.myInterval)
            }
        }, 1000)
    }

    /** This method makes sure that if this.props.seconds changes, the state of the timer is changed accordingly.
     * Since all phases have a different duration, the state always changes, and therefore (since every state change
     * triggers a re-rendering) the Timer component is re-rendered every time. */
    componentDidUpdate(prevProps) {
        // conditional statement prevents infinite loop
        if (this.props.seconds !== prevProps.seconds) {
            this.setState({ seconds: this.props.seconds });
        }
    }

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
            <div>
                {seconds === 0
                    ? <Message> Times up! </Message>
                    : <Seconds> {seconds < 10 ? `0${seconds}` : `${seconds}`} </Seconds>
                }
            </div>
        );
    }
}

export default withRouter(Timer);
