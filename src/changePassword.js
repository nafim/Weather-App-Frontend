
import React from 'react';
import clsx from 'clsx';
import {
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    FilledInput,
    InputAdornment,
    IconButton,
    Snackbar,
    Divider,
    Container,
    Grid,
    FormHelperText,
    Button,
    } from '@material-ui/core';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    Redirect,
    useParams
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    login: {
        padding: theme.spacing(2, 0, 2),
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
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
        paddingBottom: theme.spacing(2)
    }
}));

function ChangePasswordPath() {
    const { key } = useParams();
    let token = undefined;
    if (key) {
        localStorage.setItem('weather-app-token', key);
        token = key;
    } else {
        token = localStorage.getItem('weather-app-token');
    }
    if (token) {
        return(
        <ChangePassword token={token} />
        )
    } else {
        return(
            <Redirect to='/' />
        )
    }
}

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.setPassword = this.setPassword.bind(this);
        this.setConfirmPassword = this.setConfirmPassword.bind(this);
        this.setErrors = this.setErrors.bind(this);
        this.setGoHome = this.setGoHome.bind(this);
        this.handleChangePassword =  this.handleChangePassword.bind(this)
        
        this.state = {
            password: '',
            confirmPassword: '',
            success: false,
            successMessage: "",
            goHome: false,
            errors: {
                errorPassword: false,
                errorPasswordText: "",
                errorConfirmPassword: false,
                errorConfirmPasswordText: "",
                errorMisc: false,
                errorMiscText: ""
            }
        };
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

    setSuccess(successMessage) {
        this.setState(
            {
                success: true,
                successMessage
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

    setGoHome(goHome) {
        this.setState(
            {
                goHome
            }
        )
    }

    handleChangePassword() {
        // if no forms filled, then do nothing
        if (!this.state.password && !this.state.confirmPassword) return;
        fetch(process.env.REACT_APP_API_ENDPOINT + "/user/changePassword", {
            method: "POST",
            headers: {
            "Content-Type": 'application/json',
            'Authorization': 'Bearer ' + this.props.token
            },
            body: JSON.stringify ({
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            }),
        })
        .then(res => res.json())  
        .then(data => {
            // if email is invalid, there will be data.error
            if (data.error) {
                // if there is a password error
                if (data.errorItem === "password") {
                    const newErrors = {
                        errorPassword: true,
                        errorPasswordText: data.error,
                        errorConfirmPassword: false,
                        errorConfirmPasswordText: "",
                        errorMisc: false,
                        errorMiscText: ""
                    };
                    this.setErrors(newErrors);
                    this.setPassword("");
                    return this.setConfirmPassword("");
                // if there is a confirmPassword error
                } else if (data.errorItem === "confirmPassword") {
                    const newErrors = {
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
                // if there is a confirmPassword error
                }
            }
            this.setSuccess(data.success);
        })
        .catch(err => {
            const newErrors = {
                errorPassword: false,
                errorPasswordText: "",
                errorConfirmPassword: false,
                errorConfirmPasswordText: "",
                errorMisc: true,
                errorMiscText: "Something went wrong, please try again"
            };
            this.setErrors(newErrors);
            this.setPassword("");
            return this.setConfirmPassword("");
        })
    }

    render() {
        if (this.state.goHome) {
            return <Redirect to="/" />
        } else if (!this.state.success) {
            return (
                <ChangePasswordCard
                password={this.state.password}
                confirmPassword={this.state.confirmPassword}
                setPassword={this.setPassword}
                setConfirmPassword={this.setConfirmPassword}
                setErrors={this.setErrors}
                errors={this.state.errors}
                handleChangePassword={this.handleChangePassword}
                setGoHome={this.setGoHome}
                />
            )
        } else {
            return (
                <SuccessCard
                    message={this.state.successMessage}
                    setGoHome={this.setGoHome}
                />
            )
        }
    }
}

ChangePassword.propTypes = {
    token: PropTypes.string.isRequired
}

function ChangePasswordCard({password, confirmPassword,  setPassword, setConfirmPassword, setErrors, handleChangePassword, errors, setGoHome}) {
    const classes = useStyles();
    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        const newErrors = {
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
        <Container className={classes.login}>
            <Grid className={classes.centered}>
                <Grid item xs={12} md={9}>
                    <Card className={classes.card}>
                    <CardContent>
                    <Typography className={classes.title} variant='h5' align="center" color="textSecondary">
                        Change Password
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
                    <div>
                        <form className={classes.title} noValidate autoComplete="off" onSubmit={(e) => {
                            e.preventDefault();
                            handleChangePassword();
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
                            handleChangePassword();
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
                                    onClick={handleChangePassword}
                                    >
                                    <ArrowForward />
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                            <FormHelperText id="password-error-text">{errors.errorConfirmPasswordText}</FormHelperText>
                            </FormControl>
                        </form>
                    </div>
                    </CardContent>
                    <Container className={classes.button} >
                            <Button variant="contained" color="default" onClick={e => setGoHome(true)}>
                                Go Home
                            </Button>
                        </Container>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

ChangePasswordCard.propTypes = {
    password: PropTypes.string.isRequired,
    confirmPassword: PropTypes.string.isRequired,
    setPassword: PropTypes.func.isRequired,
    setConfirmPassword: PropTypes.func.isRequired,
    setErrors: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    handleChangePassword: PropTypes.func.isRequired,
    setGoHome: PropTypes.func.isRequired
}

function SuccessCard({message, setGoHome}) {
    const classes = useStyles();

    const goHome = () => {
        setGoHome(true);
    }

    return(
        <Container className={classes.login}>
            <Grid className={classes.centered}>
                <Grid item xs={12} md={9}>
                    <Card className={classes.card}>
                        <CardContent>
                        <div className={classes.title}>
                        <Typography variant='h5' align="center" color="textSecondary">
                            Change Password
                        </Typography>
                        <Typography align="center" color="textSecondary">
                            {message}
                        </Typography>
                        </div>
                        {/* Go back button */}
                        <Container className={classes.button} >
                            <Button variant="contained" color="default" onClick={e => goHome()}>
                                Go Home
                            </Button>
                        </Container>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

SuccessCard.propTypes = {
    message: PropTypes.string.isRequired,
    setGoHome: PropTypes.func.isRequired
}

export default ChangePasswordPath;