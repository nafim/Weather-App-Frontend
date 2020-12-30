import { Container,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    IconButton,
    Button} from '@material-ui/core';
    
import PropTypes from 'prop-types';
import ArrowForward from '@material-ui/icons/ArrowForward';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(0),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: theme.spacing(0)
  },
  button: {
    display: 'flex',
    justifyContent: 'center'
  },
  info: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
    }));

function ZipCard({submitZip, zipcode, handleZipcodeChange}) {
    const classes = useStyles();
    return(
    <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} align="center" color="textSecondary">
              Enter a zipcode
            </Typography>
            <form onSubmit={(e) => {
              e.preventDefault();
              submitZip();
            }}>
            <FormControl>
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
              </FormControl>
              </form>
          </CardContent>
        </Card>
    );}

ZipCard.propTypes = {
  zipcode: PropTypes.string.isRequired,
  handleZipcodeChange: PropTypes.func.isRequired,
  submitZip: PropTypes.func.isRequired
}

function WeatherCard({city, weather, zipcode, removeZip}) {
    const classes = useStyles();
    return(
    <Card className={classes.card}>
            <CardContent>
            <Typography className={classes.title} variant="h6" align="center" color="textSecondary" gutterBottom>
                Weather in {city}
            </Typography>
            <img src="logo192.png" alt=""/>
            <Container className={classes.info}>
            <Typography color="textSecondary">
                Condition: {weather.condition} <br />
                Temperature: {weather.temp} <br />
                Humidity: {weather.humidity}% <br />
            </Typography>
            </Container>
            <Container className={classes.button}>
            <Button variant="contained" size="small" color="default" onClick={e => removeZip(zipcode)}>
                Remove
            </Button>
            </Container>
            </CardContent>
        </Card>
    );}

WeatherCard.propTypes = {
  zipcode: PropTypes.string.isRequired,
  removeZip: PropTypes.func.isRequired
}

export {ZipCard, WeatherCard};