import React from 'react';
import clsx from 'clsx';
import {
    Card,
    Grid,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    FilledInput,
    InputAdornment,
    IconButton,
    Link,
    Snackbar,
    Divider,
    } from '@material-ui/core';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Alert from '@material-ui/lab/Alert';
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


// Login logic
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.setError = this.setError.bind(this);
        this.fetchLocations = this.fetchLocations.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        
        this.state = {
            email: '',
            password: '',
            error: false,
            errorText: ""
        };
    }

    setEmail(email) {
        this.setState(
            {
                email
            }
        )
    }

    setPassword(password) {
        this.setState(
            {
                password
            }
        )
    }

    setError(isError, errorText) {
        this.setState(
            {
                error: isError,
                errorText
            }
        )
    }

    fetchLocations() {
        const token = localStorage.getItem('weather-app-token');
        fetch(process.env.REACT_APP_API_ENDPOINT + "/user/getLocations", {
            method: "GET",
            headers: {
            "Content-Type": 'application/json', 
            'Authorization': 'Bearer ' + token
            }
        })
        .then(res => res.json())
        .then(data => {
            // if token is invalid, then set user as not logged in yet, and delete existing token
            if (data.error) {
                localStorage.removeItem('weather-app-token');
                return this.props.setStatus(UserStatus.LOGGING_IN);
            }
            this.props.handleMergeCards(data.locations);
            this.props.setUser(data.user);
            this.props.setStatus(UserStatus.LOGGED_IN);
        })
    }

    handleLogin() {
        if (!this.state.email) return;
        if (!this.state.password) return;
        fetch(process.env.REACT_APP_API_ENDPOINT + "/user/getToken", {
            method: "POST",
            headers: {
            "Content-Type": 'application/json', 
            },
            body: JSON.stringify ({
                email: this.state.email,
                password: this.state.password
            }),
        })
        .then(res => res.json())  
        .then(data => {
            // if user/password if invalid, there will be data.error
            if (data.error) {
                this.setError(true, "Invalid email and password combination")
                return this.setPassword("");
            }
            localStorage.setItem('weather-app-token', data.token);
            this.fetchLocations();
            this.props.setStatus(UserStatus.LOGGED_IN);
        })
        .catch(err => {
            this.setError(true, "Something went wrong, please try again")
            this.setEmail("");
            return this.setPassword("");
        })
    }

    componentDidMount() {
        // check if logged in by fetching locations with existing token
        const token = localStorage.getItem('weather-app-token');
        if (token) {
            this.fetchLocations();
        }
    }

    render() {
        return (
            <LoginCard
                email={this.state.email}
                password={this.state.password}
                setEmail={this.setEmail}
                setPassword={this.setPassword}
                setError={this.setError}
                setStatus={this.props.setStatus}
                handleLogin={this.handleLogin}
                error={this.state.error}
                errorText={this.state.errorText}
            />
        )
    }
}

Login.propTypes = {
    handleMergeCards: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired
}

// Login Card Logic
function LoginCard({email, password, setEmail, setPassword, setError, setStatus, handleLogin, error, errorText}) {
    const classes = useStyles();
    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setError(false, "");
    };
    return(
        <Card className={classes.card}>
        <CardContent>
        <Typography className={classes.title} variant='h5' align="center" color="textSecondary">
            Please Log In
        </Typography>
        <Divider variant="middle" />
        <div className={classes.title}>
            <Snackbar 
            open={error} 
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
            autoHideDuration={6000}
            onClose={handleCloseError}
            >
                <Alert onClose={handleCloseError} severity="error">
                    {errorText}
                </Alert>
            </Snackbar>
        </div>
        {/* Login form */}
        <div className={classes.title}>
            <Grid container spacing={1}
                direction="row"
                justify="center"
                alignItems="flex-start"
            >
                <Grid item>
                <form noValidate autoComplete="off" onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}>
                        <FormControl className={clsx(classes.margin, classes.textField)} variant="filled" error={error}>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <FilledInput
                            id="email"
                            type='text'
                            onChange={(evt) => setEmail(evt.target.value)}
                            value={email}
                        />
                        </FormControl>
                    </form>
                </Grid>

                <Grid item>
                    <form noValidate autoComplete="off" onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}>
                        <FormControl className={clsx(classes.margin, classes.textField)} variant="filled" error={error}>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <FilledInput
                            id="password"
                            type='password'
                            onChange={(evt) => setPassword(evt.target.value)}
                            value={password}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="submit login info"
                                edge="end"
                                onClick={handleLogin}
                                >
                                <ArrowForward />
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                        </FormControl>
                    </form>
                </Grid>
            </Grid>
        </div>
        {/* Registration Link */}
        <Typography align="center" color="textSecondary">
            {"Don't have an account? "}
            <Link href="#" onClick={(event) => {
                event.preventDefault();
                setStatus(UserStatus.SIGNING_UP);
            }}>
                Sign Up
            </Link>
        </Typography>
        <Typography align="center" color="textSecondary">
            {"Forgot your password? "}
            <Link href="#" onClick={(event) => {
                event.preventDefault();
                setStatus(UserStatus.RESET_PASSWORD);
            }}>
                Reset
            </Link>
        </Typography>
        </CardContent>
    </Card>
    )
}

LoginCard.propTypes = {
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    setEmail: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired,
    handleLogin: PropTypes.func.isRequired,
    error: PropTypes.bool.isRequired,
    errorText: PropTypes.string.isRequired
}

export default Login;