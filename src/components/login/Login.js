import React from 'react';
import {BaseContainer} from '../../helpers/layout';
import {api, handleError} from '../../helpers/api';
import {withRouter} from 'react-router-dom';
import {Button} from '../../views/design/Button';
import TriangleBackground from "../../views/pictures/TriangleBackground.png";
import {ButtonContainer, ButtonGroup, Form, FormContainer, RulesButtonContainer, UsernameInputField, PasswordInputField} from "../../views/design/RegisterAndLogin/RegisterAndLoginUI";
import PregameHeaderComponent from "../../views/PregameHeaderComponent";

const background = {
    backgroundImage: "url(" + TriangleBackground + ")"
};


class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            username: null,
            password: null
        };
        this.keyPressed = this.keyPressed.bind(this);
    }

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

    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({[key]: value});
    }

    componentDidMount() {}

    keyPressed(e) {
        if (e.keyCode === 13) {
            if (this.state.username && this.state.password) {
                this.login();
            }
        }
    }

    render() {
        return (
            <BaseContainer style={background}>
                <PregameHeaderComponent from={"login"} history={this.props.history} loggedIn={false}/>
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
                            type={"password"}
                            onChange={e => {
                                this.handleInputChange('password', e.target.value);
                            }}
                            onKeyDown={this.keyPressed}
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
