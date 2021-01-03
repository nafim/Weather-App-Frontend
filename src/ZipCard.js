import {
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    IconButton,
    FormHelperText,
} from '@material-ui/core';

import PropTypes from 'prop-types';
import ArrowForward from '@material-ui/icons/ArrowForward';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    card: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(0),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        'background-image': 'linear-gradient(to top left, #cdebff, #cdebff)'
    },
    title: {
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: theme.spacing(0)
    }
}));


function ZipCard({ submitZip, zipcode, handleZipcodeChange, error, errorText }) {
    const classes = useStyles();
    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography className={classes.title} align="center" color="textSecondary">
                    Enter a zipcode
            </Typography>
                <form noValidate autoComplete="off" onSubmit={(e) => {
                    e.preventDefault();
                    submitZip();
                }}>
                    <FormControl error={error}>
                        <InputLabel htmlFor="zipcode">Zipcode</InputLabel>
                        <Input
                            id="zipcode"
                            type='text'
                            value={zipcode}
                            onChange={handleZipcodeChange}
                            autoFocus={true}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="add zipcode"
                                        onClick={submitZip}
                                        edge="end"
                                    >
                                        <ArrowForward />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText id="zipcode-error-text">{errorText}</FormHelperText>
                    </FormControl>
                </form>
            </CardContent>
        </Card>
    );
}

ZipCard.propTypes = {
    zipcode: PropTypes.string.isRequired,
    handleZipcodeChange: PropTypes.func.isRequired,
    submitZip: PropTypes.func.isRequired
}

export default ZipCard;