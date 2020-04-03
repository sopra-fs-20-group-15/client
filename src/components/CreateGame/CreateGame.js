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
  position: absolute;
  left: 27.71%;
  right: 27.78%;
  top: 29%;
  bottom: 25.44%;
`;

const GameName = styled(BaseContainer)`
  position: absolute;
  width: 293px;
  height: 82px;
  left: 0px;
  top: 0px;
  background: #FCC812;
`;
  
const NumberOfPlayers = styled(BaseContainer)`
  position: absolute;
  width: 293px;
  height: 82px;
  left: 0px;
  top: 82px;
  background: #FCC812;
`;

const Angels = styled(BaseContainer)`
  position: absolute;
  width: 293px;
  height: 82px;
  left: 0px;
  top: 164px;
  background: #FCC812;
`;

const Devils = styled(BaseContainer)`
  position: absolute;
  width: 293px;
  height: 82px;
  left: 0px;
  top: 226px;
  background: #FCC812;
`;

const Password = styled(BaseContainer)`
  position: absolute;
  width: 293px;
  height: 82px;
  left: 0px;
  top: 308px;
  background: #FCC812;
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







class CreateGame extends Component{
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

    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    render() {
        return (
            <Container>
                <GameName> </GameName>
                <NumberOfPlayers> </NumberOfPlayers>
                <Angels> </Angels>
                <Devils> </Devils>
                <Password> </Password>
            </Container>
        );
    }
}

export default withRouter(CreateGame);
