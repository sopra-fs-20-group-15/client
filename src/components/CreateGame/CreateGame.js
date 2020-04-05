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

// "text-decoration-skip-ink: none" is used to make sure that the brackets are underlined too
// needs "text-align: center" because some titles span over two lines
const GridItemTitle = styled.div`
  background: #FCC812;
  font-family: Happy Monkey;
  font-size: 24px;
  text-decoration: underline;
  text-transform: uppercase;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  text-decoration-skip-ink: none;
`;

const Container = styled(BaseContainer)`
  border-radius: 25px;
  border-style: solid;
  position: absolute;
  height: 338px
  left: 27.71%;
  right: 27.71%;
  top: 29%;
`;

const GridContainer = styled(BaseContainer)`
  display: grid;
  grid-template-columns: 300px auto;
  grid-gap: 3px 3px;
  background-color: #000000;
  border-radius: 25px;
  border-style: solid;
  position: absolute;
  height: 350px
  left: 27.71%;
  right: 27.71%;
  top: 29%;
`;

const GridItemInput = styled.div`
  background: #ECDD8F;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const GameName = styled(BaseContainer)`
  position: absolute;
  border-style: solid;
  border-top-left-radius: 25px
  width: 293px;
  height: 70px;
  margin-left: -3px;
  margin-top: -3px;
  background: #FCC812;
  font-family: Happy Monkey;
  font-size: 24px;
  text-decoration: underline;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// needs "text-align: center" because text spans over two lines
const NumberOfPlayers = styled(BaseContainer)`
  position: absolute;
  border-style: solid;
  width: 293px;
  height: 70px;
  margin-left: -3px;
  margin-top: 64px;
  background: #FCC812;
  font-family: Happy Monkey;
  font-size: 24px;
  text-decoration: underline;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
`;

const Angels = styled(BaseContainer)`
  position: absolute;
  border-style: solid;
  width: 293px;
  height: 70px;
  margin-left: -3px;
  margin-top: 131px;
  background: #FCC812;
  font-family: Happy Monkey;
  font-size: 24px;
  text-decoration: underline;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Devils = styled(BaseContainer)`
  position: absolute;
  border-style: solid;
  width: 293px;
  height: 70px;
  margin-left: -3px;
  margin-top: 198px;
  background: #FCC812;
  font-family: Happy Monkey;
  font-size: 24px;
  text-decoration: underline;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// "text-decoration-skip-ink: none" is used to make sure that the brackets are underlined too
const Password = styled(BaseContainer)`
  position: absolute;
  border-style: solid;
  border-bottom-left-radius: 25px
  width: 293px;
  height: 70px;
  margin-left: -3px;
  margin-top: 265px;
  background: #FCC812;
  font-family: Happy Monkey;
  font-size: 24px;
  text-decoration: underline;
  text-decoration-skip-ink: none;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GameName2 = styled(BaseContainer)`
    border-style: solid;
    border-top-right-radius: 25px;
    margin-left: auto;
    padding-left: 0px;
    margin-right: auto;
    padding-right: 0px;
    max-width: 1160px;
    position: absolute;
    height: 70px;
    left: 287px;
    right: -3px;
    top: -3px;
    bottom: 0px;
    background: #ECDD8F;
`;

const NumberOfPlayers2 = styled(BaseContainer)`
    border-style: solid;
    margin-left: auto;
    padding-left: 0px;
    margin-right: auto;
    padding-right: 0px;
    max-width: 1160px;
    position: absolute;
    height: 70px;
    left: 287px;
    right: -3px;
    top: 64px;
    bottom: 0px;
    background: #ECDD8F;
`;

const Angels2 = styled(BaseContainer)`
    border-style: solid;
    margin-left: auto;
    padding-left: 0px;
    margin-right: auto;
    padding-right: 0px;
    max-width: 1160px;
    position: absolute;
    height: 70px;
    left: 287px;
    right: -3px;
    top: 131px;
    bottom: 0px;
    background: #ECDD8F;
    display: flex;
    align-items: center;
