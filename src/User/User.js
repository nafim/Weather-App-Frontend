import React from 'react';
import PropTypes from 'prop-types';
import { UserStatus } from './constants';
import Login from './Login';
import Greeting from './Greeting';
import SignUp from './SignUp';
import Reset from './Reset';

// User Card Logic
class UserCard extends React.Component {
    constructor(props) {
        super(props);
        this.setStatus = this.setStatus.bind(this);
        this.setUser = this.setUser.bind(this);
        
        this.state = {
            status: UserStatus.LOGGING_IN,
            user: ""
        };
    }

    setStatus(newStatus) {
        this.setState(
            {
                status: newStatus
            }
        )
    }

    setUser(user) {
        this.setState(
            {
                user
            }
        )
    }

    render() {
        // if not logged in render the Login Card
        if (this.state.status === UserStatus.LOGGING_IN) {
            return (
                <Login
                    handleMergeCards={this.props.handleMergeCards}
                    setUser={this.setUser}
                    setStatus={this.setStatus}
                />
            )
        // if logged in render the Greeting card
        } else if (this.state.status === UserStatus.LOGGED_IN) {
            return(
                <Greeting
                    user={this.state.user}
                    handleLogoutCardUpdate={this.props.handleLogoutCardUpdate}
                    setStatus={this.setStatus}
                />
            )
        // if user is signing up render the sign up card
        } else if (this.state.status === UserStatus.SIGNING_UP) {
            return(
                <SignUp
                    setUser={this.setUser}
                    handleMergeCards={this.props.handleMergeCards}
                    setStatus={this.setStatus}
                />
            )
        // if user is resetting password, render the reset card
        } else if (this.state.status === UserStatus.RESET_PASSWORD) {
            return(
                <Reset
                    setStatus={this.setStatus}
                />
            )
        }
    }
}

UserCard.propTypes = {
    handleMergeCards: PropTypes.func.isRequired,
    handleLogoutCardUpdate: PropTypes.func.isRequired
}

export default UserCard;