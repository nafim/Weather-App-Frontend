import React from 'react';
import clsx from 'clsx';
import {
    Card,
    Link,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    FilledInput,
    InputAdornment,
    IconButton,
    Snackbar,
    FormHelperText,
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


// SignUp logic
class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.setConfirmPassword = this.setConfirmPassword.bind(this);
        this.setErrors = this.setErrors.bind(this);
        this.fetchLocations = this.fetchLocations.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            errors: {
                errorEmail: false,
                errorEmailText: "",
                errorPassword: false,
                errorPasswordText: "",
                errorConfirmPassword: false,
                errorConfirmPasswordText: "",
                errorMisc: false,
                errorMiscText: ""
            }
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

    setConfirmPassword(confirmPassword) {
        this.setState(
            {
                confirmPassword
            }
        )
    }

    setErrors(errors) {
        this.setState(
            {
                errors
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

    handleSignUp() {
        // if no forms filled, then do nothing
        if (!this.state.email && !this.state.password && !this.state.confirmPassword) return;
        fetch(process.env.REACT_APP_API_ENDPOINT + "/user/signup", {
            method: "POST",
            headers: {
            "Content-Type": 'application/json', 
            },
            body: JSON.stringify ({
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            }),
        })
        .then(res => res.json())  
        .then(data => {
            // if any of the fields are invalid, there will be data.error
            if (data.error) {
                // if there is an email error
                if (data.errorItem === "email") {
                    const newErrors = {
                        errorEmail: true,
                        errorEmailText: data.error,
                        errorPassword: false,
                        errorPasswordText: "",
                        errorConfirmPassword: false,
                        errorConfirmPasswordText: "",
                        errorMisc: false,
                        errorMiscText: ""
                    };
                    this.setErrors(newErrors)
                    this.setPassword("");
                    return this.setConfirmPassword("");
                // if there is a password error
                } else if (data.errorItem === "password") {
                    const newErrors = {
                        errorEmail: false,
                        errorEmailText: "",
                        errorPassword: true,
                        errorPasswordText: data.error,
                        errorConfirmPassword: false,
                        errorConfirmPasswordText: "",
                        errorMisc: false,
                        errorMiscText: ""
                    };
                    this.setErrors(newErrors)
                    this.setPassword("");
                    return this.setConfirmPassword("");
                // if there is a confirmPassword error
                } else if (data.errorItem === "confirmPassword") {
                    const newErrors = {
                        errorEmail: false,
                        errorEmailText: "",
                        errorPassword: false,
                        errorPasswordText: "",
                        errorConfirmPassword: true,
                        errorConfirmPasswordText: data.error,
                        errorMisc: false,
                        errorMiscText: ""
                    };
                    this.setErrors(newErrors)
                    this.setPassword("");
                    return this.setConfirmPassword("");
                }
            }
            localStorage.setItem('weather-app-token', data.token);
            this.fetchLocations();
            this.props.setStatus(UserStatus.LOGGED_IN);
        })
        .catch(err => {
            const newErrors = {
                errorEmail: false,
                errorEmailText: "",
                errorPassword: false,
                errorPasswordText: "",
                errorConfirmPassword: false,
                errorConfirmPasswordText: "",
                errorMisc: true,
                errorMiscText: "Something went wrong, please try again"
            };
            this.setErrors(newErrors)
            this.setPassword("");
            return this.setConfirmPassword("");
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
            <SignUpCard
                email={this.state.email}
                password={this.state.password}
                confirmPassword={this.state.confirmPassword}
                setEmail={this.setEmail}
                setPassword={this.setPassword}
                setConfirmPassword={this.setConfirmPassword}
                setErrors={this.setErrors}
                setStatus={this.props.setStatus}
                errors={this.state.errors}
                handleSignUp={this.handleSignUp}
            />
        )
    }
}

SignUp.propTypes = {
    setUser: PropTypes.func.isRequired,
    handleMergeCards: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired
}

// SignUp Card Logic
function SignUpCard({email, password, confirmPassword, setEmail, setPassword, setConfirmPassword, setErrors, setStatus, handleSignUp, errors}) {
    const classes = useStyles();
    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        const newErrors = {
            errorEmail: false,
            errorEmailText: "",
            errorPassword: false,
            errorPasswordText: "",
            errorConfirmPassword: false,
            errorConfirmPasswordText: "",
            errorMisc: false,
            errorMiscText: ""
        };
        setErrors( newErrors );
    };
    return(
        <Card className={classes.card}>
        <CardContent>
        <Typography className={classes.title} variant='h5' align="center" color="textSecondary">
            Sign Up
        </Typography>
        <Divider variant="middle" />
        <div className={classes.title}>
            <Snackbar 
            open={errors.errorMisc} 
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
            autoHideDuration={6000}
            onClose={handleCloseError}
            >
                <Alert onClose={handleCloseError} severity="error">
                    {errors.errorMiscText}
                </Alert>
            </Snackbar>
        </div>
        {/* SignUp form */}
        <div className={classes.title}>
            <form className={classes.title} noValidate autoComplete="off" onSubmit={(e) => {
                        e.preventDefault();
                        handleSignUp();
                    }}>
                <FormControl className={clsx(classes.margin, classes.textField)} variant="filled" error={errors.errorEmail}>
                <InputLabel htmlFor="email">Email</InputLabel>
                <FilledInput
                    id="email"
                    type='text'
                    onChange={(evt) => setEmail(evt.target.value)}
                    value={email}
                />
                <FormHelperText id="email-error-text">{errors.errorEmailText}</FormHelperText>
                </FormControl>
            </form>

            <form className={classes.title} noValidate autoComplete="off" onSubmit={(e) => {
                e.preventDefault();
                handleSignUp();
            }}>
                <FormControl className={clsx(classes.margin, classes.textField)} variant="filled" error={errors.errorPassword}>
                <InputLabel htmlFor="password">Passsord</InputLabel>
                <FilledInput
                    id="password"
                    type='password'
                    onChange={(evt) => setPassword(evt.target.value)}
                    value={password}
                />
                <FormHelperText id="password-error-text">{errors.errorPasswordText}</FormHelperText>
                </FormControl>
            </form>

            <form className={classes.title} noValidate autoComplete="off" onSubmit={(e) => {
                e.preventDefault();
                handleSignUp();
            }}>
                <FormControl className={clsx(classes.margin, classes.textField)} variant="filled" error={errors.errorConfirmPassword}>
                <InputLabel htmlFor="password">Confirm Password</InputLabel>
                <FilledInput
                    id="confirmPassword"
                    type='password'
                    onChange={(evt) => setConfirmPassword(evt.target.value)}
                    value={confirmPassword}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="submit SignUp info"
                        edge="end"
                        onClick={handleSignUp}
                        >
                        <ArrowForward />
                        </IconButton>
                    </InputAdornment>
                    }
                />
                <FormHelperText id="confirmPassword-error-text">{errors.errorConfirmPasswordText}</FormHelperText>
                </FormControl>
            </form>
        </div>
        {/* Registration Link */}
        <Typography align="center" color="textSecondary">
            {"Already have an account? "}
            <Link href="#" onClick={(event) => {
                event.preventDefault();
                setStatus(UserStatus.LOGGING_IN);
            }}>
                Sign in
            </Link>
        </Typography>
        </CardContent>
    </Card>
    )
}

SignUpCard.propTypes = {
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    confirmPassword: PropTypes.string.isRequired,
    setEmail: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
    setConfirmPassword: PropTypes.func.isRequired,
    setErrors: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    handleSignUp: PropTypes.func.isRequired,
}

export default SignUp;