`;

const Devils2 = styled(BaseContainer)`
    border-style: solid;
    margin-left: auto;
    padding-left: 0px;
    margin-right: auto;
    padding-right: 0px;
    max-width: 1160px;
    position: absolute;
    height: 70px;
    left: 287px;
    right: -3px;
    top: 198px;
    bottom: 0px;
    background: #ECDD8F;
    display: flex;
    align-items: center;
`;

const Password2 = styled(BaseContainer)`
    border-style: solid;
    border-bottom-right-radius: 25px;
    margin-left: auto;
    padding-left: 0px;
    margin-right: auto;
    padding-right: 0px;
    max-width: 1160px;
    position: absolute;
    height: 70px;
    left: 287px;
    right: -3px;
    top: 265px;
    bottom: 0px;
    background: #ECDD8F;
`;

const Minus = styled.div`
    position: absolute;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background: rgba(203, 189, 140, 0.54);
    left: 330px;
    font-size: 50px;
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    &:hover {
    transform: translateY(-2px);
    }
    width: ${props => props.width || null};
    border: none;
    cursor: ${props => (props.disabled ? "default" : "pointer")};
    opacity: ${props => (props.disabled ? 0.4 : 1)};
    transition: all 0.3s ease;
`;

const Plus = styled.div`
    position: absolute;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background: rgba(203, 189, 140, 0.54);
    right: 30px;
    font-size: 50px;
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    &:hover {
    transform: translateY(-2px);
    }
    width: ${props => props.width || null};
    border: none;
    cursor: ${props => (props.disabled ? "default" : "pointer")};
    opacity: ${props => (props.disabled ? 0.4 : 1)};
    transition: all 0.3s ease;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const InputField = styled.input`
  &::placeholder {
    font-family: Happy Monkey;
    color: rgba(0, 0, 0, 0.5);
  }
  position: absolute;
  width: 50%;
  height: 40px;
  background: rgba(203, 189, 140, 0.54);
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  border-color: rgba(203, 189, 140, 0.54);
  font-family: Happy Monkey;
`;

const Number = styled.div`
  font-family: Happy Monkey;
  font-size: 40px;
  justify-content: center;
  text-align: center;
`;

const ButtonGroup = styled.div`
  position: absolute;
  bottom: 10%;
  left: 30%;
  right: 30%;
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
            <BaseContainer>

                <GridContainer>
                    <GridItemTitle> Game Name </GridItemTitle>
                    <GridItemInput>
                        <InputField
                        placeholder="Enter here.."
                        />
                    </GridItemInput>

                    <GridItemTitle> Max. Number of Players </GridItemTitle>
                    <GridItemInput>
                        <select id="country" name="country">
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                        </select>
                    </GridItemInput>

                    <GridItemTitle> Add Angels </GridItemTitle>
                    <GridItemInput>
                        <Minus> - </Minus>
                        <Number> 0 </Number>
                        <Plus> + </Plus>
                    </GridItemInput>

                    <GridItemTitle> Add Devils </GridItemTitle>
                    <GridItemInput>
                        <Minus> - </Minus>
                        <Number> 0 </Number>
                        <Plus> + </Plus>
                    </GridItemInput>

                    <GridItemTitle> Password (Optional) </GridItemTitle>
                    <GridItemInput>
                        <InputField
                            placeholder="Enter here.."
                        />
                    </GridItemInput>
                </GridContainer>
                <ButtonGroup>
                    <ButtonContainer>
                        <Button
                            width="50%"
                            onClick={() => {

                            }}
                        >
                            Create Game
                        </Button>
                    </ButtonContainer>

                    <ButtonContainer>
                        <Button
                            width="50%"
                            onClick={() => {

                            }}
                        >
                            Cancel
                        </Button>
                    </ButtonContainer>
                </ButtonGroup>
            </BaseContainer>
        );
    }
}

export default withRouter(CreateGame);
