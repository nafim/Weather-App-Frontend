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
    FormHelperText,
    Divider,
    Container,
    Button,
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


// Reset logic
class Reset extends React.Component {
    constructor(props) {
        super(props);
        this.setEmail = this.setEmail.bind(this);
        this.setErrors = this.setErrors.bind(this);
        this.handleReset = this.handleReset.bind(this);
        
        this.state = {
            email: '',
            success: false,
            successMessage: "",
            errors: {
                errorEmail: false,
                errorEmailText: "",
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

    setErrors(errors) {
        this.setState(
            {
                errors
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

    handleReset() {
        // if no forms filled, then do nothing
        if (!this.state.email && !this.state.password && !this.state.confirmPassword) return;
        fetch(process.env.REACT_APP_API_ENDPOINT + "/user/sendResetEmail", {
            method: "POST",
            headers: {
            "Content-Type": 'application/json', 
            },
            body: JSON.stringify ({
                email: this.state.email,
            }),
        })
        .then(res => res.json())  
        .then(data => {
            // if email is invalid, there will be data.error
            if (data.error) {
                const newErrors = {
                    errorEmail: true,
                    errorEmailText: data.error,
                    errorMisc: false,
                    errorMiscText: ""
                };
                return this.setErrors(newErrors);
            }
            this.setSuccess(data.success);
        })
        .catch(err => {
            const newErrors = {
                errorEmail: false,
                errorEmailText: "",
                errorMisc: true,
                errorMiscText: "Something went wrong, please try again"
            };
            this.setErrors(newErrors);
            return this.setEmail("");
        })
    }

    render() {
        if (!this.state.success) {
            return (
                <ResetCard
                    email={this.state.email}
                    setEmail={this.setEmail}
                    setErrors={this.setErrors}
                    setStatus={this.props.setStatus}
                    errors={this.state.errors}
                    handleReset={this.handleReset}
                />
            )
        } else {
            return (
                <SuccessCard
                    message={this.state.successMessage}
                    setStatus={this.props.setStatus}
                />
            )
        }
    }
}

Reset.propTypes = {
    setStatus: PropTypes.func.isRequired
}

// Reset Card Logic
function ResetCard({email, setEmail, setErrors, setStatus, handleReset, errors}) {
    const classes = useStyles();
    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        const newErrors = {
            errorEmail: false,
            errorEmailText: "",
            errorMisc: false,
            errorMiscText: ""
        };
        setErrors( newErrors );
    };
    return(
        <Card className={classes.card}>
        <CardContent>
        <div className={classes.title}>
        <Typography variant='h5' align="center" color="textSecondary">
            Reset Password
        </Typography>
        <Typography align="center" color="textSecondary">
            Send an email to reset your password
        </Typography>
        </div>
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
        {/* Reset form */}
        <div>
            <form className={classes.title} noValidate autoComplete="off" onSubmit={(e) => {
                e.preventDefault();
                handleReset();
            }}>
                <FormControl className={clsx(classes.margin, classes.textField)} variant="filled" error={errors.errorEmail}>
                <InputLabel htmlFor="email">Email</InputLabel>
                <FilledInput
                    id="email"
                    type='text'
                    onChange={(evt) => setEmail(evt.target.value)}
                    value={email}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="submit Reset info"
                        edge="end"
                        onClick={handleReset}
                        >
                        <ArrowForward />
                        </IconButton>
                    </InputAdornment>
                    }
                />
                <FormHelperText id="email-error-text">{errors.errorEmailText}</FormHelperText>
                </FormControl>
            </form>
        </div>
        {/* Cancel reset button */}
        <Container className={classes.button} >
            <Button color="secondary" onClick={e => setStatus(UserStatus.LOGGING_IN)}>
                Cancel
            </Button>
        </Container>
        </CardContent>
    </Card>
    )
}

ResetCard.propTypes = {
    email: PropTypes.string.isRequired,
    setEmail: PropTypes.func.isRequired,
    setErrors: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    handleReset: PropTypes.func.isRequired,
}

// Success Card Logic
function SuccessCard({message, setStatus}) {
    const classes = useStyles();
    return(
        <Card className={classes.card}>
        <CardContent>
        <div className={classes.title}>
        <Typography variant='h5' align="center" color="textSecondary">
            Reset Password
        </Typography>
        <Typography align="center" color="textSecondary">
            {message}
        </Typography>
        </div>
        {/* Go back button */}
        <Container className={classes.button} >
            <Button variant="contained" color="default" onClick={e => setStatus(UserStatus.LOGGING_IN)}>
                Go Back
            </Button>
        </Container>
        </CardContent>
    </Card>
    )
}

SuccessCard.propTypes = {
    message: PropTypes.string.isRequired,
    setStatus: PropTypes.func.isRequired
}

export default Reset;