import React from 'react';
import {BaseContainer} from '../../helpers/layout';
import {api, handleError} from '../../helpers/api';
import {withRouter} from 'react-router-dom';
import {Button, LogoutButton} from '../../views/design/Button';
import TriangleBackground from "../../views/pictures/TriangleBackground.png";
import JustOneLogo from "../../views/pictures/JustOneLogo.png";
import {ButtonContainer, ButtonGroup, Form, FormContainer, RulesButtonContainer, UsernameInputField, PasswordInputField} from "../../views/design/RegisterAndLogin/RegisterAndLoginUI";

const background = {
    backgroundImage: "url(" + TriangleBackground + ")"
};

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class Login extends React.Component {
    /**
     * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
     * The constructor for a React component is called before it is mounted (rendered).
     * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
     * These fields are then handled in the onChange() methods in the resp. InputFields
     */
    constructor() {
        super();
        this.state = {
            username: null,
            password: null
        };
    }

    /**
     * HTTP POST request is sent to the backend.
     * If the request is successful, a new user is returned to the front-end
     * and its token is stored in the localStorage.
     */
    async login() {
        try {
            const requestBody = JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            });
            const response = await api.put('/login', requestBody);

            // Store the token into the local storage.
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('id', response.data.id);
            localStorage.setItem('username', this.state.username);

            // Login successfully worked --> navigate to the route /game in the GameRouter
            this.props.history.push(`/lobbyOverview`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    }

    async register() {
        try {
            this.props.history.push("/register")
        } catch (error) {
            alert("Something went wrong while trying to return to the registration screen")
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
                            localStorage.setItem('QA', "login");
                            this.props.history.push("/tutorial");
                        }}
                    >
                        Rules & Tutorial
                    </LogoutButton>
                </RulesButtonContainer>
                <FormContainer>
                    <Form>
                        <UsernameInputField
                            style={{top: "0px", bottom: "30px"}}
                            placeholder="Username"
                            onChange={e => {
                                this.handleInputChange('username', e.target.value);
                            }}
                        />
                        <PasswordInputField
                            style={{top: "30px", bottom: "30px"}}
                            placeholder="Password"
                            onChange={e => {
                                this.handleInputChange('password', e.target.value);
                            }}
                        />
                    </Form>
                </FormContainer>
                <ButtonGroup>
                    <ButtonContainer>
                        <Button
                            disabled={!this.state.username || !this.state.password}
                            width="50%"
                            onClick={() => {
                                this.login();
                            }}
                        >
                            Login
                        </Button>
                    </ButtonContainer>
                    <ButtonContainer>
                        <Button
                            width="50%"
                            onClick={() => {
                                this.register();
                            }}
                        >
                            Back to Registration
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
export default withRouter(Login);
