import React, {Component} from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';

const FormContainer = styled.div`
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 50px;
  justify-content: center;
`;

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;

const Container2 = styled(BaseContainer)`
  color: white;
  text-align: center;
  margin-top: 80px
`;


const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;


const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 1.0);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
 `;







class ProfileEdit extends Component{
    constructor() {
        super();
        this.state = {
            username: null,
            id: null,
            status: null,
            visible: false,
            usernameToBeSet: null,
        };
    }


    async edit() {
        try {
            const requestBody = JSON.stringify({
                username: this.state.usernameToBeSet,
                token: localStorage.getItem("token"),
            });
            await api.put('/users/'+this.props.match.params.id, requestBody);

            // update successfully worked --> navigate to the route /login
            this.props.history.push(`/profile/`+this.props.match.params.id);
        } catch (error) {
            alert(`Something went wrong during the editing process: \n${handleError(error)}`)
            this.props.history.push('/overview/');
        }
    }

    async componentDidMount() {
        try{
            if (this.props.match.params.id!==localStorage.getItem("id")) {
                alert("Unauthorized access! You are not allowed to edit this profile.");
                this.props.history.push("/overview/");

            }
            else {
                try {
                    const urlId=this.props.match.params.id;
                    const response = await api.get('/users/'+urlId);
                    // delays continuous execution of an async operation for 1 second.
                    // This is just a fake async call, so that the spinner can be displayed
                    // feel free to remove it :)
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Get the returned users and update the state.


                    const user = response.data;

                    this.setState({
                        username: user.username,
                        id: user.id,
                        status: user.status
                    });

                    if (urlId.localeCompare(String(localStorage.getItem("id")))===0) this.setState({visible: true});

                    // This is just some data for you to see what is available.
                    // Feel free to remove it.
                    console.log('request to:', response.request.responseURL);
                    console.log('status code:', response.status);
                    console.log('status text:', response.statusText);
                    console.log('requested data:', response.data);

                    // See here to get more data.
                    console.log(response);
                } catch (error) {
                    alert(`Something went wrong while fetching the user: \n${handleError(error)}`);
                }

            }
        } catch (error) {}

    }

    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    render() {
        return (
            <Container>
                {!this.state.status ? (
                    <Spinner />
                ) : (
                    <div>
                        <h2>{this.state.username}'s Profile: </h2>
                        <p>Username: {this.state.username}</p>
                        <p>Status: {this.state.status}</p>
                        <Container2>
                            <h3>Please type in your new username if you wish to update your profile and press edit:</h3>
                        </Container2>
                        <Container>
                            <FormContainer>
                                    <Label>Username</Label>
                                    <InputField
                                        placeholder="Enter here.."
                                        onChange={e => {
                                            this.handleInputChange('usernameToBeSet', e.target.value);
                                        }}
                                    />
                            </FormContainer>
                        </Container>
                        <ButtonContainer>
                            {   this.state.visible ?

                                <Button
                                    disabled={!this.state.usernameToBeSet}
                                    width="30%"
                                    onClick={() => {
                                        this.edit()
                                    }}
                                >
                                    Edit
                                </Button>  : null
                            }
                        </ButtonContainer>
                        <ButtonContainer>
                            <Button
                                width="30%"
                                onClick={() => {
                                    this.props.history.push("/overview")
                                }}
                            >
                                Back to Overview
                            </Button>
                        </ButtonContainer>

                    </div>
                )}
            <Container2/>
            </Container>
        );
    }
}

export default withRouter(ProfileEdit);
