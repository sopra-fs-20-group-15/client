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

class Register extends React.Component {
    constructor() {
        super();
        this.state = {
            name: null,
            username: null
        };
        this.keyPressed = this.keyPressed.bind(this);
    }

    async register() {
        try {
            // eslint-disable-next-line
            if (this.state.password === this.state.password.trim()) {
                if (this.state.username === this.state.username.trim()) {
                    const requestBody = JSON.stringify({
                        username: this.state.username,
                        password: this.state.password,
                    });

                    await api.post('/players', requestBody);

                    // registration successfully worked --> navigate to the route /login
                    this.props.history.push(`/login`);
                } else {
                    if (this.state.username.trim().length === 0) {
                        alert('Your username cannot be an empty string!')
                    } else {
                        alert('Whitespaces are not allowed in the beginning and end of your username!')
                    }
                }
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


    async goToLogin() {
        try {
            this.props.history.push(`/login`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
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
            if (this.state.username && this.state.repeatedPassword && this.state.password) {
                if (this.state.repeatedPassword === this.state.password) {
                    this.register();
                } else {
                    alert("Passwords do not match!")
                }
            }
        }
    }

    render() {
        return (
            <BaseContainer style={background}>
                <PregameHeaderComponent from={"register"} history={this.props.history} loggedIn={false}/>
                <FormContainer>
                    <Form>
                        <UsernameInputField
                            placeholder="Username"
                            onChange={e => {
                                this.handleInputChange('username', e.target.value);
                            }}
                        />
                        <PasswordInputField
                            type={"password"}
                            placeholder="Password"
                            onChange={e => {
                                this.handleInputChange('password', e.target.value);
                            }}
                        />
                        <PasswordInputField
                            style={{top: "25px", bottom: "20px"}}
                            placeholder="Confirm Password"
                            type={"password"}
                            onChange={e => {
                                this.handleInputChange('repeatedPassword', e.target.value);
                            }}
                            onKeyDown={this.keyPressed}
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
                                this.goToLogin();
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
