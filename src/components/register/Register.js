import React from 'react';
import styled from 'styled-components';
import {BaseContainer} from '../../helpers/layout';
import {api, handleError} from '../../helpers/api';
import {withRouter} from 'react-router-dom';
import {Button, LogoutButton} from '../../views/design/Button';
import TriangleBackground from "../../views/pictures/TriangleBackground.png";
import JustOneLogo from "../../views/pictures/JustOneLogo.png";


const FormContainer = styled.div` 
  display: flex;
  flex-direction: column;
  align-items: center;
 
  position: absolute;
  left: 380px;
  right: 380px;
  top: 260px;
  bottom: 200px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 316px;
  mix-blend-mode: normal;
  border: 1px solid rgba(203, 189, 140, 0.95);
  box-sizing: border-box;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 20px;
  font-weight: 700;
  padding-left: 125px;
  padding-right: 125px;
  border-radius: 20px;
  background: #E4DAA5;
`;

const background = {
    backgroundImage: "url(" + TriangleBackground + ")"
};

const UsernameInputField = styled.input`
  mix-blend-mode: normal;
  border: 1px solid rgba(203, 189, 140, 0.95);
  box-sizing: border-box;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  &::placeholder {
    color: rgba(256, 256, 200, 0.3);
  }
  position: relative;
  left: 0px;
  right: 0px;
  top: -2px;
  bottom: 20px; 
  height: 60px;
  padding-left: 45px;
  margin-left: -4px;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(203, 189, 140, 0.95);
  color: brown;
`;


const ButtonGroup = styled.div`
  position: absolute;
  bottom: 10%;
  left: 30%;
  right: 30%;
`;

const RulesButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 15px;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 20px;
  margin-top: 20px;
`;

const PasswordInputField = styled.input`
  mix-blend-mode: normal;
  border: 1px solid rgba(203, 189, 140, 0.95);
  box-sizing: border-box;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  &::placeholder {
    color: rgba(256, 256, 200, 0.3);
  }
  position: relative;
  left: 0px;
  right: 0px;
  top: 13px;
  bottom: 20px;
  height: 60px;
  padding-left: 45px;
  margin-left: -4px;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(203, 189, 140, 0.95);
  color: brown;
`;


const RepeatPasswordInputField = styled.input`
  mix-blend-mode: normal;
  border: 1px solid rgba(203, 189, 140, 0.95);
  box-sizing: border-box;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  &::placeholder {
    color: rgba(256, 256, 200, 0.3);
  }
  position: relative;
  left: 0px;
  right: 0px;
  top: 25px;
  bottom: 20px;
  height: 60px;
  padding-left: 45px;
  margin-left: -4px;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(203, 189, 140, 0.95);
  color: brown;
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
class Register extends React.Component {
    /**
     * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
     * The constructor for a React component is called before it is mounted (rendered).
     * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
     * These fields are then handled in the onChange() methods in the resp. InputFields
     */
    constructor() {
        super();
        this.state = {
            name: null,
            username: null
        };
    }

    /**
     * HTTP POST request is sent to the backend.
     * If the request is successful, a new user is returned to the front-end
     * and its token is stored in the localStorage.
     */
    async register() {
        try {
            // eslint-disable-next-line
            if (this.state.password === this.state.password.trim()) {
                const requestBody = JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                });

                // eslint-disable-next-line
                const response = await api.post('/players', requestBody);

                // registration successfully worked --> navigate to the route /login
                this.props.history.push(`/login`);
            } else {
                if (this.state.password.trim().length === 0) {
                    alert('Your password cannot be an empty string!')
                } else {
                    alert('Whitespaces are not allowed in the beginning and end of your password!')
                }
            }
        } catch (error) {
            alert(`Something went wrong during the registration: \n${handleError(error)}`)
            this.props.history.push('/register');
        }
    }

    async login() {
        try {
            this.props.history.push(`/login`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    }

    /**
     *  Every time the user enters something in the input field, the state gets updated.
     * @param key (the key of the state for identifying the field that needs to be updated)
     * @param value (the value that gets assigned to the identified state key)
     */
    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({[key]: value});
    }

    /**
     * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
     * Initialization that requires DOM nodes should go here.
     * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
     * You may call setState() immediately in componentDidMount().
     * It will trigger an extra rendering, but it will happen before the browser updates the screen.
     */
    componentDidMount() {
    }

    render() {
        return (
            <BaseContainer style={background}>
                <img className={"center"} src={JustOneLogo} alt={"JustOneLogo"}/>
                <RulesButtonContainer>
                    <LogoutButton
                        width="255px"
                        onClick={() => {
                            this.props.history.push("/tutorial");
                        }}
                    >
                        Rules
                    </LogoutButton>
                </RulesButtonContainer>
                <FormContainer>
                    <Form>
                        <UsernameInputField
                            placeholder="Username"
                            onChange={e => {
                                this.handleInputChange('username', e.target.value);
                            }}
                        />
                        <PasswordInputField
                            placeholder="Password"
                            onChange={e => {
                                this.handleInputChange('password', e.target.value);
                            }}
                        />
                        <RepeatPasswordInputField
                            placeholder="Confirm Password"
                            onChange={e => {
                                this.handleInputChange('repeatedPassword', e.target.value);
                            }}
                        />
                    </Form>
                </FormContainer>
                <ButtonGroup>
                    <ButtonContainer>
                        <Button
                            disabled={!this.state.username || !this.state.repeatedPassword || !this.state.password}
                            width="50%"
                            onClick={() => {
                                if (this.state.repeatedPassword === this.state.password) this.register();
                                else throw alert("Passwords do not match!")
                            }}
                        >
                            Register as new User
                        </Button>
                    </ButtonContainer>
                    <ButtonContainer>
                        <Button
                            width="50%"
                            onClick={() => {
                                this.login();
                            }}
                        >
                            Login with Account
                        </Button>
                    </ButtonContainer>
                </ButtonGroup>
            </BaseContainer>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Register);
