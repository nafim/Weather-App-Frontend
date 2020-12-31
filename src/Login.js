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
    Button,
    Link,
    Container
    } from '@material-ui/core';
import ArrowForward from '@material-ui/icons/ArrowForward';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    card: {
        'background-color': '#e9e7fc'
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

function LoginCard() {
    const classes = useStyles();
    return(
        <Card className={classes.card}>
            <CardContent>
            <Typography className={classes.title} variant='h5' align="center" color="textSecondary">
                Please Log In
            </Typography>
            {/* Login form */}
            <form className={classes.title} noValidate autoComplete="off">
                <Grid container spacing={1}
                    direction="row"
                    justify="center"
                    alignItems="flex-start"
                >
                    <Grid item>
                            <FormControl className={clsx(classes.margin, classes.textField)} variant="filled">
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <FilledInput
                                id="email"
                                type='text'
                            />
                            </FormControl>
                    </Grid>

                    <Grid item>
                        <FormControl className={clsx(classes.margin, classes.textField)} variant="filled">
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <FilledInput
                            id="password"
                            type='password'
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="submit login info"
                                edge="end"
                                >
                                <ArrowForward />
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                        </FormControl>
                    </Grid>
                </Grid>
            </form>
            {/* Registration Link */}
            <Typography align="center" color="textSecondary">
                {"Don't have an account? "}
                <Link href="#" onClick={(event) => event.preventDefault}>
                    Sign Up
                </Link>
            </Typography>
            </CardContent>
        </Card>
    );
}

function GreetingCard({user}) {
    const classes = useStyles();
    return(
        <Card>
            <CardContent>
            <Typography className={classes.title} variant='h5' align="center" color="textSecondary">
                Welcome, {user}!
            </Typography>
            <Container className={classes.button}>
            <Button variant="contained" color="primary">
                Logout
            </Button>
            </Container>
            </CardContent>
        </Card>
    );
}

export {LoginCard, GreetingCard};