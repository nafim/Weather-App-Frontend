import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Grid
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { UserStatus } from './constants';
import { Redirect } from 'react-router';

const useStyles = makeStyles((theme) => ({
    card: {
        'background-image': 'linear-gradient(to top left, #71b8ec, #acd7f7, #def7ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: theme.spacing(2)
    }
}));

// Greeting Logic
class Greeting extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this.setChangePassword = this.setChangePassword.bind(this);
        this.state = {
            changePassword: false
        }
    }

    handleLogout() {
        localStorage.removeItem('weather-app-token');
        this.props.setStatus(UserStatus.LOGGING_IN)
        this.props.handleLogoutCardUpdate();
    }

    setChangePassword(changePassword) {
        this.setState(
            {
                changePassword
            }
        )
    }


    render() {
        if (!this.state.changePassword) {
            return (
                <GreetingCard
                    user={this.props.user}
                    handleLogout={this.handleLogout}
                    setChangePassword={this.setChangePassword}
                />
            )
        } else {
            return(
                <Redirect to="/changePassword" />
            )
        }
    }
}

Greeting.propTypes = {
    user: PropTypes.string.isRequired,
    handleLogoutCardUpdate: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired
}

// Greeting Card Logic
function GreetingCard({ user, handleLogout, setChangePassword }) {
    const classes = useStyles();
    return (
        <Card className={classes.card}>
            <CardContent>
                <div className={classes.title}>
                    <Typography variant='h5' align="center" color="textSecondary">
                        Welcome!
                    </Typography>
                    <Typography align="center" color="textSecondary">
                        User: <b> {user} </b>
                    </Typography>
                </div>
                {/* Buttons */}
                <Grid container spacing={1}
                direction="row"
                justify="center"
                alignItems="flex-start"
                >
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={e => setChangePassword(true)}>
                            Change Password
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={e => handleLogout()}>
                            Logout
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

GreetingCard.propTypes = {
    user: PropTypes.string.isRequired,
    setChangePassword: PropTypes.func.isRequired,
    handleLogout: PropTypes.func.isRequired,
}

export default Greeting;