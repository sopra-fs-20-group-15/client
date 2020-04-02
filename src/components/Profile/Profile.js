import React, {Component} from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;






class Profile extends Component{
    constructor() {
        super();
        this.state = {
            username: null,
            id: null,
            status: null,
            visible: false,
        };
    }



    async componentDidMount() {
        try {
            const urlId=this.props.match.params.id;
            // const urlId=this.props.location.pathname.substring(this.props.location.pathname.lastIndexOf('/')+1);
            const response =
                await api.get('/users/'+urlId);
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
            this.props.history.push("/overview/")
        }
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
                        <ButtonContainer>
                            {   this.state.visible ?

                                <Button
                                    width="30%"
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname: "/profile/"+this.state.id+"/edit/",
                                            id: String(this.state.id)})
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

            </Container>
        );
    }
}

export default withRouter(Profile);
