import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Container
    } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { UserStatus } from './constants';

const useStyles = makeStyles((theme) => ({
    card: {
        'background-image': 'linear-gradient(to top left, #71b8ec, #acd7f7, #def7ff)'
    },
    info: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: theme.spacing(2)
    },
    button: {
        display: 'flex',
        justifyContent: 'center',
    }
}));

// Greeting Logic
class Greeting extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    setStatus(newStatus) {
        this.setState(
            {
                status: newStatus
            }
        )
    }

    handleLogout() {
        localStorage.removeItem('weather-app-token');
        this.props.setStatus(UserStatus.LOGGING_IN)
        this.props.handleLogoutCardUpdate();
    }


    render() {
        return(
            <GreetingCard
                user={this.props.user}
                handleLogout={this.handleLogout}
            />
        )
    }
}

Greeting.propTypes = {
    user: PropTypes.string.isRequired,
    handleLogoutCardUpdate: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired
}

// Greeting Card Logic
function GreetingCard({user, handleLogout}) {
    const classes = useStyles();
    return(
        <Card className={classes.card}>
            <CardContent>
            <Typography className={classes.title} variant='h5' align="center" color="textSecondary">
                Welcome, {user}!
            </Typography>
            <Container className={classes.button}>
            <Button variant="contained" color="primary" onClick={e => handleLogout()}>
                Logout
            </Button>
            </Container>
            </CardContent>
        </Card>
    );
}

GreetingCard.propTypes = {
    user: PropTypes.string.isRequired,
    handleLogout: PropTypes.func.isRequired,
}

export default Greeting;