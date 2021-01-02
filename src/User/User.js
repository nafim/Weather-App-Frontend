import React from 'react';
import PropTypes from 'prop-types';
import { UserStatus } from './constants';
import Login from './Login';
import Greeting from './Greeting';

// User Card Logic
class UserCard extends React.Component {
    constructor(props) {
        super(props);
        this.setStatus = this.setStatus.bind(this);
        
        this.state = {
            status: UserStatus.LOGGING_IN
        };
    }

    setStatus(newStatus) {
        this.setState(
            {
                status: newStatus
            }
        )
    }

    render() {
        // if not logged in render the Login Card
        if (this.state.status === UserStatus.LOGGING_IN) {
            return (
                <Login
                    handleMergeCards={this.props.handleMergeCards}
                    setStatus={this.setStatus}
                />
            )
        // if logged in render the Greeting card
        } else if (this.state.status === UserStatus.LOGGED_IN) {
            return(
                <Greeting
                    usser={"user"}
                    handleLogoutCardUpdate={this.props.handleLogoutCardUpdate}
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