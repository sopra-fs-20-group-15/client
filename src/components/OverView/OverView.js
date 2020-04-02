import React, {Component} from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';





const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;



class OverView extends Component {
  constructor() {
    super();
    this.state = {
      users: null,
      userForProfile: null
    };
  }



  async logout() {
    try {
      // eslint-disable-next-line

      const requestBody = JSON.stringify({
        token: localStorage.getItem("token"),
        id: localStorage.getItem("id"),
      });
      // eslint-disable-next-line
      const response = await api.put('/logout', requestBody);

      // Logout successfully worked --> navigate to the route /login
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      this.props.history.push(`/login`);
    } catch (error) {
      alert(`Something went wrong during the logout: \n${handleError(error)}`)
      this.props.history.push('/login');
      localStorage.removeItem('token');
      localStorage.removeItem('id');
    }

  }


  async componentDidMount() {
    try {
      const response = await api.get('/users');
      // delays continuous execution of an async operation for 1 second.
      // This is just a fake async call, so that the spinner can be displayed
      // feel free to remove it :)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the returned users and update the state.
      this.setState({ users: response.data });

      // This is just some data for you to see what is available.
      // Feel free to remove it.
      console.log('request to:', response.request.responseURL);
      console.log('status code:', response.status);
      console.log('status text:', response.statusText);
      console.log('requested data:', response.data);

      // See here to get more data.
      console.log(response);
    } catch (error) {
      alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
    }
  }

  render() {
    return (
        <Container>
          <h2>User Overview </h2>
          <p>To inspect user click the user field:</p>
          {!this.state.users ? (
              <Spinner />
          ) : (
              <div>
                <Users>
                  {this.state.users.map(user => {
                    return (
                        <PlayerContainer onClick={() => {
                          this.props.history.push({
                            pathname: '/profile/'+user.id
                          })
                        }} key={user.id}>
                          <Player user={user} />
                        </PlayerContainer>
                    );
                  })}
                  
                </Users>
                <Button
                    width={"30%"}
                    onClick={() => {
                      this.logout();
                    }}
                >
                  Logout
                </Button>
              </div>
          )}
        </Container>
    );
  }
}

export default withRouter(OverView);
