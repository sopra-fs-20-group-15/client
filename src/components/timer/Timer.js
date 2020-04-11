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

class Timer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            seconds: 30
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
